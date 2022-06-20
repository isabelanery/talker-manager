const validator = require('is-my-date-valid');

const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });

  if (authorization.length < 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  
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
  
  const { watchedAt } = talk;
  if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });

  const validate = validator({ format: 'DD/MM/YYYY' });
  if (!validate(watchedAt)) {
    return res.status(400).json({ 
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};

const validateRate = (req, res, next) => {
  const { talk } = req.body;
  const { rate } = talk;

  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });

  if (rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  
  if (!rate) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  
  // if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });

  next();
};

module.exports = { 
  tokenValidation,
  validateTalker,
  validateTalk,
  validateRate };