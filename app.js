import express from "express";
import authroute from "./src/routes/auth.router.js";
import extensionroute from "./src/routes/extension.routes.js";

import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.set("trust proxy", 1);

app.use(cookieParser());

app.use(
    cors({
        origin: ["https://ai-commander-frontend-topaz.vercel.app"],
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/auth", authroute);
app.use("/api/extension", extensionroute);

export default app;