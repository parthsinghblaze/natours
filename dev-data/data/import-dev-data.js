const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
console.log('DB', DB);
// connecting our DB
mongoose
  .connect(DB)
  .then(() => console.log('Db connected Successfully'))
  .catch(err => console.log(err));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));

// importing the tour
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('created');
  } catch (err) {
    console.log(err)
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Deleted");
  } catch (e) {
    console.log("Error deleting")
  }
};

console.log("Running the dev data");


if(process.argv[2] === '--import') {
  importData();
} else if(process.argv[2] === '--delete') {
  deleteData();
}
