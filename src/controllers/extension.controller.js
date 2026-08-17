import crypto from "crypto"
import jwt from "jsonwebtoken"
import ExtensionAuth from "../models/extension.code.models.js"
import { User } from "../models/user.model.js"
import { setRedis, getRedis, deleteRedis } from "../utils/redis.helper.js"


//create extension
export const creatExtensioncode = async (req, res) => {
    try {
        const userId = req.userId
        const code = crypto.randomBytes(32).toString("hex")

        await setRedis(
            `extension:Code:${code}`, {
            userId: userId.toString
        },
            2 * 60
        )

        return res.status(200).json({
            success: true,
            code
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to create extension authorization code"
        })
    }
}

//exchaange extension
export const exchangeExtensioncode = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Authorization code is required"
            });
        }

        const redisKey = `extension:code:${code}`;

        const authrequest = await getRedis(redisKey);

        if (!authrequest) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization code"
            });
        }

        const user = await User.findById(authrequest.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // One-time use
        await deleteRedis(redisKey);

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            accessToken
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Extension authentication failed"
        });
    }
};