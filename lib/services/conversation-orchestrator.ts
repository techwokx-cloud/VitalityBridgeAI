import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import {
  textToSpeech,
  speechToText,
  companionSpeak,
} from "@/lib/api/google-voice";
import {
  generateCompanionResponse,
  generateResponseWithContext,
  suggestNextStep,
} from "@/lib/ai/gemini";
import {
  analyzeEmotion,
  analyzeSentiment,
  checkSupportNeeded,
  summarizeConversationEmotion,
} from "@/lib/api/google-emotion";
import {
  addConversation,
  addPattern,
  linkPatterns,
  addAction,
  getLifeMap,
} from "@/lib/api/neo4j";

/**
 * Conversation message type
 */
export interface ConversationMessage {
  id: string;
  role: "user" | "companion" | "system";
  content: string;
  emotion?: string;
  timestamp: Date;
  audioUrl?: string;
}

/**
 * Complete conversation response
 */
export interface ConversationResponse {
  message: string;
  audioUrl?: string;
  emotion: {
    primary: string;
    intensity: number;
    confidence: number;
  };
  nextStep?: string;
  supportNeeded: {
    needsSupport: boolean;
    severity: "low" | "medium" | "high";
    action: string;
  };
  patterns?: string[];
  tokensUsed: number;
}

/**
 * Handle a complete conversation turn
 * Optimized for free tier APIs
 */
export async function handleConversationTurn(
  userId: string,
  userMessage: string,
  conversationId: string,
  domain: string,
  options?: {
    voiceInput?: Buffer; // If voice input provided instead of text
    includeAudio?: boolean;
    includeNextStep?: boolean;
  }
): Promise<ConversationResponse> {
  const startTime = Date.now();
  const supabase = await createSupabaseClient();
  let totalTokens = 0;

  try {
    // ==========================================
    // 1. CONVERT VOICE TO TEXT (if provided)
    // ==========================================
    let inputText = userMessage;
    if (options?.voiceInput) {
      try {
        const sttResult = await speechToText(options.voiceInput);
        inputText = sttResult.text;
      } catch (error) {
        console.error("STT failed, using text fallback:", error);
        // Continue with text input
      }
    }

    // ==========================================
    // 2. ANALYZE EMOTION (Free: 50K/day)
    // ==========================================
    const emotion = await analyzeEmotion(inputText);
    const sentiment = await analyzeSentiment(inputText);

    // ==========================================
    // 3. CHECK FOR SUPPORT NEEDS
    // ==========================================
    const supportCheck = await checkSupportNeeded(inputText);

    // ==========================================
    // 4. GET COMPANION RESPONSE (Gemini - Free tier)
    // ==========================================
    // Build conversation context
    type RecentMessage = { role: string; content: string };

    const recentMessages: RecentMessage[] = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(5)
      .then((res: { data: RecentMessage[] | null }) => res.data?.reverse() || []);

    const response = await generateCompanionResponse(
      [
        ...recentMessages.map((m: RecentMessage) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: inputText },
      ],
      {
        emotion: emotion.primary,
        domain,
      }
    );

    totalTokens += response.tokensUsed || 0;

    // ==========================================
    // 5. GENERATE AUDIO RESPONSE (TTS - Free: 1M chars/month)
    // ==========================================
    let audioUrl: string | undefined;
    if (options?.includeAudio) {
      try {
        const audioBuffer = await companionSpeak(
          response.message,
          getMoodVoice(emotion.primary)
        );
        // Upload to Supabase Storage
        const filename = `audio_${Date.now()}.mp3`;
        const { data: uploadData } = await supabase.storage
          .from("conversation-audio")
          .upload(`${userId}/${filename}`, audioBuffer);

        if (uploadData?.path) {
          audioUrl = supabase.storage
            .from("conversation-audio")
            .getPublicUrl(uploadData.path).data.publicUrl;
        }
      } catch (error) {
        console.error("TTS failed:", error);
        // Continue without audio
      }
    }

    // ==========================================
    // 6. GET NEXT STEP SUGGESTION (Optional)
    // ==========================================
    let nextStep: string | undefined;
    if (options?.includeNextStep) {
      try {
        nextStep = await suggestNextStep(
          recentMessages.map((m: RecentMessage) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }))
        );
      } catch (error) {
        console.error("Next step suggestion failed:", error);
      }
    }

    // ==========================================
    // 7. STORE CONVERSATION IN SUPABASE
    // ==========================================
    const userMsgData = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role: "user",
        content: inputText,
        message_type: "text",
      })
      .select("id")
      .single();

    const compMsgData = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role: "companion",
        content: response.message,
        message_type: "text",
      })
      .select("id")
      .single();

    // Store emotion data
    await supabase.from("emotions").insert({
      user_id: userId,
      message_id: userMsgData.data?.id,
      emotion: emotion.primary,
      intensity: emotion.intensity,
      confidence: emotion.confidence,
      sentiment_score: sentiment.score,
      sentiment_magnitude: sentiment.magnitude,
    });

    // ==========================================
    // 8. UPDATE NEO4J GRAPH (Patterns & Relationships)
    // ==========================================
    try {
      // Add/update conversation in graph
      await addConversation(userId, conversationId, inputText, domain, emotion.primary);

      // Extract patterns from user message
      if (sentiment.score < -0.3) {
        await addPattern(userId, "Emotional difficulty", 1);
      }
      if (sentiment.magnitude > 0.7) {
        await addPattern(userId, "Strong emotional expression", 1);
      }

      // If voice of concern, suggest action
      if (supportCheck.needsSupport) {
        await addAction(
          userId,
          conversationId,
          supportCheck.suggestedAction,
          domain,
          supportCheck.severity === "high" ? "high" : "medium"
        );
      }
    } catch (error) {
      console.error("Neo4j update failed (non-critical):", error);
    }

    // ==========================================
    // 9. BUILD RESPONSE
    // ==========================================
    return {
      message: response.message,
      audioUrl,
      emotion: {
        primary: emotion.primary,
        intensity: emotion.intensity,
        confidence: emotion.confidence,
      },
      nextStep,
      supportNeeded: {
        needsSupport: supportCheck.needsSupport,
        severity: supportCheck.severity,
        action: supportCheck.suggestedAction,
      },
      tokensUsed: totalTokens,
    };
  } catch (error) {
    console.error("Conversation turn failed:", error);
    throw error;
  }
}

