import "dotenv/config";
import express from "express";

import connectDB from "./src/config/db.js";
import { connectRedis } from "./src/config/redis.config.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        console.log("MongoDB connected");

        await connectRedis();
        console.log("Redis connection initialized");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

startServer();