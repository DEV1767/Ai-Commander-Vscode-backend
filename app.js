import express from "express";

import authroute from "./src/routes/auth.router.js";
import extensionroute from "./src/routes/extension.routes.js";
import airoutes from "./src/routes/ai.routes.js";

import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());

app.set("trust proxy", 1);

app.use(cookieParser());

const ALLOWED_ORIGINS = [
    "https://ai-commander-frontend-topaz.vercel.app"
];

app.use(
    cors({
        origin: (origin, callback) => {
            // No origin (e.g. curl, server-to-server, or Node's own fetch
            // from extension.ts) — allow it.
            if (!origin) return callback(null, true);

            // Known frontend — allow with credentials.
            if (ALLOWED_ORIGINS.includes(origin)) {
                return callback(null, true);
            }

            // VS Code webview origins look like vscode-webview://<id>
            // They're per-session/random, so we match the scheme instead
            // of an exact string.
            if (origin.startsWith("vscode-webview://")) {
                return callback(null, true);
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    })
);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/auth", authroute);
app.use("/api/extension", extensionroute);
app.use("/api/commander", airoutes);

export default app;