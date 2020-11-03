const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const cartSchema = new Schema({
    products: [{
        ProductId: String,
        Quantity: Number
    }]
});

module.exports = mongoose.model('carts', cartSchema);