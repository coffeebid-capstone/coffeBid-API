import productModel from "../models/ProductModel.js";
import userModel from "../models/UserModel.js";

export const getProducts = async (req, res) => {
    try {
        let response
        if (req.role === "admin") {
            response = await productModel.findAll({
                include: [{
                    model: userModel // hanya menampilkan produk yang di input user karena terdapat relasi di tb user dan produk
                }]
            })
        } else {
            response = await productModel.findAll({
                where: {},
                include: [{
                    model: userModel // hanya menampilkan produk yang di input user karena terdapat relasi di tb user dan produk
                }]
            })
        }
        res.status(200).json(response)
    } catch (e) {
        res.status(400).json({ msg: e.message })
    }
}

export const getProductsByID = async (req, res) => {
    try {
        let response
        response = await productModel.findOne({
            where: {
                uuid: req.params.id
            }
        })
        res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ msg: e.message })
    }
}
