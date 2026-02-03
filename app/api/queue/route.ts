import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { jobs, JobName } from "@/app/jobs";

async function handler(req: NextRequest) {
    const body = await req.json();
    const { name, ...data } = body;

    console.log(`[Queue] Received job: ${name}`);

    const jobHandler = jobs[name as JobName];
    if (!jobHandler) {
        console.error(`[Queue] Unknown job: ${name}`);
        return NextResponse.json({ error: "Unknown job" }, { status: 400 });
    }

    try {
        await jobHandler(data);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error(`[Queue] Job failed: ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Security: Verify the request comes from QStash
export const POST = verifySignatureAppRouter(handler);
