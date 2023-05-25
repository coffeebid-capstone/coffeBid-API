import UserModel from "../models/UserModel.js";
import argon2 from "argon2"

export const register = async (req, res) => {
    const {username, email, password, confirmPassword, address, contact, role} = req.body
    if (password !== confirmPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const hashPassword = await argon2.hash(password)
    try {
        await UserModel.create({
            username: username,
            email: email,
            password: hashPassword,
            address: address,
            contact: contact,
            role: role
        })
        res.status(201).json({msg: "Register berhasil"})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}