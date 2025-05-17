import {
  GoalResponseSchema,
  QuestionResponseSchema,
} from "@/types/\bgoal-determination";
import { Type, type GenerateContentConfig } from "@google/genai";

export const determineGoal = {
  initial: async (prompt: string) => {
    const data = await window.api.geminiChat(
      determineGoalInitialPrompt(prompt),
      determineGoalConfig
    );

    return parse(data.data!.candidates![0].content!.parts![0].text!);
  },
  followUp: async (prompt: string) => {
    const data = await window.api.geminiChat(prompt, determineGoalConfig);

    return parse(data.data!.candidates![0].content!.parts![0].text!);
  },
};

const parse = (data: string) => {
  const obj = JSON.parse(data);

  {
    const parsedResult = QuestionResponseSchema.safeParse(obj);
    console.log(parsedResult);
    if (parsedResult.success) {
      return {
        success: true,
        type: "question",
        data: parsedResult.data.questions,
      };
    }
  }

  {
    const parsedResult = GoalResponseSchema.safeParse(obj);
    console.log(parsedResult);
    if (parsedResult.success) {
      return {
        success: true,
        type: "goal",
        data: {
          goal: parsedResult.data.goal,
          constraints: parsedResult.data.constraints,
        },
      };
    }
  }

  return {
    success: false,
  };
};

const determineGoalInitialPrompt = (prompt: string) => {
  return `
넌 나의 비서이고, 웹 브라우저를 활용해 나의 요청을 처리할 예정이야.
내 요청을 읽고 요구사항을 구조화하여 정리하여 출력해. 처리 시 목표 자체(목표의 특징)나 그 과정(어떤 플랫폼 사용)에 디테일이 더 필요하다면 나에게 추가 질문을 하고, 응답을 통해 목표를 구체화해. 응답에 단위(mm, kg)가 필요하다면 명시해
추가 질문은 객관식으로 예시 선택지를 제시하되, 선택지의 수가 5개를 넘지 않도록 해.

요청: ${prompt}
  `;
};

const determineGoalConfig: GenerateContentConfig = {
  temperature: 0.7,
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      isStructuredResult: {
        type: Type.BOOLEAN,
      },
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
    required: ["isStructuredResult"],
  },
};
