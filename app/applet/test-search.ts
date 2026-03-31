import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: 'Find the standard healthy range for LDL Cholesterol and return it as JSON.',
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            range: { type: Type.STRING }
          }
        }
      }
    });
    console.log(res.text);
  } catch (e) {
    console.error(e);
  }
}
run();
