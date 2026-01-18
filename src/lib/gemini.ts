import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set in environment variables");
  }
  return new GoogleGenerativeAI(apiKey);
};

export type IntentType = "instruction" | "decision" | "question" | "discussion" | "action_item";

export interface MeetingConcept {
  id: string;
  text: string;
  simplifiedText: string;
  intent: IntentType;
  timestamp: number;
  keyPoints: string[];
  aslVideoId?: string;
  icon?: string;
}

export interface ProcessedTranscript {
  concepts: MeetingConcept[];
  summary: string;
}

const INTENT_ICONS: Record<IntentType, string> = {
  instruction: "📋",
  decision: "✅",
  question: "❓",
  discussion: "💬",
  action_item: "📌",
};

/**
 * Process meeting transcript using Gemini API
 * Segments speech into meaningful ideas and classifies intent
 */
export async function processTranscript(
  transcript: string
): Promise<ProcessedTranscript> {
  const model = getGeminiClient().getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are an ASL-friendly meeting companion that restructures spoken content for visual language cognition.

Analyze the following meeting transcript and:
1. Segment it into meaningful IDEAS (not sentences - group related thoughts together)
2. Classify each idea's intent: instruction, decision, question, discussion, or action_item
3. Generate simplified, structured text explanations for each idea
4. Extract 2-3 key points per idea

Return ONLY valid JSON in this exact format:
{
  "concepts": [
    {
      "id": "unique-id-1",
      "text": "original text segment",
      "simplifiedText": "simplified explanation for ASL-friendly understanding",
      "intent": "instruction|decision|question|discussion|action_item",
      "keyPoints": ["point 1", "point 2"]
    }
  ],
  "summary": "brief overall summary"
}

Transcript:
${transcript}

JSON:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (handle markdown code blocks if present)
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }
    
    // Find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Gemini response. Response: " + text.substring(0, 200));
    }
    
    let parsed: ProcessedTranscript;
    try {
      parsed = JSON.parse(jsonMatch[0]) as ProcessedTranscript;
    } catch (parseError) {
      throw new Error("Failed to parse JSON from Gemini response: " + (parseError instanceof Error ? parseError.message : String(parseError)));
    }
    
    // Validate response structure
    if (!parsed.concepts || !Array.isArray(parsed.concepts)) {
      throw new Error("Invalid response structure: missing or invalid concepts array");
    }
    
    // Add metadata to concepts
    const conceptsWithMetadata: MeetingConcept[] = parsed.concepts.map((concept, index) => ({
      ...concept,
      timestamp: Date.now() + index * 1000, // Simulated timestamps
      icon: INTENT_ICONS[concept.intent] || "💬",
      aslVideoId: `asl-${concept.intent}-${index}`, // Placeholder video ID
    }));
    
    return {
      ...parsed,
      concepts: conceptsWithMetadata,
      summary: parsed.summary || "Meeting summary not available",
    };
  } catch (error) {
    console.error("Error processing transcript with Gemini:", error);
    throw error;
  }
}

/**
 * Map concept to ASL video ID (placeholder implementation)
 * In production, this would map to actual pre-recorded ASL explanation videos
 */
export function getASLVideoUrl(concept: MeetingConcept): string {
  // Placeholder: return a placeholder video or map to actual video URLs
  // For now, return a placeholder
  return `/api/asl-videos/${concept.aslVideoId || 'placeholder'}.mp4`;
}
