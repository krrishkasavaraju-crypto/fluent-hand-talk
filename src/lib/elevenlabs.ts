/**
 * ElevenLabs API integration for text-to-speech
 * Used for Deaf-hearing collaboration (not interpretation)
 */

export interface ElevenLabsConfig {
  apiKey: string;
  voiceId?: string;
}

/**
 * Convert text to speech using ElevenLabs API
 * This allows Deaf users to send messages that are voiced to hearing participants
 */
export async function textToSpeech(
  text: string,
  config: ElevenLabsConfig
): Promise<Blob> {
  const voiceId = config.voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default voice

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": config.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${error}`);
  }

  return await response.blob();
}

/**
 * Play audio blob in the browser
 */
export function playAudio(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();
  audio.onended = () => URL.revokeObjectURL(url);
}
