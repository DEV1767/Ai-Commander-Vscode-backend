import app from "../app.js";
import connect_db from "../src/config/db.js";
import { connectRedis } from "../src/config/redis.config.js";

const handler = async (req, res) => {
    try {
        await connect_db();
        await connectRedis();

        return app(req, res);
    } catch (error) {
        console.error("Server initialization error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default handler;