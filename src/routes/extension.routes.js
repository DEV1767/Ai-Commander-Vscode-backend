import { Router } from "express";
import ExtensionAuth from "../models/extension.code.models";
import { creatExtensioncode, exchangeExtensioncode } from "../controllers/extension.controller";
import { apiLimiter } from "../config/ratelimit.config";
import { verifyJwt } from "../middlewares/auth.middlewares";


const router = Router()

router.post("/create-token", verifyJwt, creatExtensioncode)
router.post("/exchange-token", exchangeExtensioncode)

export default router