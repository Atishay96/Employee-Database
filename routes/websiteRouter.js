const express = require('express');
const app = express.Router();
const WebsiteRenderPage = require('../controllers/renderPage');

//index page (ALl records)
app.get('/',(req,res)=>{
	WebsiteRenderPage.index(req, res);
})

//upload excel file
app.get('/upload',(req,res)=>{
	WebsiteRenderPage.uploadExcelFile(req, res);
})

//add entry manually
app.get('/addEntry',(req,res)=>{
	WebsiteRenderPage.addEntry(req, res);
})
module.exports = app;