import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdminAuthenticated } from "@/lib/auth";
import { isAllowedAudioExtension } from "@/lib/audio";

const MAX_AUDIO_SIZE = 25 * 1024 * 1024;

/**
 * Token endpoint for direct-to-Blob client uploads. Vercel serverless
 * functions cap request bodies at ~4.5 MB, so audio files are uploaded
 * straight to Blob storage from the browser; the DB record is created
 * afterwards via /api/admin/audio/attach.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const isAdmin = await isAdminAuthenticated();
        if (!isAdmin) throw new Error("Unauthorized");

        if (!isAllowedAudioExtension(pathname)) {
          throw new Error("फक्त MP3, WAV, M4A किंवा OGG फाइल स्वीकारली जाते.");
        }

        let rightsConfirmed = false;
        try {
          rightsConfirmed = JSON.parse(clientPayload ?? "{}").rightsConfirmed === true;
        } catch {
          /* invalid payload */
        }
        if (!rightsConfirmed) {
          throw new Error("कृपया ऑडिओ वापराच्या अधिकाराची पुष्टी करा.");
        }

        return {
          allowedContentTypes: [
            "audio/mpeg",
            "audio/wav",
            "audio/x-wav",
            "audio/mp4",
            "audio/x-m4a",
            "audio/ogg",
          ],
          maximumSizeInBytes: MAX_AUDIO_SIZE,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // DB record is created by /api/admin/audio/attach from the client,
        // because this callback cannot reach localhost in development.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "अपलोड अयशस्वी." },
      { status: 400 },
    );
  }
}
