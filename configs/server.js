require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const cors = require('cors')


//Routes import
const UserRoutes = require('../routes/user')
const ProductRoutes = require('../routes/product')
const CategoryRoutes = require('../routes/categotyAndSubcategory')

const app = express()

app.use((req, res, next) => { res.setHeader('X-Developed-by', 'Diseño de software 2'); next()})

if (process.env.NODE_ENV == 'production') {
    app.use(morgan('tiny'))
    app.use(cors())
}
else {
    app.use(morgan('dev'))
    app.use(cors())
}

app.use(express.json())
app.use(express.urlencoded({extended: false}))


//routes

app.use('/', CategoryRoutes )
app.use('/user', UserRoutes)
app.use('/product', ProductRoutes)



app.use((req, res) => res.json({info: `Unable to ${req.method} ${req.path}`}))

module.exports = app