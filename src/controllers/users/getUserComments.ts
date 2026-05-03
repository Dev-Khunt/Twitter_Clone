import { Response } from "express";
import db from "../../config/db.config";
import { AuthRequest, UserComment } from "../../types";

export const getUserComments = async (req: AuthRequest, res: Response) => {
  try {
    const username = req.params.username;
    const loggedInUserId = req.user?.user_id;

    // Get user_id from username
    const [userRows] = await db.query<any[]>(
      `SELECT user_id FROM users WHERE username = ?`,
      [username]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userRows[0].user_id;

    // Fetch ONLY top-level comments (no replies)
    const [result] = await db.query<UserComment[]>(
      `SELECT 
        c.comment_id,
        c.content,
        c.created_at,
        u.username,
        u.display_name,
        u.profile_image,
        (
          SELECT COUNT(*) 
          FROM comment_reactions cr 
          WHERE cr.comment_id = c.comment_id
        ) AS like_count,
        EXISTS (
          SELECT 1 
          FROM comment_reactions cr2 
          WHERE cr2.comment_id = c.comment_id AND cr2.user_id = ?
        ) AS isLiked
      FROM comments c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.user_id = ?
        AND c.parent_comment_id IS NULL
      ORDER BY c.created_at DESC`,
      [loggedInUserId, userId]
    );

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};