const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 20
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    default: 'buyer'
  },
  cart: [{
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    quantity: {type: Number, default: 1},
    price: {type: Number}
  }]
}, { collection: 'users' });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
  } catch (e) {next(e)};
})

userSchema.methods.comparePassword = function(canditePassword) {
  return bcrypt.compare(canditePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)