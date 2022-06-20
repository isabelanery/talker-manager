const express = require('express');
const crypto = require('crypto');
const validator = require('validator');

const router = express.Router();

const loginList = [];
const tokenList = [];

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });

  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  
  if (!validator.isEmail(email)) {
    return res.status(400).json({ 
    message: 'O "email" deve ter o formato "email@email.com"' });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  next();
};

router.post('/', validateLogin, (req, res) => {
  const { email, password } = req.body;
  const token = crypto.randomBytes(8).toString('hex');
  loginList.push({ email, password, token });
  res.status(200).json({ token });
});

console.log(loginList);

module.exports = router;
exports.tokenList = tokenList;