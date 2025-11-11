"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ModeToggleTheme } from "@/components/theme/mode-toggle-theme";
import { Loader, Upload, CheckCircle2, Brain, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuestionsListType } from "@/lib/types/questions.type";
import { Question } from "@/components/question";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGlobalStore } from "@/store/global.store";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>();

  const { showCorrectAnswers, grade, setState, topic, questions, description } =
    useGlobalStore();

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const data: { result: QuestionsListType } = await response.json();

      setState({
        topic: data.result.topic,
        description: data.result.description,
        totalQuestions: data.result.totalQuestions,
        questions: data.result.questions.map((question) => ({
          choices: question.choices,
          explanation: question.explanation,
          correctChoice: question.correctChoice,
          id: question.id,
          question: question.question,
          userAnswer: undefined,
          meta: question.meta,
        })),
      });

      console.log(data.result);

      if (inputFileRef.current) {
        setFile(undefined);
        inputFileRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="fixed flex flex-row items-center top-0 right-0 p-4 z-50 gap-4">
        {mounted && showCorrectAnswers && (
          <Button variant="outline" className="m-0">
            <p className="font-semibold">{grade()}</p>
          </Button>
        )}
        <ModeToggleTheme />
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section - Solo se muestra si no hay preguntas */}
        {questions.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold tracking-tight">
                Prepárate para tus exámenes
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sube tu PDF y obtén preguntas de opción múltiple generadas
                automáticamente para practicar
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-12">
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg border bg-card">
                <Upload className="w-8 h-8 text-primary" />
                <h3>Sube tu PDF</h3>
                <p className="text-sm text-muted-foreground">
                  Carga cualquier documento de estudio
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg border bg-card">
                <Brain className="w-8 h-8 text-primary" />
                <h3>IA Genera Preguntas</h3>
                <p className="text-sm text-muted-foreground">
                  Preguntas inteligentes sobre el contenido
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg border bg-card">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <h3>Practica y Aprende</h3>
                <p className="text-sm text-muted-foreground">
                  Responde y mejora tu conocimiento
                </p>
              </div>
            </div>

            {/* Upload Area */}
            <div className="w-full max-w-xl mt-12">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  ref={inputFileRef}
                  multiple={false}
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setFile(selectedFile);
                    }
                  }}
                />

                {/* Drop Zone */}

                {file ? (
                  <div className="relative flex flex-col gap-4 border-2 rounded-lg p-6 cursor-pointer bg-card">
                    <X
                      className="absolute top-2 right-2"
                      onClick={() => setFile(undefined)}
                    />
                    <div className="text-center">
                      <p>{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {previewUrl && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" type="button">
                            Vista previa
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[90vw] sm:max-w-[90vw] h-[90vh] max-h-[90vh] px-2 pb-2 pt-10">
                          <DialogTitle className="hidden">PDF</DialogTitle>
                          <p className="absolute right-1/2 top-2 font-semibold">
                            PDF
                          </p>
                          <iframe
                            title={file.name}
                            src={previewUrl}
                            className="w-full h-full rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      inputFileRef.current?.click();
                      setState({
                        description: "",
                        questions: [],
                        showCorrectAnswers: false,
                        topic: "",
                        totalQuestions: 0,
                      });
                    }}
                    className="border-2 rounded-lg p-6 cursor-pointer bg-card hover:bg-accent/90"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="text-center">
                        <p>
                          {file
                            ? "Haz clic para cambiar tu PDF"
                            : "Haz clic para subir tu PDF"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-10 text-lg"
                  disabled={!file || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin mr-2" />
                      Generando preguntas...
                    </>
                  ) : (
                    "Generar Preguntas"
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Questions Section */}
        {questions.length !== 0 && (
          <div className="max-w-3xl mx-auto space-y-8 py-8">
            <div className="space-y-4">
              <h2 className="text-center text-3xl font-bold">{topic}</h2>
              <p>{description}</p>
              <p className="text-muted-foreground">
                Responde las siguientes preguntas basadas en tu documento
              </p>
            </div>

            <div className="space-y-6">
              {questions.map((q) => (
                <Question key={q.id} question={q} />
              ))}
            </div>

            {/* New Upload Button */}
            <div className="flex justify-center pt-8 gap-4">
              <Button
                onClick={() => {
                  setState({ showCorrectAnswers: !showCorrectAnswers });
                  console.log("toggle");
                }}
              >
                {!showCorrectAnswers
                  ? "Mostrar respuestas correctas"
                  : "Ocultar respuestas correctas"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setState({
                    description: "",
                    questions: [],
                    showCorrectAnswers: false,
                    topic: "",
                    totalQuestions: 0,
                  });
                  setFile(undefined);
                  if (inputFileRef.current) {
                    inputFileRef.current.value = "";
                  }
                }}
              >
                <Upload />
                Subir otro PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
