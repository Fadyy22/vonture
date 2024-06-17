const express = require('express');
const dotenv = require('dotenv');

const jobs = require('./utils/jobs');
const mountRotues = require('./routes/index');


dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

mountRotues(app);

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  res.status(error.statusCode).json({
    message: error.message,
  });
});

jobs();

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`listening on http://${process.env.HOST}:${process.env.PORT}`);
});
