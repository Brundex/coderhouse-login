import { Router } from "express";
import passport from "passport";

const sessionRouter = Router()

sessionRouter.get('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send("Usuario o contraseña no validos")
        }

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }

        res.status(200).send("Usuario logueado correctamente")

    } catch (e) {
        res.status(500).send("Error al loguear usuario")
    }
})

sessionRouter.post('/register', passport.authenticate('register'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send("Usuario ya existente en la aplicacion")
        }

        res.status(200).send("Usuario creado correctamente")

    } catch (e) {
        res.status(500).send("Error al registrar usuario")
    }
})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(function (e) {
        if (e) {
            console.log(e)
        } else {
            res.status(200).redirect("/")
        }

    })
})

export default sessionRouter