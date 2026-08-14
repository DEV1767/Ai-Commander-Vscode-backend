import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { registerUser, loginUser, getme, refreshAccessToken, logoutuser } from "../controllers/auth.controller.js";
import { authLimiter } from "../config/ratelimit.config.js"


const router = Router();



router.post("/register", authLimiter, registerUser)
router.post("/login", authLimiter, loginUser)
router.get("/me", verifyJwt, getme)
router.get("/refresh", refreshAccessToken)
router.post("/logout", verifyJwt, logoutuser)


export default router