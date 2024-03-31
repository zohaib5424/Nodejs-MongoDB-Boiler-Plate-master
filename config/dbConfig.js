// const mongoose = require('mongoose');

//  mongoose.Promise = global.Promise;
//  require('dotenv').config()

//  mongoose.connect(`${process.env.DB_URL}`, {
//   dbName: process.env.DB_NAME,
//   user: process.env.USERR,
//   pass: process.env.PASS,
//   useNewUrlParser: true,
//   useUnifiedTopology: true
//  }, function (err) {

//   if (err) throw err;

//   console.log('Successfully connected');

//   });

//  module.exports = db=mongoose.connection;
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.Promise = global.Promise;

mongoose
  .connect(`${process.env.DB_URL}`, {
    dbName: process.env.DB_NAME,
    user: process.env.USERR,
    pass: process.env.PASS,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connected');
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });

export default mongoose.connection;
