import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";

const db: mysql.Pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER1,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  timezone:"Z",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const checkDBConnnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Connection Failed: ", err);
  }
};

checkDBConnnection();

export default db;
