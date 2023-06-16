import UserModel from "../models/UserModel.js";
import argon2 from "argon2";

export const login = async (req, res) => {
    const user = await UserModel.findOne({
        where: {
            email: req.body.email
        }
    })
    if (!user) return res.status(404).json({msg: "User not found"})

    const match = await argon2.verify(user.password, req.body.password)
    if (!match) return res.status(400).json({msg: "Wrong password"})
    req.session.userId = user.uuid
    const uuid = user.uuid
    const username = user.username
    const email = user.email
    const role = user.role
    res.set('Custom-Header', 'Nilai-Header');
    res.status(200).json({uuid, username, email, role})
}

export const profile = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({msg: "Please login first"})
    } else {
        const user = await UserModel.findOne({
            where: {
                uuid: req.session.userId
            }
        })
        if (!user) return res.status(404).json({msg: "User not found"})
        res.status(200).json(user)
    }
}
export const logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({msg: "can not logout"})
        res.status(200).json({msg: "You success to logout"})
    })
}