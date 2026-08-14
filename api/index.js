import app from "../app.js";
import connect_db from "../src/config/db.js";

const handler = async (req, res) => {
    await connect_db();
    return app(req, res);
};

export default handler;