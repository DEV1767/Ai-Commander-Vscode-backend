import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import {
    setRedis,
    getRedis,
    deleteRedis
} from "../utils/redis.helper.js";


// CREATE EXTENSION AUTHORIZATION CODE
export const creatExtensioncode = async (req, res) => {
    try {
        const userId = req.userId;

        const code = crypto.randomBytes(32).toString("hex");

        await setRedis(
            `extension:code:${code}`,
            {
                userId: userId.toString()
            },
            2 * 60
        );

        return res.status(200).json({
            success: true,
            code
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create extension authorization code"
        });
    }
};


// EXCHANGE EXTENSION AUTHORIZATION CODE
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

        const authRequest = await getRedis(redisKey);

        if (!authRequest) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired authorization code"
            });
        }

        const user = await User.findById(authRequest.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // One-time use
        await deleteRedis(redisKey);

        const accessToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: "1d"
            }
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