import { Client } from "@upstash/qstash";

export const queue = new Client({
    token: process.env.QSTASH_TOKEN!,
});

type JobName = "process-image" | "revalidate-cache";

export async function enqueueJob(name: JobName, data: any) {
    if (process.env.NODE_ENV === "development") {
        console.log(`[Queue] Enqueuing job: ${name}`, data);
        // In dev, you might want to bypass qstash or just log it
        // But QStash works in dev too if you use a tunnel or just public URL
        // For now we will assume we want to actually send it if keys are present
    }

    // Auto-deduce the URL based on VERCEL_URL or fallback
    // For local development with QStash, you typically need a public URL (ngrok)
    // Or simpler: We just assume the destination is configured in the environment or relative

    // Note: QStash needs a full URL to call.
    // In production: https://<project>.vercel.app/api/queue

    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const result = await queue.publishJSON({
        url: `${baseUrl}/api/queue`,
        body: {
            name,
            ...data
        },
    });

    return result;
}
