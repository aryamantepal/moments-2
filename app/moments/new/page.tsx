import Form from "next/form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from '@vercel/blob';
import { neon } from "@neondatabase/serverless";
import { cookies } from 'next/headers';

export default function Page() {
    async function create(formData: FormData) {
        'use server';

        const cookieStore = await cookies();
        const userId = cookieStore.get('user_id')?.value;

        if (!userId) {
            redirect("/sign-in");
        }

        const sql = neon(process.env.DATABASE_URL!);
        const caption = (formData.get("caption") as string) || null;
        const location = (formData.get("location") as string) || null;
        const image = formData.get("image") as File;

        if (!image) {
            throw new Error('Image is required');
        }

        const blob = await put(
            `moments/${crypto.randomUUID()}-${image.name}`,
            image,
            { access: 'public' }
        );

        await sql`
  INSERT INTO moments (image_url, caption, location, author_id)
  VALUES (
    ${blob.url},
    ${caption},
    ${location},
    ${Number(userId)}
  )
`;
        revalidatePath('/');
        redirect('/');

    }
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
            <Form action={create} className="space-y-6">
                <div>
                    <label htmlFor="image" className="block text-lg mb-2">
                        Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="caption" className="block text-lg mb-2">
                        Caption
                    </label>
                    <textarea
                        id="caption"
                        name="caption"
                        placeholder="What's this moment about?"
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-lg mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="Where was this taken?"
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                >
                    Upload Moment
                </button>
            </Form>
        </div>
    );
}
