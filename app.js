import express from "express";
import authroute from "./src/routes/auth.router.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json());
app.set("trust proxy", 1);
app.use(cookieParser())


app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/auth", authroute)
export default app;