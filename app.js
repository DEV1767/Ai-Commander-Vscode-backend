import express from "express";
import authroute from "./routes/auth.router.js";
import extensionroute from "./routes/extension.routes.js";
import airoutes from "./routes/ai.routes.js";

import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());

app.set("trust proxy", 1);

app.use(cookieParser());

app.use(
    cors({
        origin: "https://ai-commander-frontend-topaz.vercel.app",
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/auth", authroute);
app.use("/api/extension", extensionroute);
app.use("/api/commander", airoutes);

export default app;