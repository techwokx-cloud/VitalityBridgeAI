import language from "@google-cloud/language";

const nlpClient = new language.LanguageServiceClient({
  apiKey: process.env.GOOGLE_EMOTION_API_KEY,
});

/**
 * Emotion data types
 */
export interface Emotion {
  primary: "joy" | "sadness" | "anger" | "fear" | "surprise" | "neutral";
  secondary?: string;
  intensity: number; // 0-1
  confidence: number; // 0-1
}

export interface SentimentAnalysis {
  score: number; // -1.0 (negative) to 1.0 (positive)
  magnitude: number; // 0-1, strength of emotion
  sentences: Array<{
    text: string;
    score: number;
    magnitude: number;
  }>;
}

/**
 * Analyze emotion from text using Google NLP
 * Free tier: 50,000 analysis requests per day
 */
export async function analyzeEmotion(text: string): Promise<Emotion> {
  try {
    const document = {
      content: text,
      type: "PLAIN_TEXT" as const,
      language: "en",
    };

    const request = {
      document,
      encodingType: "UTF8" as const,
    };

    const [sentiment] = await nlpClient.analyzeSentiment(request);

    // Map sentiment score to emotion
    const score = sentiment.documentSentiment?.score || 0;
    const magnitude = sentiment.documentSentiment?.magnitude || 0;

    let emotion: Emotion["primary"] = "neutral";

    if (score > 0.5) emotion = "joy";
    else if (score > 0.25) emotion = "neutral";
    else if (score > -0.25) emotion = "neutral";
    else if (score > -0.5) emotion = "sadness";
    else emotion = "sadness";

    // Check for specific emotion indicators
    const emotionKeywords = {
      joy: ["happy", "excited", "great", "amazing", "love", "wonderful"],
      sadness: ["sad", "depressed", "down", "unhappy", "grief", "lost"],
      anger: ["angry", "furious", "mad", "frustrated", "rage", "outraged"],
      fear: ["afraid", "scared", "anxious", "worried", "nervous", "terrified"],
      surprise: [
        "shocked",
        "amazed",
        "surprised",
        "unexpected",
        "wow",
        "really",
      ],
    };

    const lowerText = text.toLowerCase();
    for (const [emo, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        emotion = emo as Emotion["primary"];
        break;
      }
    }

    return {
      primary: emotion,
      intensity: Math.abs(score),
      confidence: Math.min(magnitude, 1.0),
    };
  } catch (error) {
    console.error("Emotion analysis error:", error);
    return {
      primary: "neutral",
      intensity: 0,
      confidence: 0,
    };
  }
}

/**
 * Perform full sentiment analysis
 */
export async function analyzeSentiment(
  text: string
): Promise<SentimentAnalysis> {
  try {
    const document = {
      content: text,
      type: "PLAIN_TEXT" as const,
      language: "en",
    };

    const request = {
      document,
      encodingType: "UTF8" as const,
    };

    const [sentiment] = await nlpClient.analyzeSentiment(request);

    const analysis: SentimentAnalysis = {
      score: sentiment.documentSentiment?.score || 0,
      magnitude: sentiment.documentSentiment?.magnitude || 0,
      sentences: (sentiment.sentences || []).map((sent) => ({
        text: sent.text?.content || "",
        score: sent.sentiment?.score || 0,
        magnitude: sent.sentiment?.magnitude || 0,
      })),
    };

    return analysis;
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return {
      score: 0,
      magnitude: 0,
      sentences: [],
    };
  }
}

/**
 * Analyze entities in text (people, places, concepts)
 */
export async function analyzeEntities(text: string) {
  try {
    const document = {
      content: text,
      type: "PLAIN_TEXT" as const,
      language: "en",
    };

    const request = {
      document,
      encodingType: "UTF8" as const,
    };

    const [result] = await nlpClient.analyzeEntities(request);

    return (result.entities || []).map((entity) => ({
      name: entity.name,
      type: entity.type,
      salience: entity.salience,
      mentions: entity.mentions?.map((m) => ({
        text: m.text?.content,
        type: m.type,
      })),
    }));
  } catch (error) {
    console.error("Entity analysis error:", error);
    return [];
  }
}

/**
 * Detect conversation topics (using entity analysis)
 */