/**
 * Get conversation summary and patterns
 */
export async function getConversationSummary(
  userId: string,
  conversationId: string
) {
  const supabase = await createSupabaseClient();

  const messages = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (!messages.data || messages.data.length === 0) {
    return null;
  }

  // Analyze emotion progression
  const emotionSummary = await summarizeConversationEmotion(
    messages.data as any
  );

  // Get emerging patterns from Neo4j
  // TODO: Query Neo4j for patterns

  return {
    totalMessages: messages.data.length,
    emotionalArc: emotionSummary,
    timeSpent: "5 minutes", // Calculate from timestamps
  };
}

/**
 * Get Life Map for dashboard
 */
export async function getUserLifeMap(userId: string) {
  try {
    return await getLifeMap(userId);
  } catch (error) {
    console.error("Failed to get life map:", error);
    return null;
  }
}

/**
 * Helper: Get appropriate voice mood based on emotion
 */
function getMoodVoice(
  emotion: string
): "calm" | "warm" | "engaged" {
  switch (emotion) {
    case "sadness":
    case "fear":
      return "calm";
    case "joy":
    case "surprise":
      return "engaged";
    default:
      return "warm";
  }
}

/**
 * API Usage Analytics (for monitoring free tier limits)
 */
export async function getAPIUsageStats(userId: string, days: number = 30) {
  const supabase = await createSupabaseClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get message counts
  const { count: messageCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startDate.toISOString())
    .eq("role", "companion");

  // Get emotion analyses
  const { count: emotionCount } = await supabase
    .from("emotions")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startDate.toISOString())
    .eq("user_id", userId);

  // Estimate API usage
  return {
    estimatedGeminiTokens: (messageCount || 0) * 500, // Rough estimate
    gemminiCost: `$${((messageCount || 0) * 500 * 0.000075).toFixed(4)}`,
    emotionAnalyses: emotionCount || 0,
    emotionApiFree: emotionCount! < 50000 ? true : false,
    daysTracked: days,
  };
}
