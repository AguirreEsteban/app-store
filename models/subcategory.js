const { Schema, model } = require('mongoose')


const Subcategory = new Schema({
    name: {
        type: String,
        required: true,
        index:{unique: true, dropDups: true}
    },
    description: {
        required: true,
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref:'Category'
    }
}, {
    timestamps: true
})




module.exports = model('Subcategory', Subcategory)