export async function detectTopics(text: string): Promise<string[]> {
  try {
    const entities = await analyzeEntities(text);
    return entities
      .filter((e) =>
        ["PERSON", "ORGANIZATION", "EVENT", "LOCATION"].includes(
          String(e.type)
        )
      )
      .sort((a, b) => (b.salience || 0) - (a.salience || 0))
      .slice(0, 5)
      .map((e) => e.name || "")
      .filter((name): name is string => Boolean(name));
  } catch (error) {
    console.error("Topic detection error:", error);
    return [];
  }
}

/**
 * Calculate mood score for dashboard/tracking
 */
export function calculateMoodScore(emotion: Emotion): number {
  const moodMap = {
    joy: 1.0,
    surprise: 0.7,
    neutral: 0.5,
    fear: 0.3,
    anger: 0.2,
    sadness: 0.1,
  };

  const baseScore = moodMap[emotion.primary];
  return (baseScore * emotion.intensity + 0.5 * (1 - emotion.intensity)) * 100;
}

/**
 * Generate emotion summary for a conversation
 */
export async function summarizeConversationEmotion(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<{
  overall: Emotion;
  trend: "improving" | "declining" | "stable";
  keyMoments: Array<{ timestamp: number; emotion: Emotion; text: string }>;
}> {
  const emotions: Emotion[] = [];
  const keyMoments = [];

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === "user") {
      const emotion = await analyzeEmotion(messages[i].content);
      emotions.push(emotion);

      // Mark shifts as key moments
      if (i > 0 && emotions[i - 1].primary !== emotion.primary) {
        keyMoments.push({
          timestamp: i,
          emotion,
          text: messages[i].content.substring(0, 100),
        });
      }
    }
  }

  // Calculate overall emotion
  const avgIntensity =
    emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length;
  const primaryEmotions = emotions.map((e) => e.primary);
  const mostCommon = primaryEmotions.sort(
    (a, b) => primaryEmotions.filter((x) => x === a).length
  )[primaryEmotions.length - 1];

  // Determine trend
  const recentEmotions = emotions.slice(-3);
  const oldEmotions = emotions.slice(0, 3);
  const recentAvg =
    recentEmotions.reduce((sum, e) => sum + emotionToNumber(e.primary), 0) /
    recentEmotions.length;
  const oldAvg =
    oldEmotions.reduce((sum, e) => sum + emotionToNumber(e.primary), 0) /
    oldEmotions.length;

  let trend: "improving" | "declining" | "stable" = "stable";
  if (recentAvg > oldAvg + 0.2) trend = "improving";
  else if (recentAvg < oldAvg - 0.2) trend = "declining";

  return {
    overall: {
      primary: mostCommon as Emotion["primary"],
      intensity: avgIntensity,
      confidence: emotions.length > 0 ? 0.8 : 0,
    },
    trend,
    keyMoments: keyMoments.slice(0, 5),
  };
}

/**
 * Helper: Convert emotion name to numeric score
 */
function emotionToNumber(emotion: string): number {
  const scores = {
    joy: 1.0,
    surprise: 0.7,
    neutral: 0.5,
    fear: 0.3,
    anger: 0.2,
    sadness: 0.1,
  };
  return scores[emotion as keyof typeof scores] || 0.5;
}

/**
 * Check if user needs support (based on emotion)
 */
export async function checkSupportNeeded(text: string): Promise<{
  needsSupport: boolean;
  severity: "low" | "medium" | "high";
  suggestedAction: string;
}> {
  const emotion = await analyzeEmotion(text);
  const sentiment = await analyzeSentiment(text);

  // Crisis indicators
  const crisisKeywords = [
    "suicide",
    "harm",
    "die",
    "hurt myself",
    "can't take it",
    "ending it all",
  ];
  const hasCrisisIndicator = crisisKeywords.some((kw) =>
    text.toLowerCase().includes(kw)
  );

  let severity: "low" | "medium" | "high" = "low";
  let suggestedAction = "";

  if (hasCrisisIndicator) {
    severity = "high";
    suggestedAction =
      "Please reach out to a crisis helpline: 988 (US), Samaritans 116 123 (UK)";
  } else if (emotion.primary === "sadness" && emotion.intensity > 0.7) {
    severity = "medium";
    suggestedAction = "Consider talking to someone you trust about how you're feeling";
  } else if (emotion.primary === "anger" && emotion.intensity > 0.8) {
    severity = "medium";
    suggestedAction = "Take a moment to calm down. Would a breathing exercise help?";
  } else if (sentiment.score < -0.5) {
    severity = "medium";
    suggestedAction = "You seem to be going through something difficult. I'm here to listen.";
  }

  return {
    needsSupport: severity !== "low",
    severity,
    suggestedAction,
  };
}
