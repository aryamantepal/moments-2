import { Analytics } from "@vercel/analytics/next";
import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation';

export default async function Page() {

  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    redirect("/sign-in");
  }

  const sql = neon(process.env.DATABASE_URL!);
  const users = await sql`
  select email from users where id = ${userId} LIMIT 1
  `
  const user = users[0];
  console.log(users);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <h1>Welcome, {user.email}</h1>
        <form action={signOut}>
          <button type="submit">Sign Out</button>
        </form>
      </div>
    </div>
  );

}

async function signOut() {
  'use server';
  const cookieStore = await cookies();
  cookieStore.delete('user_id');
  redirect('/sign-in');
}
