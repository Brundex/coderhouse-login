import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import cookieParser from 'cookie-parser'
import { __dirname } from './path.js'
import indexRouter from './routes/indexRouter.js'
import passport from 'passport'
import initializePassport from './config/passport/passport.js'
import path from 'path'

//Configuraciones o declaraciones
const app = express()
const PORT = 8000

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

//Connection DB
mongoose.connect("mongodb+srv://puodziunasb:9xV!wL9VnHeEqg@cluster0.s05wzm8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log("DB is connected")).catch(e => console.log(e))

//Middlewares
app.use(express.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

app.use(session({
    secret: "coderSecret",
    resave: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://puodziunasb:9xV!wL9VnHeEqg@cluster0.s05wzm8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        ttl: 60 * 60
    }),
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)

app.use(cookieParser("claveSecreta"))

app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'Esto es una cookie :)', { maxAge: 3000000, signed: true }).send("Cookie creada")
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies)
})

app.get('/deleteCookie', (req, res) => {
    res.clearCookie('CookieCookie').send("Cookie eliminada")
    //res.cookie('CookieCokie', '', { expires: new Date(0) })
})

app.get('/session', (req, res) => {
    console.log(req.session)
    if (req.session.counter) {
        req.session.counter++
        res.send(`Sos el usuario N° ${req.session.counter} en ingresar a la pagina`)
    } else {
        req.session.counter = 1
        res.send("Sos el primer usuario que ingresa a la pagina")
    }
})

app.post('/login', (req, res) => {
    const { email, password } = req.body

    if (email == "admin@admin.com" && password == "1234") {
        req.session.email = email
        req.session.password = password


    }
    console.log(req.session)
    res.send("Login")
})

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.redirect('/login'); // Redireccionar a la página de inicio de sesión
});

io.on('connection', (socket) => {
    console.log("Conexion con Socket.io")

    socket.on('mensaje', async (mensaje) => {
        try {
            await messageModel.create(mensaje)
            const mensajes = await messageModel.find()
            io.emit('mensajeLogs', mensajes)
        } catch (e) {
            io.emit('mensajeLogs', e)
        }

    })

})