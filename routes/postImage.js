const express = require('express')
const router = express.Router()
const Multer = require('multer')
const mysql = require('mysql')
const imgUpload = require('../modules/imgUpload')


const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'try_capstone',
    password: ''
})

router.post("/insertrecord", multer.single('attachment'), imgUpload.uploadToGcs, (req, res) => {
    const name = req.body.name
    const amount = req.body.amount
    const date = req.body.date
    const notes = req.body.notes
    let imageUrl = ''

    if (req.file && req.file.cloudStoragePublicUrl) {
        imageUrl = req.file.cloudStoragePublicUrl
    }

    const query = "INSERT INTO records (name, amount, date, notes, attachment) values (?, ?, ?, ?, ?)"

    connection.query(query, [name, amount, date, notes, imageUrl], (err, rows, fields) => {
        if (err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.send({message: "Insert Successful"})
        }
    })
})

router.post("/uploadImage", multer.single('image'), imgUpload.uploadToGcs, (req, res, next) => {
    const data = req.body
    if (req.file && req.file.cloudStoragePublicUrl) {
        data.imageUrl = req.file.cloudStoragePublicUrl
    }

    res.send(data)
})

module.exports = router