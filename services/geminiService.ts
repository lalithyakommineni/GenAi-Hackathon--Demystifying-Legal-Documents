
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise, easy-to-understand summary of the document's purpose and key outcomes for the user. Written in plain English. Should be no more than 3-4 sentences.",
    },
    criticalAlerts: {
        type: Type.ARRAY,
        description: "A list of critical 'red flag' items that require the user's immediate attention. Focus on non-standard terms, potential liabilities, or significant restrictions. If there are no critical alerts, return an empty array.",
        items: { type: Type.STRING },
    },
    deadlines: {
      type: Type.ARRAY,
      description: "An array of important dates or deadlines mentioned in the document. If no specific dates are found, return an empty array.",
      items: {
        type: Type.OBJECT,
        properties: {
          date: {
            type: Type.STRING,
            description: "The specific date or deadline (e.g., 'YYYY-MM-DD', 'Within 30 days of signing').",
          },
          description: {
            type: Type.STRING,
            description: "A brief explanation of what the deadline is for.",
          },
        },
        required: ['date', 'description'],
      },
    },
    actionChecklist: {
        type: Type.ARRAY,
        description: "A short, actionable checklist of 3-5 key things the user should do or verify before signing or after signing. For example: 'Verify the payment schedule in Appendix A.' or 'Consult a tax advisor regarding clause 5.2'. If no actions are required, return an empty array.",
        items: { type: Type.STRING },
    },
    relevantAuthorities: {
        type: Type.ARRAY,
        description: "A list of any government bodies, regulatory authorities, or other official entities mentioned in the document that the user may need to interact with. If none are mentioned, return an empty array.",
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "The name of the authority or entity." },
                reason: { type: Type.STRING, description: "Why this authority is relevant according to the document." },
            },
            required: ['name', 'reason'],
        }
    },
    suggestions: {
        type: Type.ARRAY,
        description: "A list of 2-3 helpful suggestions or points to consider for the user, such as specific clauses to negotiate, or areas where they might want to seek further clarification. If no suggestions, return an empty array.",
        items: { type: Type.STRING },
    },
  },
  required: ['summary', 'criticalAlerts', 'deadlines', 'actionChecklist', 'relevantAuthorities', 'suggestions'],
};


export const analyzeDocument = async (text: string, fileDataUrl: string | null): Promise<AnalysisResult> => {
  const model = 'gemini-2.5-flash';

  const prompt = `
    You are an expert AI legal assistant named LexiGuard. Your purpose is to demystify complex legal documents for the average person and provide clear, actionable insights.
    Analyze the following legal document content. Your analysis must be structured according to the provided JSON schema.
    Do not provide legal advice. Your goal is to simplify, highlight risks, and suggest concrete next steps.
    Focus on extracting specific, actionable information like deadlines, required actions, and potential risks.
    The user needs to understand what they are agreeing to and what they need to do next.

    Here is the document content:
    ${text}
  `;

  const parts: any[] = [{ text: prompt }];

  if (fileDataUrl) {
    const mimeType = fileDataUrl.split(';')[0].split(':')[1];
    const data = fileDataUrl.split(',')[1];
    parts.unshift({
      inlineData: {
        mimeType,
        data,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });
    
    const result = JSON.parse(response.text);

    if (!result || !result.summary || !result.actionChecklist) {
      throw new Error("Invalid analysis structure received from API.");
    }
    
    return result as AnalysisResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI model could not process the document.");
  }
};