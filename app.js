const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require("celebrate");
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const signUp = require('./routes/signup');
const signIn = require('./routes/signin');
const errorMiddleware = require('./middlewares/errorMiddleware');
//
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env; const app = express();
//
mongoose.connect(DB_URL).then(() => console.log('бд запущен'));
app.use(express.json());
app.use(helmet());

//

app.use(signUp);
app.use(signIn);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);
app.use(errors());
app.use(errorMiddleware);

//
app.listen(PORT, () => {
  console.log(`Приложение запущено на порте ${PORT}`);
});
