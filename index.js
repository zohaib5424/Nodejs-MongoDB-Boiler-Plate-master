import createError from 'http-errors';
import express from 'express';
import request from 'request';
var app = express();
import dotenv from 'dotenv';
dotenv.config();
import db from './config/dbConfig.js';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';

import userroutes1 from './routes/userRoutes.js';
const port = 5000;
import cors from 'cors';
import expressSanitizer from 'express-sanitizer';
const { urlencoded, json } = bodyParser;
// parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: false }));
// parse application/json
app.use(logger('dev'));
app.use(cors());
app.use(json());
app.use(expressSanitizer());
app.use(cookieParser());
app.use('/backend/user', userroutes1);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
