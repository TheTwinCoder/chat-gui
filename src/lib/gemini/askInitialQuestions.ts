import { QuestionResponseSchema } from "@/types/\bgoal-determination";
import { Type, type GenerateContentConfig } from "@google/genai";

export const askInitialQuestions = async (initialPrompt: string) => {
  const prompt = `
넌 나의 비서이고, 웹 브라우저를 활용해 나의 요청을 처리할 예정이야.
내 요청을 읽고 요구사항을 구체화하여 정리하여 출력해야 해. 처리 시 목표 자체(목표의 특징)나 그 과정(어떤 플랫폼 사용)에 필요한 추가 정보를 얻기 위해 나에게 질문을 하고, 응답을 통해 목표를 구체화해. 응답에 단위(mm, kg)가 필요하다면 명시해
추가 질문은 객관식으로 예시 선택지를 제시하되, 선택지의 수가 5개를 넘지 않도록 해. 선택지는 구체적인 워딩을 사용해. (틀린 예: "특정 브랜드", "특정 카테고리" / 옳은 예: "스타벅스", "애플", "삼성") 또한 명시되지 않은 경우, 어떤 온라인 플랫폼을 활용해 작업을 완료할지 반드시 물어봐야 해.

요청: ${initialPrompt}
`;
  const config: GenerateContentConfig = {
    temperature: 0.7,
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
              },
              answerCandidate: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
              },
              answerUnit: {
                type: Type.STRING,
              },
            },
            required: ["question", "answerCandidate"],
          },
        },
      },
      required: ["questions"],
    },
  };

  const text = await (
    await window.api.geminiChat(prompt, config)
  ).data!.candidates![0].content!.parts![0].text!;

  return QuestionResponseSchema.parse(JSON.parse(text));
};
