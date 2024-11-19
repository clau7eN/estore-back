const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 80
  },
  price: {
    type: Number,
    required: true
  }
}, { collection: 'products' });

module.exports = mongoose.model('product', productSchema)