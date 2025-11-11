"use client";

import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useGlobalStore } from "@/store/global.store";

interface Props {
  question: {
    id: string;
    question: string;
    choices: string[];
    correctChoice: string;
    explanation: string;
    userAnswer: string | undefined;
    meta: {
      difficulty: "easy" | "medium" | "hard";
    };
  };
}

export function Question({ question }: Props) {
  const { setAnswerQuestion, showCorrectAnswers } = useGlobalStore();

  return (
    <div key={question.id} className="flex flex-col gap-2">
      <p>{question.question}</p>
      {question.choices.map((choice, i) => {
        const isCorrectAnswer = choice === question.correctChoice;
        const isSelectedWrong =
          showCorrectAnswers &&
          choice === question.userAnswer &&
          !isCorrectAnswer;
        const isCorrectToShow = showCorrectAnswers && isCorrectAnswer;

        let checkboxClassName = "";
        if (isCorrectToShow) {
          checkboxClassName =
            "data-[state=checked]:bg-green-600 data-[state=checked]:border-transparent dark:data-[state=checked]:bg-green-400 border-green-600 dark:border-green-400";
        } else if (isSelectedWrong) {
          checkboxClassName =
            "data-[state=checked]:bg-rose-600 data-[state=checked]:border-transparent dark:data-[state=checked]:bg-rose-400";
        }

        return (
          <div
            key={`${choice}-${i}`}
            className="flex flex-row gap-2 items-center"
          >
            <Checkbox
              id={choice}
              checked={question.userAnswer === choice}
              className={checkboxClassName}
              onCheckedChange={() => {
                setAnswerQuestion(
                  question.id,
                  question.userAnswer === choice ? "" : choice,
                );
              }}
            />
            <Label htmlFor={choice}>{choice}</Label>
          </div>
        );
      })}
      {showCorrectAnswers && (
        <p className="text-muted-foreground font-light mt-1">
          {question.explanation}
        </p>
      )}
    </div>
  );
}
