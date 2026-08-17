import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { registerSchema, loginSchema } from "../validators/user.validtors.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"
import { setRedis, getRedis, deleteRedis } from "../utils/redis.helper.js"
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser"



//Register-user
export const registerUser = async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const { username, email, password } = value

        const existinguser = await User.findOne({ email })
        if (existinguser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            })
        }

        const hashedpassword = await bcrypt.hash(password, 10)
        const newuser = await User.create({
            username,
            email,
            password: hashedpassword
        })
        return res.status(201).json({
            success: true,
            message: "Registered Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}

//Login-user
export const loginUser = async (req, res) => {
    try {
        const { value, error } = loginSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { email, password } = value;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);


        user.refreshToken = refreshToken;

        await user.save();
        await setRedis(
            `refresh:${user._id}`,
            refreshToken,
            7 * 24 * 60 * 60
        );
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email
        };


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: userData,


            accessToken
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//get-me
export const getme = async (req, res) => {
    try {

        const cachekey = `user:${req.userId}`

        const cachedUser = await getRedis(cachekey)
        if (cachedUser) {
            return res.status(200).json({
                success: true,
                user: cachedUser,
                source: "cache"
            })
        }

        const user = await User.findById(req.userId)
            .select("-password -refreshToken");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        await setRedis(
            cachedkey,
            user,
            600
        )

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//generate-refresh Token
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken =
            req.cookies?.refreshToken || req.body?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is required"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        const storedToken = await getRedis(
            `refresh:${user._id}`
        );

        if (!storedToken || storedToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }


        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);


        user.refreshToken = newRefreshToken;
        await user.save();


        await setRedis(
            `refresh:${user._id}`,
            newRefreshToken,
            7 * 24 * 60 * 60
        );


        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        console.log("REFRESH ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token"
        });
    }
};
//logout
export const logoutuser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not founf"
            })
        }

        user.refreshToken = null;
        await user.save()

        await deleteRedis(`refresh: ${user._id}`)
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax"
        });
        return res.status(200).json({
            success: true,
            message: "Logout Successful"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}