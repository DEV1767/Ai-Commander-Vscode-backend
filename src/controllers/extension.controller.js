import crypto from "crypto"
import jwt from "jsonwebtoken"
import ExtensionAuth from "../models/extension.code.models.js"



export const creatExtensioncode = async (req, res) => {
    try {
        const userId = req.userId   
        const code = crypto.randomBytes(32).toString("hex")
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000)

        await ExtensionAuth.create({
            code,
            userId,
            expiresAt
        })

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




export const exchangeExtensioncode = async (req, res) => {
    try {
        const { code } = req.body

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Authorization code is required"
            })
        }

        const authRequest = await ExtensionAuth.findOne({
            code,
            used: false
        })

        if (!authRequest) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization code"
            })
        }

        if (authRequest.expiresAt < new Date()) {
            await ExtensionAuth.deleteOne({ _id: authRequest._id })
            return res.status(401).json({
                success: false,
                message: "Authorization code expired"
            })
        }

        const user = await User.findById(authRequest.userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        authRequest.used = true
        await authRequest.save()

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_ACCESS_SECRET,   
            { expiresIn: "15m" }
        )

        return res.status(200).json({
            success: true,
            accessToken
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Extension authentication failed"
        })
    }
}