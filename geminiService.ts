
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceUserProfile = async (userData: UserData): Promise<AIAnalysis> => {
  const prompt = `Analise esta solicitação para a GOL/Smiles.
  Operador: ${userData.operador}
  Serviços: ${userData.tipo.join(", ")}
  Tickets/Protocolos (múltiplos permitidos): ${userData.tkt}
  Localizadores (múltiplos permitidos): ${userData.localizador}
  Data do Voo: ${userData.dataVoo}
  Observações: ${userData.bio}
  
  Importante: Processe todos os localizadores e protocolos informados, não importa a quantidade.
  
  JSON de saída:
  1. greeting: Saudação profissional para ${userData.operador} citando os localizadores ${userData.localizador}.
  2. professionalTitle: Título do atendimento.
  3. improvedBio: Texto técnico refinado.
  4. suggestedTags: 3 tags técnicas.
  5. summary: Resumo direto de uma frase.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          greeting: { type: Type.STRING },
          professionalTitle: { type: Type.STRING },
          improvedBio: { type: Type.STRING },
          suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING }
        },
        required: ["greeting", "professionalTitle", "improvedBio", "suggestedTags", "summary"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Sem resposta da IA");
  return JSON.parse(text) as AIAnalysis;
};
