import jwt from "jsonwebtoken"
import { User } from "../models/user.model"
import { registerSchema, loginSchema } from "../validators/user.validtors"
import bcrypt from "bcrypt"
import { use } from "react"


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
const loginuser = async (req, res) => {
    try {
        const { value, error } = loginSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error[0].message
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const ispasswordcorrect = await bcrypt.compare(password, user.password)
        if (!ispasswordcorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }
        const userdate = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        return res.status(200).json({
            success: true,
            message: "Logined successfull",
            user: userdate
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}