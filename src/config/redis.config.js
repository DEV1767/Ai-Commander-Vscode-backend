import { createClient } from "redis";
import "dotenv/config";

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (err) => {
    console.log("Redis Error", err);
});

redisClient.on("connect", () => {
    console.log("Redis is connecting...");
});

redisClient.on("ready", () => {
    console.log("Redis connected successfully");
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

export default redisClient;