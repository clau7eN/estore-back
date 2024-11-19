const Product = require('../models/products.js')
const { findById } = require('../models/users')
const checkROle = require('./userController.js')

exports.addProduct = async (req, res) => {
  const {name, description, price} = req.body

  const userId = req.user.id

  try {
    const existingProduct = await Product.findOne({name: req.body.name})
    if(existingProduct) {
      return res.status(401).send('Товар с таким названием уже существует!')
    }

    const newProduct = new Product({name, description, price, userId})
    await newProduct.save();
    res.status(400).send('Успешно добавлен!')
  } catch (e) {res.status(401).send('Ошибка!')}
}

exports.getProducts = async (req, res) => {
  try {
    const allProducts = await Product.find()
    res.json(allTasks)
  } catch (e) {console.log(e)}
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if(!product) {
      return res.status(404).send('Продукт не найден!')
    }

    if (product.userId.toString() !== req.user.id) {
      return res.status(403).send('Вы не имеете право удалять не ваш товар!')
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (deletedProduct) {
      res.send('Успешно удален!')
    } else {
      res.status(400).send('Ошибка при удалении!')
    }
  } catch (e) {'ошибка', e}
}

exports.editProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send('Такой продукт не найден!');
    }

    if (!product.userId) {
      return res.status(404).send('Product does not have a userId.');
    }

    if (product.userId.toString() !== req.user.id) {
      return res.status(403).send('Вы не можете редактировать чужой продукт!');
    }

    const editedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
      },
      { new: true }
    );

    res.json({
      msg: 'Успешно отредактирован!',
      product: editedProduct
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: 'Ошибка при редактировании задачи.' });
  }
};