import { type GoalType } from "@/types/\bgoal-determination";
import { Type, type GenerateContentConfig } from "@google/genai";
import { z } from "zod";

export const findInitialPage = async (goal: GoalType) => {
  const prompt = `
넌 나의 비서이고, 웹 브라우저를 활용해 나의 요청을 처리할 예정이야.

너의 목표: ${goal.goal}
목표와 관련된 요구사항: ${goal.constraints.map(({ title, detail }) => `${title}: ${detail}`).join("\n")}

현재는 이 목표를 위한 첫 단계로써, 목표를 달성하기 위해 웹 페이지를 열려고 해. 무슨 페이지를 열어야 할지, URL을 출력해. 플랫폼에 접속해야 한다면, 해당 플랫폼 메인 페이지를 열면 좋겠지?
`;
  const config: GenerateContentConfig = {
    temperature: 0.7,
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        url: {
          type: Type.STRING,
        },
        siteName: {
          type: Type.STRING,
        },
      },
      required: ["url", "siteName"],
    },
  };

  const text = await (
    await window.api.geminiChat(prompt, config)
  ).data!.candidates![0].content!.parts![0].text!;

  console.log(JSON.parse(text));

  return FindInitialPageResponseSchema.parse(JSON.parse(text));
};

export const FindInitialPageResponseSchema = z.object({
  url: z.string(),
  siteName: z.string(),
});
