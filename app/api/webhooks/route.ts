import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { Pool } from "pg";

// Initialize PostgreSQL client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(new NextRequest(req));
    const eventType = evt.type;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      if (eventType === "user.created") {
        const { id, email_addresses, image_url } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;
        const insertUserSQL = `INSERT INTO users (
            clerk_user_id, email, avatar_url, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5)`;
        const insertUserParams = [
          id, // Clerk user id
          primaryEmail,
          image_url,
          new Date().toISOString(),
          new Date().toISOString(),
        ];
        await client.query(insertUserSQL, insertUserParams);
      } else if (eventType === "user.updated") {
        const { id, email_addresses, image_url } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;
        const updateUserSQL = `UPDATE users 
          SET email = $1,
              avatar_url = $2,
              updated_at = $3
          WHERE clerk_user_id = $4`;
        const updateUserParams = [
          primaryEmail,
          image_url,
          new Date().toISOString(),
          id,
        ];
        await client.query(updateUserSQL, updateUserParams);
      } else if (eventType === "user.deleted") {
        const { id } = evt.data;
        const deleteSQL = "DELETE FROM users WHERE clerk_user_id = $1";
        await client.query(deleteSQL, [id]);
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error processing webhook:", error);
      return new Response("Error processing webhook", {
        status: 500,
      });
    } finally {
      client.release();
    }
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
