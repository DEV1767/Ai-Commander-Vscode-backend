import mongoose from "mongoose";
import "dotenv/config";

 const connect_db = async () => {
    try {
        const URL = process.env.MONGO_URL;

        if (!URL) {
            throw new Error("MONGO_URL is missing");
        }

        await mongoose.connect(URL);

        console.log("MongoDB connected");

    } catch (error) {
        console.log("MongoDB connection failed");
        throw error;
    }
};

export default  connect_db