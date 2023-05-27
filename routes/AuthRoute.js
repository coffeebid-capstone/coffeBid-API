import express from "express"
import {login, profile, logOut} from "../controllers/Auth.js";

const router = express.Router()

router.post("/api/v1/auth/signIn", login)
router.delete("/api/v1/auth/signOut", logOut)
router.get("/api/v1/profile", profile)
export default router