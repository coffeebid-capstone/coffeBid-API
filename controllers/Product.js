import productModel from "../models/ProductModel.js";
import userModel from "../models/UserModel.js";
import ProductModel from "../models/ProductModel.js";

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
        res.status(400).json({msg: e.message})
    }
}

export const createProduct = async (req, res) => {
    const {
        name,
        startDate,
        endDate,
        productPict,
        type,
        description,
        openPrice,
        finalPrice,
        status,
        winner,
        userId
    } = req.body
    try {
        await productModel.create({
            name: name,
            startDate: startDate,
            endDate: endDate,
            productPict: productPict,
            type: type,
            description: description,
            openPrice: openPrice,
            finalPrice: finalPrice,
            status: status,
            winner: winner,
            userId: userId,
        })
        res.status(201).json({msg: "Product berhasil ditambahkan"})
    } catch (error) {
        res.status(400).json({msg: error.message})
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
        return res.status(500).json({msg: e.message})
    }
}

export const deleteProduct = async (req, res) => {
    const product = await ProductModel.findOne({
        where: {
            uuid: req.params.id
        }
    })
    if (!product) return res.status(404).json({msg: "Product not found"})
    try {
        await ProductModel.destroy({
            where: {
                id: product.id
            }
        })
        res.status(200).json({msg: "Deleted"})
    } catch (e) {
        res.status(400).json({msg: e.message})
    }

}
