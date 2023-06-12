const tf = require('@tensorflow/tfjs-node');

const classes = ["green", "black"]

exports.makePredictions = async (req, res, next) => {
    const imagePath = `./public/images/${req && req['filename']}`;
    try {
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