const express = require('express');
const fs = require('fs/promises');
const { 
  tokenValidation,
  validateTalker,
  validateTalk,
  validateRate } = require('./validationMiddlewares.js');

const router = express.Router();

const talker = './talker.json';
router.route('/')
  .get(async (_req, res, next) => {
    try {
      const data = JSON.parse(await fs.readFile(talker, 'utf8'));
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  })
  .post(
    tokenValidation,
    validateTalker,
    validateTalk,
    validateRate,
    async (req, res, next) => {
    try {
      const { name, age, talk: { watchedAt, rate } } = req.body;
      const talkersList = JSON.parse(await fs.readFile(talker, 'utf8'));
      const id = JSON.parse(await fs.readFile(talker, 'utf8')).length + 1;
      const newTalk = { name, age, id, talk: { watchedAt, rate } };
      
      const newList = JSON.stringify([...talkersList, newTalk]);
      await fs.writeFile(talker, newList);

      res.status(201).json(newTalk);
    } catch (err) {
      next(err);
    }
  },
  ); 

router.route('/:id')
  .get(async (req, res, next) => {
    try {
      const { id } = req.params;
      const talkerList = JSON.parse(await fs.readFile(talker, 'utf8'));

      const found = talkerList.find((person) => +person.id === +id);
      
      if (!found) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

      res.status(200).json(found);
    } catch (err) {
      next(err);
    }
  })
  .put(
    tokenValidation, 
    validateTalker,
    validateTalk,
    validateRate,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const number = +id;
        const { name, age, talk: { watchedAt, rate } } = req.body;
        
        const talkerList = JSON.parse(await fs.readFile(talker, 'utf8'));
        const talkIndex = talkerList.findIndex((item) => +item.id === +id);
        
        talkerList[talkIndex] = { name, age, id: number, talk: { watchedAt, rate } };
        
        await fs.writeFile(talker, JSON.stringify(talkerList));
        res.status(200).json({ id: number, name, age, talk: { watchedAt, rate } });
      } catch (err) {
        next(err);
      }
    },
  )
  .delete(tokenValidation, async (req, res, next) => {
    try {
      const { id } = req.params;

      const talkerList = JSON.parse(await fs.readFile(talker, 'utf8'));
      const newList = talkerList.filter((item) => +item.id !== +id);

      await fs.writeFile(talker, JSON.stringify(newList));
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

module.exports = router;