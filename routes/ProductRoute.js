import express from "express";
import { getProducts, getProductsByID } from "../controllers/Product.js"
import imgUpload from "../modules/imgUpload.js";
const router = express.Router()
import Multer from "multer"

const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

router.get("/api/v1/product", getProducts)
router.post("/api/v1/image", multer.single('image'), imgUpload.uploadToGcs, (req, res, next) => {
    const data = req.body
    if (req.file && req.file.cloudStoragePublicUrl) {
        data.imageUrl = req.file.cloudStoragePublicUrl
    }

    res.send(data)
})
router.get("/api/v1/product/:id", getProductsByID)

export default router