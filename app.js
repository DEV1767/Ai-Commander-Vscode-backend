import express from "express";
import authroute from "./src/routes/auth.router.js";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(express.json());
app.set("trust proxy", 1);
app.use(cookieParser())
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/auth", authroute)
export default app;