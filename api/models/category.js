const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    Name: String,
    Img: String
});

module.exports = mongoose.model('categories', categorySchema);

