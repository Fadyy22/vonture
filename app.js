const express = require('express');
const dotenv = require('dotenv');
const mountRotues = require('./routes/index');

dotenv.config();

const app = express();
app.use(express.json());

mountRotues(app);

// app.use((error, req, res, next) => {
//   res.json({
//     error: error
//   });
// });

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
