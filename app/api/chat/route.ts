import { QuestionsSchema } from "@/lib/types/questions.type";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { del } from "@vercel/blob";

interface ChatRequest {
  pdfUrl: string;
  numQuestions?: number;
  topicHint?: string;
  difficulty?: "easy" | "medium" | "hard";
  language?: string;
}

export async function POST(req: Request) {
  try {
    const {
      pdfUrl,
      numQuestions = 20,
      topicHint = "general",
      difficulty = "medium",
      language = "es-AR",
    }: ChatRequest = await req.json();

    if (!pdfUrl) {
      return Response.json({ error: "No PDF URL provided" }, { status: 400 });
    }

    // Download PDF from Vercel Blob
    const pdfResponse = await fetch(pdfUrl);

    if (!pdfResponse.ok) {
      return Response.json(
        { error: "Failed to download PDF from blob storage" },
        { status: 500 },
      );
    }

    // Convert PDF to base64
    const arrayBuffer = await pdfResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfBase64 = buffer.toString("base64");

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "file",
              mediaType: "application/pdf",
              data: pdfBase64,
            },
          ],
        },
      ],
      schema: QuestionsSchema,
      system:
        `Eres un generador de exámenes de opción múltiple. Solo puedes usar el contenido del PDF proporcionado.` +
        `Si la información no está en el PDF, responde con {"error":"insufficient_evidence"} y explica qué falta.` +
        `Tareas:` +
        `1. Lee y comprende el PDF.` +
        `2. Genera preguntas de opción múltiple sobre ${topicHint}.` +
        `3. Cada pregunta debe:` +
        `* Tener 4 opciones (A–D) con solo 1 correcta.` +
        `* Evitar opciones tipo "Todas las anteriores" o "Ninguna de las anteriores".` +
        `* Ser clara, no ambigua, y basada textualmente en el PDF.` +
        `* Citar la página y, si es posible, una frase breve de respaldo (≤ 25 palabras).` +
        `Controla la dificultad según ${difficulty} (easy|medium|hard).` +
        `1. Lenguaje de salida: ${language}.` +
        `2. Entregar únicamente el JSON válido con el esquema de Output JSON (sin comentarios ni texto adicional).` +
        `Parámetros:` +
        `* numQuestions: ${numQuestions}` +
        `* topicHint: "${topicHint}"` +
        `* difficulty: "${difficulty}" // easy|medium|hard` +
        `* language: "${language}" // es-AR, es-ES, en, etc.` +
        `Estilo de las preguntas:` +
        `* Enunciado de 12–35 palabras.` +
        `* Opciones de 3–12 palabras.` +
        `* Explicación de 1–3 frases, citando el PDF.` +
        `* Mezcla taxonómica: factual/conceptual/procedimental según el material.` +
        `Validación y consistencia:` +
        `* totalQuestions debe ser igual al largo del arreglo questions.` +
        `* Todas las id deben ser únicas (uuid v4).` +
        `* correctOption debe ser exactamente igual a una de las opciones listadas.` +
        `* Sin duplicar opciones ni enunciados.` +
        `Output JSON (sin comentarios):` +
        `{` +
        `"topic": "string",` +
        `"description": "string",` +
        `"totalQuestions": 0,` +
        `"questions": [` +
        `{` +
        `"id": "uuid-v4",` +
        `"question": "string",` +
        `"options": ["string","string","string","string"],` +
        `"correctOption": "string",` +
        `"explanation": "string",` +
        `"meta": {` +
        `"difficulty": "easy|medium|hard",` +
        `}` +
        `}` +
        `]` +
        `}`,
    });

    // Optional: Delete the blob after processing to save storage
    // Uncomment if you want to clean up blobs after processing
    try {
      await del(pdfUrl);
      console.log("Blob deleted successfully:", pdfUrl);
    } catch (error) {
      console.error("Error deleting blob:", error);
      // Don't fail the request if deletion fails
    }

    return Response.json({ result: object });
  } catch (error) {
    console.error("Error in chat route:", error);
    return Response.json(
      {
        error: "Something went wrong",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
