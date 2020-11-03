const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
     Name:String, 
     PriceForCustomer:Number,
     PriceForSupplier:Number,
     MinimumToSupplier:Number,
     Manufacturer:String,
     Description:String,
     Img:String,
     CatalogNumber:Number,
     Cost:Number,
     Inventory:Number,
     Category:[String],
     Tag:String,
     Size:String
});

module.exports = mongoose.model('products',itemSchema );

