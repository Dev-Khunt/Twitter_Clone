import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import db from './config/db.config';
import authRoutes from './routes/auth_routes'
import userRoutes from './routes/user_routes'
import tweetRoutes from './routes/tweet_routes'
import reTweetRoutes from './routes/retweet_routes'
import followRoutes from './routes/follow_routes'
import commentRoutes from './routes/comment_routes'
import reactionRoutes from './routes/reaction_rotues'
import searchRoutes from "./routes/search_routes";

const app :  express.Application = express();
dotenv.config();
import path from 'path';

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
db;

app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:4000'],
    }),
)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - Landing page
app.get("/", (req, res) => {
    res.render("layout/landing");
});

// Auth routes - View pages
app.get("/auth/signup", (req, res) => {
    res.render("signup/signup");
});

app.get("/auth/signin", (req, res) => {
    res.render("signin/signin");
});

// App View routes (client-side auth via localStorage JWT)
app.get("/home", (req, res) => {
    res.render("home/home");
});

app.get("/api/users/:username", (req, res) => {
    res.render("profile/profile");
});

// app.get("/api/tweet/:id", (req, res) => {
//     res.render("tweet");
// });

app.get("/explore", (req, res) => {
    res.render("explore/explore");
});

app.get("/feed", (req, res) => {
    res.render("feed");
});

// render page (NO auth)
app.get("/api/tweet/:id", (req, res) => {
  res.render("tweet");   // tweet.ejs
});


// API routes
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/tweets",tweetRoutes);
app.use("/retweets",reTweetRoutes);
app.use("/follows",followRoutes);
app.use("/comments",commentRoutes);
app.use("/reactions",reactionRoutes)
app.use("/search", searchRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});