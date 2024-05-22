const express = require('express');
const dotenv = require('dotenv');
const mountRotues = require('./routes/index');

dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

mountRotues(app);

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  res.status(error.statusCode).json({
    error: error,
    message: error.message,
  });
});

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
