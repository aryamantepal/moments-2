'use server';

import { neon } from '@neondatabase/serverless';

export async function getUsers() {
  const sql = neon(process.env.DATABASE_URL!);

  // Tell TypeScript exactly what each row looks like
  const users = await sql`
    SELECT *
    FROM users
  `;

  return users;
}

export default async function Page() {
  const users = await getUsers();
  return (
    <div>
      <ol className="list-decimal list-inside font-(family-name:--font-geist-sans) text-[#333333]">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.email}
          </li>
        ))}
      </ol>
    </div>
  );
}
