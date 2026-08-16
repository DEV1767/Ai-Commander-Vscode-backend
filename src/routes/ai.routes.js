import { AnalyseError, getVscodeErrors } from "../services/ai.services.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { Router } from "express";
import { apiLimiter } from "../config/ratelimit.config.js";

const router = Router()


router.post("/analyze", verifyJwt, apiLimiter, AnalyseError)
router.get("/errors/vscode", verifyJwt, getVscodeErrors)


export default router;