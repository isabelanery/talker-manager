const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const talkerRouter = require('./routerTalker.js');
const errorMiddleware = require('./errorMiddleware.js');
// const fs = require('fs');

const app = express();
app.use(bodyParser.json(), cors());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.use('/talker', talkerRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('Online');
});
