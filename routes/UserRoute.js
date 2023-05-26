import express from "express"
import {register, getProfileById} from "../controllers/Users.js";
// import {getProfileById} from "../controllers/Users.js"
const router = express.Router()

router.post("/api/v1/signup", register) //clear
router.get("/api/v1/profile/:id", getProfileById)
export default router