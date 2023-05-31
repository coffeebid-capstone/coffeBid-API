import express from "express";
import {getProducts, getProductsByID, deleteProduct} from "../controllers/Product.js"
import imgUpload from "../modules/imgUpload.js";
import Multer from "multer"
import mysql from "mysql2"
import {nanoid} from "nanoid"

const router = express.Router()

const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'capstone',
    password: ''
})

router.get("/api/v1/product", getProducts)
// router.post("/api/v1/product", createProduct)

router.post("/api/v1/product", multer.single('productPict'), imgUpload.uploadToGcs, (req, res) => {
    const name = req.body.name
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const type = req.body.type
    const description = req.body.description
    const openPrice = req.body.openPrice
    const finalPrice = req.body.finalPrice
    const status = req.body.status
    const winner = req.body.winner
    const userId = req.body.userId
    const uuid = nanoid(32)

    let imageUrl = ''

    if (req.file && req.file.cloudStoragePublicUrl) {
        imageUrl = req.file.cloudStoragePublicUrl
    }

    const query = "INSERT INTO product (uuid, name, startDate, endDate, productPict, type, description, openPrice, finalPrice, status, winner, userId) values (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

    connection.query(query, [uuid, name, startDate, endDate, imageUrl, type, description, openPrice, finalPrice, status, winner, userId], (err, rows, fields) => {
        if (err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.send({message: "Insert Successful"})
        }
    })
})


router.post("/api/v1/image", multer.single('image'), imgUpload.uploadToGcs, (req, res, next) => {
    const data = req.body
    if (req.file && req.file.cloudStoragePublicUrl) {
        data.imageUrl = req.file.cloudStoragePublicUrl
    }
    res.send(data)
})
router.get("/api/v1/product/:id", getProductsByID)
router.delete("/api/v1/product/:id", deleteProduct)

export default router