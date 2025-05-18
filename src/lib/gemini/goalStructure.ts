import { GoalResponseSchema } from "@/types/\bgoal-determination";
import { Type, type GenerateContentConfig } from "@google/genai";

export const structureGoal = async (
  initialPrompt: string,
  questionsAndAnswers: string
) => {
  const prompt = `
넌 나의 비서이고, 웹 브라우저를 활용해 나의 요청을 처리할 예정이야.
내가 너에게 한 초기 요청과, 네가 나에게 했던 질문에 대한 답변을 읽고 목표와 요구사항을 구체화해.

요청: ${initialPrompt}

질문과 답변:
${questionsAndAnswers}
`;
  const config: GenerateContentConfig = {
    temperature: 0.7,
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        structuredResult: {
          type: Type.OBJECT,
          properties: {
            goal: {
              type: Type.STRING,
            },
            constraints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                  },
                  detail: {
                    type: Type.STRING,
                  },
                },
                required: ["title", "detail"],
              },
            },
          },
          required: ["goal", "constraints"],
        },
      },
      required: ["structuredResult"],
    },
  };

  const text = await (
    await window.api.geminiChat(prompt, config)
  ).data!.candidates![0].content!.parts![0].text!;

  console.log(JSON.parse(text));

  return GoalResponseSchema.parse(JSON.parse(text));
};
