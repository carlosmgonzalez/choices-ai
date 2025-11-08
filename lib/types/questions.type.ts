import { z } from "zod";

export const QuestionsSchema = z
  .object({
    topic: z.string(),
    description: z.string(),
    totalQuestions: z.number().int().nonnegative(),
    questions: z.array(
      z
        .object({
          id: z.string(),
          question: z.string(),
          choices: z.array(z.string()).length(4),
          correctChoice: z.string(),
          explanation: z.string(),
          meta: z.object({
            difficulty: z.enum(["easy", "medium", "hard"]),
          }),
        })
        .refine((q) => q.choices.includes(q.correctChoice), {
          message: "correctOption debe ser una de las opciones",
          path: ["correctOption"],
        }),
    ),
  })
  .refine((data) => data.totalQuestions === data.questions.length, {
    message: "totalQuestions debe coincidir con la cantidad de questions",
    path: ["totalQuestions"],
  });

export type QuestionsType = z.Infer<typeof QuestionsSchema>;
export type QuestionType = z.Infer<typeof QuestionsSchema>;
