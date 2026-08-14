import express from "express";
import authroute from "./src/routes/auth.router.js";
import cookieParser from "cookie-parser";

app.use(cookieParser())

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/auth", authroute)
export default app;