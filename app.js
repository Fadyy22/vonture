const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const jobs = require('./utils/jobs');
const mountRotues = require('./routes/index');
const { webhookCheckout } = require('./utils/stripe');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.static('public'));

app.post('/webhook', express.raw({ type: 'application/json' }), webhookCheckout);

app.use(express.json());

mountRotues(app);

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'not found',
  });
});

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
