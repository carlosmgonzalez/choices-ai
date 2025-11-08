"use client";

import { FormEvent, useRef, useState } from "react";
import { ModeToggleTheme } from "@/components/theme/mode-toggle-theme";
import { Loader, Paperclip } from "lucide-react";
import { fileToBase64 } from "@/lib/pdf-utils";
import { Button } from "@/components/ui/button";
import { QuestionsType } from "@/lib/types/questions.type";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Question } from "@/components/question";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [questionsList, setQuestionsList] = useState<QuestionsType | undefined>(
    undefined,
  );
  const inputFileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("enviando");

      let pdfBase64 = "";
      if (inputFileRef.current?.files && inputFileRef.current.files[0]) {
        const file = inputFileRef.current.files[0];
        pdfBase64 = await fileToBase64(file);
      }

      console.log("se convirtio el pdf");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfBase64,
        }),
      });

      const data: { result: QuestionsType } = await response.json();
      setQuestionsList(data.result);

      console.log(data.result);

      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full justify-center items-center gap-4 max-w-md py-24 mx-auto stretch">
      {questionsList && (
        <div className="flex flex-col gap-6">
          <p className="text-center">{questionsList.topic}</p>
          {questionsList.questions.map((q) => (
            <Question key={q.id} data={q} />
          ))}
        </div>
      )}
      <div className="flex flex-row items-center justify-center gap-4">
        <ModeToggleTheme />
        <form
          onSubmit={handleSubmit}
          className="flex flex-row items-center gap-4"
        >
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            ref={inputFileRef}
            multiple={false}
          />
          <Paperclip onClick={() => inputFileRef.current?.click()} />
          <Button type="submit">
            {isLoading ? <Loader className="animate-spin" /> : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
}
