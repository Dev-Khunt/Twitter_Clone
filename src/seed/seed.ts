import db from "../config/db.config";
import { ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";

const runSeed = async () => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 🔐 hash password once
    const password = "Dev123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------- USERS ----------------
    const [u1] = await conn.query<ResultSetHeader>(
      `INSERT INTO users (display_name, username, email, password,country,dob)
       VALUES (?, ?, ?, ?,?,?)`,
      ["Milan Patel", "milan", "milan@test.com", hashedPassword,"india","2001-12-12"]
    );

    const [u2] = await conn.query<ResultSetHeader>(
      `INSERT INTO users (display_name, username, email, password,country,dob)
       VALUES (?, ?, ?, ?,?,?)`,
      ["John Doe", "john", "john@test.com", hashedPassword, "india","2001-12-12"]
    );

    const [u3] = await conn.query<ResultSetHeader>(
      `INSERT INTO users (display_name, username, email, password,country,dob)
       VALUES (?, ?, ?, ?,?,?)`,
      ["Jane Smith", "jane", "jane@test.com", hashedPassword, "india","2001-12-12"]
    );

    const user1 = u1.insertId;
    const user2 = u2.insertId;
    const user3 = u3.insertId;

    // ---------------- FOLLOWS ----------------
    await conn.query(`INSERT INTO follow (follower_id, followee_id) VALUES (?, ?)`, [user1, user2]);
    await conn.query(`INSERT INTO follow (follower_id, followee_id) VALUES (?, ?)`, [user1, user3]);
    await conn.query(`INSERT INTO follow (follower_id, followee_id) VALUES (?, ?)`, [user2, user1]);

    // ---------------- TWEETS ----------------
    const tweetIds: number[] = [];

    for (const user of [user1, user2, user3]) {
      for (let i = 1; i <= 3; i++) {
        const [t] = await conn.query<ResultSetHeader>(
          `INSERT INTO tweets (user_id, content)
           VALUES (?, ?)`,
          [user, `Tweet ${i} from user ${user}`]
        );
        tweetIds.push(t.insertId);
      }
    }

    // ---------------- MEDIA ----------------
    await conn.query(
      `INSERT INTO tweets_media (tweet_id, media_type, media_url)
       VALUES (?, 'image', 'https://dummyimage.com/600x400')`,
      [tweetIds[0]]
    );

    // ---------------- RETWEETS ----------------
    await conn.query(`INSERT INTO retweets (user_id, tweet_id) VALUES (?, ?)`, [user1, tweetIds[4]]);
    await conn.query(`INSERT INTO retweets (user_id, tweet_id) VALUES (?, ?)`, [user1, tweetIds[5]]);
    await conn.query(`INSERT INTO retweets (user_id, tweet_id) VALUES (?, ?)`, [user2, tweetIds[0]]);
    await conn.query(`INSERT INTO retweets (user_id, tweet_id) VALUES (?, ?)`, [user3, tweetIds[1]]);

    // ---------------- LIKES ----------------
    await conn.query(`INSERT INTO reactions (user_id, tweet_id) VALUES (?, ?)`, [user1, tweetIds[1]]);
    await conn.query(`INSERT INTO reactions (user_id, tweet_id) VALUES (?, ?)`, [user2, tweetIds[0]]);
    await conn.query(`INSERT INTO reactions (user_id, tweet_id) VALUES (?, ?)`, [user3, tweetIds[0]]);

    // ---------------- COMMENTS ----------------
    const [c1] = await conn.query<ResultSetHeader>(
      `INSERT INTO comments (user_id, tweet_id, content, parent_comment_id)
       VALUES (?, ?, ?, NULL)`,
      [user2, tweetIds[0], "Nice tweet!"]
    );

    const commentId = c1.insertId;

    await conn.query(
      `INSERT INTO comments (user_id, tweet_id, content, parent_comment_id)
       VALUES (?, ?, ?, ?)`,
      [user1, tweetIds[0], "Thanks!", commentId]
    );

    // ---------------- NOTIFICATIONS ----------------
    // await conn.query(
    //   `INSERT INTO notifications (user_id, actor_id, tweet_id, type)
    //    VALUES (?, ?, ?, 'like')`,
    //   [user1, user2, tweetIds[0]]
    // );

    // await conn.query(
    //   `INSERT INTO notifications (user_id, actor_id, type)
    //    VALUES (?, ?, 'follow')`,
    //   [user1, user2]
    // );

    // await conn.query(
    //   `INSERT INTO notifications (user_id, actor_id, tweet_id, comment_id, type)
    //    VALUES (?, ?, ?, ?, 'comment')`,
    //   [user1, user2, tweetIds[0], commentId]
    // );

    await conn.commit();

    console.log("✅ Seed inserted with hashed passwords");
    console.log("🔑 Test Login Password for all users: 123456");

  } catch (err) {
    await conn.rollback();
    console.error("❌ Seed failed:", err);
  } finally {
    conn.release();
  }
};

runSeed();