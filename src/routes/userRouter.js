import { Router } from "express";
import { userModel } from "../models/user.js";

const userRouter = Router()

userRouter.get('/', async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send("Error al consultar users: ", e)
    }
})

export default userRouter