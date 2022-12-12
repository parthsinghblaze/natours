const dotenv = require('dotenv');
const mongoose = require('mongoose');

// dotenv.config({ path: '../../config.env' });
dotenv.config({ path: '../../config.env' });
const DB = process.env.DATABASE;
// connecting our DB
mongoose
  .connect(DB)
  .then(() => console.log('Db connected Successfully'))
  .catch(err => console.log(err));
