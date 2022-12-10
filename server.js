const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
// connecting our DB
mongoose
  .connect(DB)
  .then(() => console.log('Db connected Successfully'))
  .catch(err => console.log(err));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
