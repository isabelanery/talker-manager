const express = require('express');
const fs = require('fs/promises'); // this fixed the try/catch problem
const validator = require('is-my-date-valid');

const router = express.Router();

const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });

  if (authorization.length < 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  
  next();
};

// 42927b53d8dfa9ab

const validateRate = (req, res, next) => {
  const { talk: { watchedAt, rate } } = req.body;

  if (!rate) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });

  if (rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });

  next();
};

const validateTalker = (req, res, next) => {
  const { name, age } = req.body;
  
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });

  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  
  if (+age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  
  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;  
  
  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });

  if (talk) {
    const { watchedAt } = talk;
    
    const validate = validator({ format: 'DD/MM/YYYY' });
    if (!validate(watchedAt)) {
      return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }
  }

  next();
};

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
      const { name, age, id, talk: { watchedAt, rate } } = req.body;
      const talkersList = JSON.parse(await fs.readFile(talker, 'utf8'));
      const newTalk = { name, age, id, talk: { watchedAt, rate } };
      
      const newList = JSON.stringify([...talkersList, newTalk]);
      await fs.writeFile(talker, newList);

      res.status(201).json(newTalk);
    } catch (err) {
      next(err);
    }
  },
  ); 

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