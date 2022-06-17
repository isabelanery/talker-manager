const express = require('express');
const fs = require('fs');

const router = express.Router();

const talker = './talker.json';
router.get('/', async (_req, res, next) => {
  // try {
  //   const data = await fs.readFile(talker, 'utf8'); >>> this piece of code wasn't working, err: must have a callback, recieved utf8 instead. idk why tho, seems to work on the tutorias I saw
  //   res.status(200).json(data);
  // } catch (err) {
  //   next(err);
  // }
  
  const data = await fs.readFile(talker, 'utf8', (err, content) => {
    if (err) return next(err);

    res.status(200).json(JSON.parse(content));
  });
  return data;
});

module.exports = router;