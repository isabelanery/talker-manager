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

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const talkerList = JSON.parse(await fs.readFile(talker, 'utf8'));

    const found = talkerList.find((person) => +person.id === +id);
    
    if (!found) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

    res.status(200).json(found);
  } catch (err) {
    next(err);
  }
});

module.exports = router;