import {
  GoalResponseSchema,
  QuestionResponseSchema,
  type GoalType,
  type QuestionWithAnswerType,
} from "@/types/\bgoal-determination";
import { Type, type GenerateContentConfig } from "@google/genai";

export const determineGoal = {
  initial: async (prompt: string) => {
    const data = await window.api.geminiChat(
      askQuestionPrompt(prompt),
      askQuestionConfig
    );

    return parse(data.data!.candidates![0].content!.parts![0].text!);
  },
  followUp: async (prompt: string) => {
    const data = await window.api.geminiChat(
      determineGoalPrompt(prompt),
      determineGoalConfig
    );

    console.log(data.data!.candidates![0].content!.parts![0].text!);

    return parse(data.data!.candidates![0].content!.parts![0].text!);
  },
};

const parse = (
  data: string
):
  | {
      success: true;
      type: "question";
      data: QuestionWithAnswerType[];
    }
  | {
      success: true;
      type: "goal";
      data: GoalType;
    }
  | {
      success: false;
    } => {
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

const askQuestionPrompt = (prompt: string) => {
  return `
넌 나의 비서이고, 웹 브라우저를 활용해 나의 요청을 처리할 예정이야.
내 요청을 읽고 요구사항을 구체화하여 정리하여 출력해야 해. 처리 시 목표 자체(목표의 특징)나 그 과정(어떤 플랫폼 사용)에 필요한 추가 정보를 얻기 위해 나에게 질문을 하고, 응답을 통해 목표를 구체화해. 응답에 단위(mm, kg)가 필요하다면 명시해
추가 질문은 객관식으로 예시 선택지를 제시하되, 선택지의 수가 5개를 넘지 않도록 해.

요청: ${prompt}
  `;
};

const determineGoalPrompt = (prompt: string) => {
  return `
넌 나의 비서이고, 웹 브라우저를 활용해 나의 요청을 처리할 예정이야.
내 요청과, 네가 방금 나에게 한 추가질문에 대한 대답을 읽고 요구사항을 구조화하여 정리하여 출력해.

${prompt}
  `;
};

const askQuestionConfig: GenerateContentConfig = {
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

const determineGoalConfig: GenerateContentConfig = {
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
