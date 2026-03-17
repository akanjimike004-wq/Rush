import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getMarketingInsights(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web) || []
    };
  } catch (error) {
    console.error("Error fetching marketing insights:", error);
    return { text: "Sorry, I couldn't fetch insights at the moment.", sources: [] };
  }
}
