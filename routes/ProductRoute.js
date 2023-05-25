import express from "express";
import {getProducts} from "../controllers/Product.js"

const router = express.Router()

router.get("/product", getProducts)

export default router