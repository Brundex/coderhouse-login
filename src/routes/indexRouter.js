import cartRouter from './cartRouter.js'
import productsRouter from './productsRouter.js'
import userRouter from './userRouter.js'
import upload from '../config/multer.js'
import sessionRouter from './sessionRouter.js'
import express from 'express'
import { __dirname } from '../path.js'

const indexRouter = express.Router()

//Routes
indexRouter.get('/', (req, res) => {
    res.status(200).send("Bienvenido/a!")
})
indexRouter.use('/public', express.static(__dirname + '/public'))
indexRouter.use('/api/products', productsRouter, express.static(__dirname + '/public'))
indexRouter.use('/api/cart', cartRouter)
indexRouter.use('/api/users', userRouter)
indexRouter.use('/api/session', sessionRouter)

indexRouter.post('/upload', upload.single('product'), (req, res) => {
    try {
        console.log(req.file)
        res.status(200).send("Imagen cargada correctamente")
    } catch (e) {
        res.status(500).send("Error al cargar imagen")
    }
})

export default indexRouter