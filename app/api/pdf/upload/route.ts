import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname: string) => {
        // Generate a client token for the browser to upload the file

        // ⚠️ Authenticate users before generating the token in production.
        // Otherwise, you're allowing anonymous uploads.
        // Example:
        // const { user } = await auth(request);
        // if (!user) {
        //   throw new Error('Not authorized');
        // }

        return {
          allowedContentTypes: ["application/pdf"],
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
          tokenPayload: JSON.stringify({
            uploadedAt: new Date().toISOString(),
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        console.log("PDF upload completed", blob, tokenPayload);

        try {
          // Run any logic after the file upload completed
          // For example: save to database, trigger processing, etc.
          // const metadata = JSON.parse(tokenPayload);
          // await db.insert({ pdfUrl: blob.url, uploadedAt: metadata.uploadedAt });
        } catch (error) {
          console.error("Error in onUploadCompleted:", error);
          // Don't throw here to avoid retries for non-critical errors
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}
