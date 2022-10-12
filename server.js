import express from "express";
import session from "express-session";

import MongoStore from "connect-mongo";
const mongoUrl = "mongodb://localhost:27017/coder"
const store = MongoStore.create({ mongoUrl, ttl: 60 })

const app = express()

app.use(express.urlencoded({ extended: true}))
app.use(express.json());

app.use(session({
    store,
    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false
}))

app.post('/login', (req, res) => {
    const { username } = req.body
  
    req.session.user = username
    req.session.admin = true
    res.send('login success!')
  })
  
  app.get('/privado', auth, (req, res) => {
    res.send(`Bienvenido ${req.session.user}`)
  })
  
  function auth(req, res, next) {
    
    if (req.session?.user && req.session?.admin) {
      return next()
    }
    return res.status(401).send('error de autorización!')
  }
  
  app.get('/logout', (req, res) => {
    const user = req.session.user

    if(user === undefined){
        res.send("No hay sesion activa");
    }

    req.session.destroy(err => {
      if (err) {
        res.json({ status: 'Logout ERROR', body: err })
      } else {
        res.send(`Hasta Luego ${user}!`);
      }
    })
  })
  
  const PORT = 8080
  app.listen(PORT, () => {
    console.log(`Servidor express escuchando en el puerto ${PORT}`)
  })