const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 4200;
const dbUrl = process.env.DB_URL;

const app = express();
app.use(express.json());

mongoose.connect(dbUrl)
  .then (() => console.log('Успешное подключение к бд!'))
  .catch ((e) => console.log('Неуспешное подключение!', e))

const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')

app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes)

app.listen(port, () => {
  console.log(`Сервер запущен и работает на ${port}`)
})