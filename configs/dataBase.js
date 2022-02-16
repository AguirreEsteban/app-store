const mongoose = require('mongoose')
const { mongoUri } = require('./vars')

if (process.env.NODE_ENV != 'production') {
    mongoose.set('debug', true)
}

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(db => console.log('Base de datos conectada'))
.catch(err => console.log(err))