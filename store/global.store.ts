import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Question = {
  id: string;
  question: string;
  correctChoice: string;
  choices: string[];
  explanation: string;
  userAnswer: string | undefined;
  meta: {
    difficulty: "easy" | "medium" | "hard";
  };
};

interface GlobalState {
  topic: string;
  description: string;
  totalQuestions: number;
  questions: Question[];
  setAnswerQuestion: (questionId: string, answare: string) => void;
  showCorrectAnswers: boolean;
  grade: () => string;
  setState: (
    partial: Partial<
      Omit<
        GlobalState,
        | "setQuestions"
        | "setAnswerQuestion"
        | "toggleShowCorrectAnsware"
        | "grade"
        | "setState"
      >
    >,
  ) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      topic: "",
      description: "",
      totalQuestions: 0,
      questions: [],
      setAnswerQuestion: (questionId, answare) => {
        set((state) => ({
          questions: state.questions.map((question) => {
            if (question.id === questionId) {
              return {
                ...question,
                userAnswer: answare,
              };
            }

            return question;
          }),
        }));
      },
      showCorrectAnswers: true,
      grade: () => {
        const totalQuestions = get().totalQuestions;
        let totalCorrectAnswers = 0;
        get().questions.map((a) => {
          if (a.userAnswer === a.correctChoice) {
            totalCorrectAnswers++;
          }
        });
        return `${totalCorrectAnswers} / ${totalQuestions}`;
      },
      setState: (partial) => set(partial),
    }),
    {
      name: "questions-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
