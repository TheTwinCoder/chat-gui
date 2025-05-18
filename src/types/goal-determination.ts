import z from "zod";

export type GoalDeterminationResultType =
  | {
      isStructuredResult: true;
      structuredResult: GoalType;
    }
  | {
      isStructuredResult: false;
      questions: QuestionType[];
    };

export const QuestionSchema = z.object({
  question: z.string(),
  answerCandidate: z.array(z.string()),
  answerUnit: z.string().optional(),
});

export const QuestionWithAnswerSchema = QuestionSchema.extend({
  answer: z.string().optional(),
});

export type QuestionType = z.infer<typeof QuestionSchema>;
export type QuestionWithAnswerType = z.infer<typeof QuestionWithAnswerSchema>;

export const QuestionResponseSchema = z.object({
  questions: z.array(QuestionSchema),
});

export const GoalSchema = z.object({
  goal: z.string(),
  constraints: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
    })
  ),
});

export const GoalResponseSchema = z.object({
  structuredResult: GoalSchema,
});

export type GoalType = z.infer<typeof GoalSchema>;
