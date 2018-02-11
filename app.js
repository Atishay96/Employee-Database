require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const path = require('path');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const app = express();
//production mode
const mongoose = require('mongoose');
//development mode
// const mongoose = require('mongoose').set('debug',true);
mongoose.Promise = global.Promise;
//production mode
if(process.env.mode === 'production'){
	process.env.database = process.env.ProdDatabase;
	process.env.port = process.env.Prodport;
	process.env.baseURL = process.env.ProdBaseURL;
}else if(process.env.mode === 'development'){ 	//development mode
	process.env.database = process.env.DevDatabase;
	process.env.port = process.env.Devport;
	process.env.baseURL = process.env.DevBaseURL;
}

//connect mongoose
mongoose.connect(process.env.database).catch((err)=>{
	console.error(chalk.red(err));
})
// view engine setup
app.set('view engine', 'ejs');

//get which API was called
if(process.env.mode === 'development'){
	app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//routes
const apiRouter = require('./routes/apiRouter');
const website = require('./routes/websiteRouter');

app.use('/api', apiRouter);
app.use('/', website);

// catch 404
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  return res.status(404).send({message:"Wrong URL"});
});


app.listen(process.env.port, "0.0.0.0",(err)=>{
  if(err){
    return console.error(chalk.red(err));
  }
  console.log(chalk.green('Running in ' + process.env.mode + ' mode.'));  
  console.log(chalk.green("Working!! Server Running on " + process.env.baseURL + " and port " + process.env.port+'.'));
});

module.exports = app;