
import { GoogleGenAI, Type } from "@google/genai";
import { MealTime, RecipeResponse } from "../types";

export const generateRecipes = async (ingredients: string[], mealTime: MealTime): Promise<RecipeResponse> => {
  // 가이드라인: API 호출 직전에 인스턴스를 생성하여 최신 API_KEY를 반영하고 초기 로딩 에러 방지
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY가 설정되지 않았습니다. Vercel 환경 변수를 확인해주세요.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `냉장고에 있는 재료: ${ingredients.join(", ")}. 식사 시간: ${mealTime}. 
  이 재료들을 최대한 활용하여 ${mealTime}에 먹기 좋은 맛있는 요리 레시피 3가지를 추천해줘. 
  재료가 부족하다면 최소한의 기본 조미료는 있다고 가정해도 좋아. 답변은 반드시 한국어로 해줘.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                ingredients: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                instructions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                estimatedTime: { type: Type.STRING },
                difficulty: { type: Type.STRING, enum: ['쉬움', '보통', '어려움'] }
              },
              required: ["id", "name", "description", "ingredients", "instructions", "estimatedTime", "difficulty"]
            }
          }
        },
        required: ["recipes"]
      }
    }
  });

  return JSON.parse(response.text) as RecipeResponse;
};
