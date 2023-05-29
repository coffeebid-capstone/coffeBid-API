import express from "express"
import { register, getProfileById } from "../controllers/Users.js";
const router = express.Router()

router.post("/api/v1/signup", register)
router.get("/api/v1/profile/:id", getProfileById)
export default router