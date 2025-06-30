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
        const { id, email_addresses, phone_numbers, image_url } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;
        const primaryPhone = phone_numbers?.[0]?.phone_number;
        const insertUserSQL = `INSERT INTO users (
            id, email, phone_number, profile_image_url, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6)`;
        const insertUserParams = [
          id,
          primaryEmail,
          primaryPhone,
          image_url,
          new Date().toISOString(),
          new Date().toISOString(),
        ];
        await client.query(insertUserSQL, insertUserParams);
        const insertPrefsSQL = `INSERT INTO user_discovery_preferences (
            user_id, radius_km, show_private_events, preferred_tags,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6)`;
        const insertPrefsParams = [
          id,
          10,
          false,
          "[]",
          new Date().toISOString(),
          new Date().toISOString(),
        ];
        await client.query(insertPrefsSQL, insertPrefsParams);
      } else if (eventType === "user.updated") {
        const { id, email_addresses, phone_numbers, image_url } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;
        const primaryPhone = phone_numbers?.[0]?.phone_number;
        const updateUserSQL = `UPDATE users 
          SET email = $1,
              phone_number = $2,
              profile_image_url = $3,
              updated_at = $4
          WHERE id = $5`;
        const updateUserParams = [
          primaryEmail,
          primaryPhone,
          image_url,
          new Date().toISOString(),
          id,
        ];
        await client.query(updateUserSQL, updateUserParams);
      } else if (eventType === "user.deleted") {
        const { id } = evt.data;
        const deleteSQLs: [string, unknown[]][] = [
          ["DELETE FROM user_discovery_preferences WHERE user_id = $1", [id]],
          ["DELETE FROM user_social_links WHERE user_id = $1", [id]],
          ["DELETE FROM user_tags WHERE user_id = $1", [id]],
          [
            "DELETE FROM friendships WHERE user_id_1 = $1 OR user_id_2 = $1",
            [id],
          ],
          ["DELETE FROM event_time_slot_selections WHERE user_id = $1", [id]],
          ["DELETE FROM users WHERE id = $1", [id]],
        ];
        for (const entry of deleteSQLs) {
          const [sql, params] = entry;

          await client.query(sql, params);
        }
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
