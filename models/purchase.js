const { Schema, model} = require('mongoose')


const Purchase = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    state_sales: {
        type: Boolean,
        default: true
    },
    state:{
        type: String,
        enum: ['PENDIENTE', 'ACEPTADO', 'ENCAMINO', 'ENTREGADO', 'CANCELADO', 'DEVUELTO']
    },
    code:{
        type: String,
        required: true
    },
    products: [
        {
            id: Schema.Types.ObjectId,
            quantity: Number,
            price: Number,
            discount: Number
        }        
    ],
    key: {
        type: String
    },
    price:{
        type: String, 
        required: true
    }
})

module.exports = model('Purchase', Purchase)