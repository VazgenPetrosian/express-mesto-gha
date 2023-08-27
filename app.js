const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
//
const { PORT = 3000 } = process.env;
const app = express();
//
mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`База данных запущена на ${PORT}`);
  });
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64ea7075bb2817611b4877a3', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

//
app.use(cardRouter);
app.use(userRouter);

//
app.listen(PORT, () => {
  console.log(`Приложение запущено на порте ${PORT}`);
});
