import express from "express";
const router = express.Router()
import Multer from "multer"
import mysql from "mysql2"
import imgUpload from "../modules/imgUpload.js";


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
            res.status(500).send({ message: err.sqlMessage })
        } else {
            res.send({ message: "Insert Successful" })
        }
    })
})

router.post("/predict", multer.single('image'), imgUpload.uploadToGcs, (req, res) => {
    let imageUrl = ''

    if (req.file && req.file.cloudStoragePublicUrl) {
        imageUrl = req.file.cloudStoragePublicUrl
    }

    const makePredictions = async (imagePath) => {
        try {
            const loadModel = async (img) => {
                const output = {};
                // laod model
                console.log('Loading.......')
                const model = await tf.node.loadSavedModel(path.join(__dirname, '..', 'ml-model'));
                // classify
                // output.predictions = await model.predict(img).data();
                let predictions = await model.predict(img).data();
                predictions = Array.from(predictions);
                output.success = true;
                output.message = `Success.`;
                output.predictions = predictions;
                res.statusCode = 200;
                res.json(output);
            };

            await image(imagePath, async (err, imageData) => {
                try {
                    const image = fs.readFileSync(imagePath);
                    let tensor = tf.node.decodeImage(image);
                    const resizedImage = tensor.resizeNearestNeighbor([150, 150]);
                    const batchedImage = resizedImage.expandDims(0);
                    const input = batchedImage.toFloat().div(tf.scalar(255));
                    await loadModel(input);
                    // delete image file
                    fs.unlinkSync(imagePath, (error) => {
                        if (error) {
                            console.error(error);
                        }
                    });
                } catch (error) {
                    res.status(500).json({ message: "Internal Server Error!" });
                }
            });
        } catch (error) {
            console.log(error)
        }
    };

    makePredictions(imageUrl)

})


export default router