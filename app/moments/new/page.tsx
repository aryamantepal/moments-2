import Form from "next/form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from '@vercel/blob';

export default function Page() {
    async function create(formData: FormData) {
        'use server';
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
                New Moment
            </div>
        </div>
    );
}
