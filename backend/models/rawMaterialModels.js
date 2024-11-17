const mongoose = require('mongoose')


const sizeSchema = mongoose.Schema({
    size: {
        type: String,
        enum: ['small', 'medium', 'large'], 
        required: true,
    },
    stock: { // New field to track stock number
        type: Number,
        required: true,
        default: 0, // Default stock number can be 0
    }
});

const rawMaterialSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['soap', 'detergent'], 
        required: true,
    },
    sizes: [sizeSchema], 
    location: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'In Stock',
    },
})

const RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema);
module.exports = RawMaterial;