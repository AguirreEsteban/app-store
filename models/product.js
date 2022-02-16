const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
const Product = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    characteristics:[ {
        type:String,
        required: true
    }],
    state: {
        type: Boolean,
        default: true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    providers:{
        type: String,
    },
    categories: [{
        type: String,
        ref: 'Category'
    }],
    images:[{type:String, required: true}],
    discount:{
        type: Number,
        default: 0
    },
    quantity:{
        type: Number,
        required: true
    },
    filter:[Object],
    tags:Array,
    brand: String
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

Product.plugin(mongoosePaginate);


module.exports = model('Product', Product)