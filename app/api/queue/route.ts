import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { jobs, JobName } from "@/app/jobs";

async function handler(req: NextRequest) {
    const body = await req.json();
    const { name } = body;

    console.log(`[Queue] Received job: ${name}`);

    const jobHandler = jobs[name as JobName];
    if (!jobHandler) {
        console.error(`[Queue] Unknown job: ${name}`);
        return NextResponse.json({ error: "Unknown job" }, { status: 400 });
    }

    try {
        await jobHandler();
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error(`[Queue] Job failed: ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Security: Verify the request comes from QStash. Without signing keys, only
// local development may call the handler directly; everywhere else fails closed.
const hasSigningKeys = Boolean(
    process.env.QSTASH_CURRENT_SIGNING_KEY && process.env.QSTASH_NEXT_SIGNING_KEY
);

export const POST = hasSigningKeys
    ? verifySignatureAppRouter(handler)
    : process.env.NODE_ENV === "development"
        ? handler
        : async () => NextResponse.json(
            { error: "QStash signing keys are not configured" },
            { status: 500 }
        );

export const dynamic = 'force-dynamic';

