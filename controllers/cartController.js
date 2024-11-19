const User = require('../models/users.js')
const Product = require('../models/products.js')

exports.addToCart = async (req, res) => {
  const {productId} = req.body;

  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).send('Пользователь не найден!')

    const product = await Product.findById(req.product.id)
    if (!product) return res.status(404).send('Товар не найден!')

    const cartItem = user.cart.find(item => item.productId.toString() === productId)
    if (cartItem) {
      cartItem.quantity += 1
    } else {
      user.cart.push({
        productId: product._id,
        quantity: 1,
        price: product.price
      });
    }

    await user.save();
    res.status(200).send('Товар успешно добавлен в корзину!')
  } catch (e) {
    console.error(e)
    res.status(500).send('ошибка при добавлении!')
  }
};

exports.deleteFromCart = async (req, res) => {
  const {productId} = req.body
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).send('Пользователь не найден!')

    const cartItemIndex = user.cartfindIndex(item => item.productId.toString() === productId);

    if (cartItemIndex !== -1) {
      user.cart.splice(cartItemIndex, 1)
      await user.save();
      res.status(400).send('Товар успешно удален!')
    } else {
      res.status(404).send('Товар не найден в корзине');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при удалении товара из корзины');
  }
}

exports.viewCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');
    if(!user) return res.status(404).send('Такой пользователь не найден!')

    res.status(200).json({
      cart: user.cart.map(item => ({
        product: item.product.name,
        price: item.product.price,
        quantity: item.product.quantity
      })),
      total: user.cart.reduce((total, item) => total + item.price * item.quantity, 0)
    })
  } catch (error) {
    console.error (error)
    res.status(500).send('Ошибка при просмотре корзины!')
  }
}

exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).send('Пользователь не найден')

    user.cart = []
    await user.save()

    res.status(200).send('Корзина очищена')
  } catch (error) {
    console.error(error)
    res.status(500).send('Ошибка при очистке корзины')
  }
};