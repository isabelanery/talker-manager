const express = require('express');
const fs = require('fs/promises'); // this fixed the try/catch problem

const router = express.Router();

const talker = './talker.json';
router.get('/', async (_req, res, next) => {
  try {
    const data = JSON.parse(await fs.readFile(talker, 'utf8'));
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;