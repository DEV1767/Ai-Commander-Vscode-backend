import mongoose from "mongoose";
import "dotenv/config";

let connectionPromise = null;

const connect_db = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!connectionPromise) {
        const URL = process.env.MONGO_URL;

        if (!URL) {
            throw new Error("MONGO_URL is missing");
        }

        connectionPromise = mongoose.connect(URL, {
            serverSelectionTimeoutMS: 5000
        });
    }

    await connectionPromise;

    console.log("MongoDB connected");
};

export default connect_db;