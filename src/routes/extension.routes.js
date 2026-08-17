import { Router } from "express";
import ExtensionAuth from "../models/extension.code.models.js";
import { creatExtensioncode, exchangeExtensioncode } from "../controllers/extension.controller.js";
import { apiLimiter } from "../config/ratelimit.config.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { deleteAnalysedError } from "../services/ai.services.js"


const router = Router()

router.post("/create-token", verifyJwt, creatExtensioncode)
router.post("/exchange-token", exchangeExtensioncode)
router.delete("/delete/:id", verifyJwt, deleteAnalysedError)

export default router