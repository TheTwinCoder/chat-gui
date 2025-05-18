import type { HistoryType } from "@/routes";
import { type GoalType } from "@/types/\bgoal-determination";
import { Type, type GenerateContentConfig } from "@google/genai";
import { z } from "zod";

export const getActions = async (
  goal: GoalType,
  history: HistoryType[],
  html: string
) => {
  const prompt = `
넌 나의 비서이고, 웹 브라우저를 활용해 나의 요청을 처리하고 있어.

너의 목표: ${goal.goal}
목표와 관련된 요구사항: ${goal.constraints.map(({ title, detail }) => `${title}: ${detail}`).join("\n")}

${history.length > 0 ? "행동 내역: \n" : ""}
${history.map(({ page, action }, index) => {
  return `
페이지 #${index + 1}(${page.description})
행동: ${action
    ?.map(({ description, type, value }) => {
      return `${description} (${type} ${value})`;
    })
    .join("\n")}
`;
})}

현재 페이지:
${html}

우선 현재 페이지에 대한 설명을 작성해.
이후 이 페이지에서 목표를 달성하기 위해 해야 할 행동을 구조화해서 출력해. 'click' 또는 'submit'는 최대 1회만 할 수 있어.
`;
  const config: GenerateContentConfig = {
    temperature: 0.7,
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        description: {
          type: Type.STRING,
          description:
            "자연어로 작성된 10단어 이내의 페이지 설명. 간략한 표현 사용. 문장형 서술 금지. 문장 끝에 마침표 금지.",
        },
        actions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              description: {
                type: Type.STRING,
                description:
                  "자연어로 작성된 10단어 이내의 간략한 행동 설명. 간략한 표현 사용. 문장형 서술 금지. 문장 끝에 마침표 금지.",
              },
              type: { type: Type.STRING },
              locatorType: {
                type: Type.STRING,
                description: "목표 element의 locator 타입. id 혹은 css",
              },
              locator: {
                type: Type.STRING,
                description: "locator 값. locatorType에 따라 작성",
              },
              value: {
                type: Type.STRING,
                description: "행동 값. 행동 타입이 'input'일 때만 작성",
              },
            },
          },
        },
      },
      required: ["actions"],
    },
  };

  const text = await (
    await window.api.geminiChat(prompt, config)
  ).data!.candidates![0].content!.parts![0].text!;

  return GetActionsResponseSchema.parse(JSON.parse(text));
};

export const GetActionsResponseSchema = z.object({
  description: z.string(),
  actions: z.array(
    z.object({
      description: z.string(),
      type: z.enum(["click", "input", "submit"]),
      locatorType: z.enum(["id", "css"]),
      locator: z.string(),
      value: z.string().optional(),
    })
  ),
});
