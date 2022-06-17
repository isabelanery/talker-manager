const express = require('express');
const crypto = require('crypto');

const router = express.Router();

const loginList = [];

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  loginList.push({ email, password });
  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token });
});

console.log(loginList);

module.exports = router;