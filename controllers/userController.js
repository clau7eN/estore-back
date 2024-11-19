const User = require('../models/users.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

secretKey = process.env.secretKey;

exports.registration = async (req, res) => {
  const {email, password, role} = req.body;

  try {
    const existingUser = await User.findOne({email: req.body.email})
    if(existingUser) {
      return res.send('Эта почта уже занята!')
    }

    const user = new User ({email, password, role})
    await user.save()
    res.status(201).send('Успешная регистрация!')
  } catch (e) {console.log('Ошибка!', e), res.status(500).send('Ошибка при регистрации!')}
}

exports.auth = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email})
    if(!user) res.status(404).send('Пользователь не найден!')

    const isMatch = await user.comparePassword(password);
    if(!isMatch) res.status(400).send('Неверный пароль!')

    const token = jwt.sign({id: user._id, role: user.role}, secretKey, {expiresIn: '1h'})
    res.json({token})
  } catch (e) {console.error(e)}
} 

exports.protect = (requiredRole) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).send('Нет токена!');

      const decoded = jwt.verify(token, secretKey);
      if (decoded.role !== requiredRole) {
        return res.status(403).send('У вас не та роль!');
      }

      req.user = decoded;
      next();
    } catch (e) {
      console.error('Неверный или просроченный токен!');
      res.status(401).send('Неверный или просроченный токен!');
    }
  };
};
