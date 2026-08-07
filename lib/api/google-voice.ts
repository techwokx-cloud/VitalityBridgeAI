import { SpeechClient } from "@google-cloud/speech";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import fs from "fs";
import path from "path";

// Initialize clients
const speechClient = new SpeechClient({
  apiKey: process.env.GOOGLE_CLOUD_STT_API_KEY,
});

const ttsClient = new TextToSpeechClient({
  apiKey: process.env.GOOGLE_CLOUD_TTS_API_KEY,
});

/**
 * Convert speech audio to text
 * Free tier: 60 minutes per month
 */
export async function speechToText(
  audioFile: Buffer | string,
  language: string = "en-US"
): Promise<{ text: string; confidence: number; isFinal: boolean }> {
  try {
    // If string, assume it's a file path
    let audio: Buffer;
    if (typeof audioFile === "string") {
      audio = fs.readFileSync(audioFile);
    } else {
      audio = audioFile;
    }

    const audioBase64 = audio.toString("base64");

    const request = {
      audio: {
        content: audioBase64,
      },
      config: {
        encoding: "LINEAR16" as const, // WAV format
        languageCode: language,
        sampleRateHertz: 16000,
        enableAutomaticPunctuation: true,
      },
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      ?.map((result: any) => result.alternatives[0].transcript)
      .join("\n");

    const confidence =
      response.results?.[0]?.alternatives?.[0]?.confidence || 0;
    const isFinal = (response.results?.length ?? 0) > 0;

    return {
      text: transcription || "",
      confidence,
      isFinal,
    };
  } catch (error) {
    console.error("Speech-to-Text error:", error);
    throw error;
  }
}

/**
 * Convert text to speech
 * Free tier: 1 million characters per month
 */
export async function textToSpeech(
  text: string,
  options?: {
    language?: string;
    voice?: string;
    pitch?: number;
    rate?: number;
  }
): Promise<{
  audio: Buffer;
  audioContent: string; // Base64
}> {
  try {
    const request = {
      input: { text },
      voice: {
        languageCode: options?.language || "en-US",
        name: options?.voice || "en-US-Neural2-C", // Female voice
      },
      audioConfig: {
        audioEncoding: "MP3" as const,
        pitch: options?.pitch || 0,
        speakingRate: options?.rate || 1.0,
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    if (typeof audioContent === "string") {
      return {
        audio: Buffer.from(audioContent, "base64"),
        audioContent,
      };
    }

    return {
      audio: audioContent as Buffer,
      audioContent: (audioContent as Buffer).toString("base64"),
    };
  } catch (error) {
    console.error("Text-to-Speech error:", error);
    throw error;
  }
}

/**
 * List available voices
 */
export async function listVoices(language?: string) {
  try {
    const request = {
      languageCode: language || "en-US",
    };

    const [response] = await ttsClient.listVoices(request);
    return response.voices?.map((voice: any) => ({
      name: voice.name,
      ssmlGender: voice.ssmlGender,
      naturalSampleRateHertz: voice.naturalSampleRateHertz,
      languageCodes: voice.languageCodes,
    }));
  } catch (error) {
    console.error("List voices error:", error);
    throw error;
  }
}

/**
 * Streaming speech recognition for real-time input
 */
export async function streamSpeechToText(audioStream: NodeJS.ReadableStream) {
  try {
    const request = {
      config: {
        encoding: "LINEAR16" as const,
        languageCode: "en-US",
        sampleRateHertz: 16000,
        enableAutomaticPunctuation: true,
      },
      interimResults: true,
    };

    const recognizeStream = speechClient.streamingRecognize(request);

    // Pipe audio stream
    audioStream.pipe(recognizeStream);

    return new Promise((resolve, reject) => {
      recognizeStream.on("data", (data: any) => {
        const result = data.results[0];
        const transcript = result.alternatives[0].transcript;
        const isFinal = result.isFinal;

        if (isFinal) {
          resolve({ text: transcript, isFinal: true });
        }
      });

      recognizeStream.on("error", reject);
    });
  } catch (error) {
    console.error("Streaming STT error:", error);
    throw error;
  }
}

/**
 * Companion-specific TTS with personality
 */
export async function companionSpeak(
  text: string,
  mood: "calm" | "warm" | "engaged" = "warm"
): Promise<Buffer> {
  const voiceMap = {
    calm: "en-US-Neural2-A", // Male, calm
    warm: "en-US-Neural2-C", // Female, warm
    engaged: "en-US-Neural2-E", // Female, energetic
  };

  const rateMap = {
    calm: 0.9,
    warm: 1.0,
    engaged: 1.1,
  };

  const pitchMap = {
    calm: 0,
    warm: 0,
    engaged: 2,
  };

  const { audio } = await textToSpeech(text, {
    language: "en-US",
    voice: voiceMap[mood],
    pitch: pitchMap[mood],
    rate: rateMap[mood],
  });

  return audio;
}

/**
 * Calculate STT usage (for monitoring quota)
 */
export async function getSpeechQuotaInfo(): Promise<{
  monthlyLimit: number; // 60 minutes
  usedMinutes: number; // Approximate based on API calls
  remainingMinutes: number;
}> {
  // Note: Google Cloud doesn't provide real-time quota API
  // This would need to be tracked manually or via Cloud Monitoring
  return {
    monthlyLimit: 60, // 60 minutes/month free
    usedMinutes: 0, // Track manually
    remainingMinutes: 60,
  };
}

/**
 * Calculate TTS usage (for monitoring quota)
 */
export async function getSynthesisQuotaInfo(): Promise<{
  monthlyLimit: number; // 1M characters
  usedCharacters: number; // Approximate
  remainingCharacters: number;
}> {
  return {
    monthlyLimit: 1000000, // 1M chars/month free
    usedCharacters: 0, // Track manually
    remainingCharacters: 1000000,
  };
}
