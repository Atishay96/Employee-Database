const express = require('express');
const app = express.Router();
const EmployeeController = require('../controllers/EmployeeController');

//upload excel file validations added
app.post('/uploadExcelFile', (req, res)=>{
	EmployeeController.readExcelFile(req, res);
});

// get all records of employees from database
app.get('/getAllRecords', (req, res)=>{
	EmployeeController.getAllRecords(req, res);
});

//add entry directly to the database
app.post('/addEntry', (req, res)=>{
	EmployeeController.addEntry(req, res);
});

//update existing entry in the database
app.put('/updateEntry',(req, res)=>{
	EmployeeController.addEntry(req, res);
})

app.post('/deleteEntry',(req,res)=>{
	EmployeeController.deleteEntry(req, res);
})
//for toggling important information
app.put('/toggleMark',(req,res)=>{
	EmployeeController.toggleMark(req, res);
})

module.exports = app;