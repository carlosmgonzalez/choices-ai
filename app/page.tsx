"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ModeToggleTheme } from "@/components/theme/mode-toggle-theme";
import { Loader, Upload, CheckCircle2, Brain, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionsListType } from "@/lib/types/questions.type";
import { Question } from "@/components/question";
import { upload } from "@vercel/blob/client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGlobalStore } from "@/store/global.store";
import { DifficultySelect } from "@/components/difficulty-select";
import { NumQuestionsSelect } from "@/components/num-questions-select";
import {
  ApiResponse,
  isErrorResponse,
} from "@/lib/types/error-res-questions.type";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>();
  const [blobUrl, setBlobUrl] = useState<string | undefined>();
  const [error, setError] = useState<string>("");
  const [errorType, setErrorType] = useState<string>("");
  const [canRetry, setCanRetry] = useState(false);

  const {
    showCorrectAnswers,
    grade,
    setState,
    topic,
    questions,
    description,
    difficulty,
    numQuestions,
  } = useGlobalStore();

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    setMounted(true);
    // Hidratar el store manualmente para evitar errores de SSR
    const unsubHydrate = useGlobalStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    useGlobalStore.persist.rehydrate();

    return () => {
      unsubHydrate();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setErrorType("");
    setCanRetry(false);

    if (!file) return;

    setIsLoading(true);
    try {
      // Upload PDF to Vercel Blob only if not already uploaded
      let pdfUrl = blobUrl;
      if (!pdfUrl) {
        const newBlob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/pdf/upload",
        });
        pdfUrl = newBlob.url;
        setBlobUrl(pdfUrl);
      }

      // Then, send the blob URL to process
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfUrl: pdfUrl,
          difficulty,
          numQuestions,
        }),
      });

      const data: ApiResponse<QuestionsListType> = await response.json();

      if (isErrorResponse(data)) {
        const errorTypeFromApi = data.error || "unknown";
        const errorMessage = data.message || "Error al procesar el PDF";

        setErrorType(errorTypeFromApi);
        if (errorTypeFromApi === "ai_overloaded") {
          setError(errorMessage);
          setCanRetry(true);
        } else if (errorTypeFromApi === "rate_limit") {
          setError(errorMessage);
          setCanRetry(true);
        } else if (errorTypeFromApi === "pdf_error") {
          setError(errorMessage);
          setCanRetry(true);
        } else {
          setError(errorMessage);
          setCanRetry(true);
        }
        return;
      }

      setState({
        ...data.result,
        questions: data.result.questions.map((question) => ({
          ...question,
          userAnswer: undefined,
        })),
      });

      if (inputFileRef.current) {
        setFile(undefined);
        setBlobUrl(undefined);
        inputFileRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      setErrorType("network_error");
      setError(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Error de conexión. Verifica tu conexión a internet e intenta de nuevo.",
      );
      setCanRetry(true);
    } finally {
      setIsLoading(false);
    }
  }

  // No renderizar hasta que el store esté hidratado
  if (!hydrated) {
    return null;
  }

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="fixed flex flex-row items-center top-0 right-0 p-4 z-50 gap-4">
        {mounted && showCorrectAnswers && questions.length > 0 && (
          <Button variant="outline" className="m-0">
            <p className="font-semibold">{grade()}</p>
          </Button>
        )}
        <ModeToggleTheme />
      </header>

      <div className="container mx-auto px-4 pt-16 pb-12">
        {/* Hero Section - Solo se muestra si no hay preguntas */}
        {questions.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Prepárate para tus exámenes
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Sube tu PDF y obtén preguntas de opción múltiple generadas
                automáticamente para practicar
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-12">
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card">
                <Upload className="w-6 h-6 text-primary" />
                <h3>Sube tu PDF</h3>
                <p className="text-sm font-light  text-muted-foreground">
                  Carga cualquier documento de estudio
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card">
                <Brain className="w-6 h-6 text-primary" />
                <h3>IA Genera Preguntas</h3>
                <p className="text-sm font-light text-muted-foreground">
                  Preguntas inteligentes sobre el contenido
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <h3>Practica y Aprende</h3>
                <p className="text-sm font-light  text-muted-foreground">
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
                      if (selectedFile.size / (1024 * 1024) > 15) {
                        setFile(undefined);
                        setBlobUrl(undefined);
                        setError("El PDF no puede pesar más de 15MB");
                        if (inputFileRef.current) {
                          inputFileRef.current.value = "";
                        }
                        return;
                      }
                      setFile(selectedFile);
                      setError("");
                      setErrorType("");
                      setCanRetry(false);
                    }
                  }}
                />

                {/* Drop Zone */}

                {file ? (
                  <div className="relative flex flex-col gap-4 border-2 rounded-lg p-6 cursor-pointer bg-card">
                    <X
                      className="absolute top-2 right-2 cursor-pointer hover:text-destructive"
                      onClick={() => {
                        setFile(undefined);
                        setBlobUrl(undefined);
                        setError("");
                        setErrorType("");
                        setCanRetry(false);
                      }}
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
                        <p className="text-muted-foreground font-light text-sm">
                          (Max 15MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="space-y-3 text-center p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
                    <p className="text-sm text-destructive font-medium">
                      {error}
                    </p>
                    {canRetry && (
                      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          disabled={isLoading || !file}
                        >
                          {isLoading ? (
                            <>
                              <Loader className="animate-spin mr-2 h-4 w-4" />
                              Reintentando...
                            </>
                          ) : (
                            "🔄 Reintentar"
                          )}
                        </Button>
                        {errorType === "ai_overloaded" && (
                          <p className="text-xs text-muted-foreground">
                            Sugerencia: Espera 1-2 minutos antes de reintentar
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="w-full space-y-4 border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-semibold">
                    Configuración de preguntas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Dificultad
                      </label>
                      <DifficultySelect />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Número de preguntas
                      </label>
                      <NumQuestionsSelect />
                    </div>
                  </div>
                </div>
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
                  setBlobUrl(undefined);
                  setError("");
                  setErrorType("");
                  setCanRetry(false);
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
