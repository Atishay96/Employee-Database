require('dotenv').config();
const mongoose = require('mongoose');
const multer = require('multer');
const util = require('util');
const XLSX = require('xlsx');
const __ = require('./Response');
const employeeModel = require('../models/employeeData');
const _ = require('lodash');
class Employee{
	constructor(){
		//multer initialization
		const ExcelFileStorage = multer.diskStorage({
		  destination: function (req, file, cb) {
		    cb(null, './public/documents')
		  },
		  filename: function (req, file, cb) {
		  	let datetimestamp = Date.now();
			cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
		  }
		})
		this.uploadexcel = multer({ storage: ExcelFileStorage }).single('excel');
	}
	async readExcelFile(req, res){
		try{
			//upload file
			const upload = util.promisify(this.uploadexcel);
			await upload(req, res);
			// console.log(req.file)
			//empty request validation
			if(!req.file){
				return __.badValues(res);
			}
			let workbook = await XLSX.readFile('./'+req.file.path);
			// console.log(workbook.Sheets);
			if(!workbook || !workbook.Sheets){
				return __.notAuthorized(res, "Please upload excel files only");
			}
			if(!workbook.Sheets.Sheet1){
				return __.notAuthorized(res, "Please do the changes in 'Sheet1' itself");
			}
			if(!workbook.Sheets.Sheet1['!ref']){
				return __.notAuthorized(res, "Please don't upload an empty Excel");
			}			
			//checking whether the headings are present or not
			if(  
				   !workbook.Sheets.Sheet1['A1'] || workbook.Sheets.Sheet1['A1'].v != 'Emp Code' 
				|| !workbook.Sheets.Sheet1['B1'] || workbook.Sheets.Sheet1['B1'].v != 'Emp Name' 
				|| !workbook.Sheets.Sheet1['C1'] || workbook.Sheets.Sheet1['C1'].v != 'Emp email' 
				|| !workbook.Sheets.Sheet1['D1'] || workbook.Sheets.Sheet1['D1'].v != 'Emp phoneNumber' 
			){
				return __.notAuthorized(res, "Please do the changes in the given template only. Don't change the header or the sheet name. Only the name below the headers will be taken in account.");
			}
			let ref = workbook.Sheets.Sheet1['!ref'].split(':');
			if(ref.length < 2){
				return __.notAuthorized(res, "Please do the changes in the given template only. Don't change the header or the sheet name. Only the name below the headers will be taken in account.");
			}
			//for getting the lastAlphabet and lastNumber
			let temp = ref[1].split('');
			let lastAlphabet = temp[0];
			let lastNumber = parseInt(temp[1]);
			if(lastNumber < 2){
				return res.send({message:"Please upload some data entries"})
			}
			// console.log(lastNumber);
			// console.log(lastAlphabet);
			let sheet1 = workbook.Sheets.Sheet1;
			let insert = [];
			let cids = [];
			let i;
			//taking entries which are valid
			for(i=2;i<=lastNumber;i++){
				if(
					sheet1['A'+i] && sheet1['A'+i].v
					&& sheet1['B'+i] && sheet1['B'+i].v
					&& sheet1['C'+i] && sheet1['C'+i].v
					&& sheet1['D'+i] && sheet1['D'+i].v
				){
					console.log(sheet1['A'+i])
					sheet1['A'+i].v = sheet1['A'+i].v.toString();
					sheet1['A'+i].v = sheet1['A'+i].v.toUpperCase();
					let obj = {empCode:sheet1['A'+i].v, name:sheet1['B'+i].v, email:sheet1['C'+i].v.toLowerCase(), phoneNumber:sheet1['D'+i].v}
					insert.push(obj);
					cids.push(sheet1['C'+i].v.toLowerCase());
				}
			}
			//checking if emp code already exists in the db if yes then avoiding that employee code
			let dataset = await employeeModel.find({email:{$in:cids}}).select('email').lean().exec();
			_.map(dataset).map((v,i)=>{
				let index = cids.indexOf(v.email)
				if(index != -1){
					insert.splice(index, 1);
					cids.splice(index, 1);
				}
			})
			await employeeModel.create(insert);
			return __.message(res, 200, "Unique entries successfully added.");
		}
		catch(err){
			return __.errorInternal(res, err)
		}
	}
	async getAllRecords(req,res){
		try{
			let employees = await employeeModel.find({}).lean();
			return __.success(res, employees, "List Displayed");
		}catch(err){
			return __.errorInternal(res, err);
		}
	}
	async addEntry(req,res){
		try{
			//empty request validation
			if(!req.body.email || !req.body.name || !req.body.empCode || !req.body.phoneNumber ){
				return __.badValues(res);
			}
			//checking if emp code exists in the db
			let check = await employeeModel.findOne({empCode:req.body.empCode}).select('empCode').lean();			
			//updating
			if(req.body._id){
				let user = await employeeModel.findOne({_id:req.body._id});
				if(check && check.empCode != user.empCode){
					return __.notAuthorized(res, "Employee Code already exists");
				}
				if(!user){
					return __.notFound(res);
				}
				user.email = req.body.email.toLowerCase();
				user.name = req.body.name;
				user.phoneNumber = req.body.phoneNumber;
				user.empCode = req.body.empCode.toUpperCase();
				user.mark = req.body.mark;
				await user.save();
				return __.success(res, user, "Employee data successfully updated");
			}else{ //inserting
				if(check){
					return __.notAuthorized(res, "Same empCode exists");
				}
				req.body.empCode = req.body.empCode.toUpperCase();
				let userTemp = new employeeModel(req.body);
				await userTemp.save();
				return __.message(res, 200, "Employee successfully added");				
			}
		}catch(err){
			return __.errorInternal(res, err);
		}
	}
	//to mark and unmark profiles
	async toggleMark(req,res){
		try{
			if(!req.body._id || req.body.mark == undefined ){
				return __.badValues(res);
			}
			let employee = await employeeModel.findOne({_id:req.body._id});
			if(!employee){
				return __.notFound(res);
			}
			employee.mark = req.body.mark;
			await employee.save();
			return __.success(res, employee, "Employee data successfully updated");
		}catch(err){
			return __.errorInternal(res, err);
		}
	}
	async deleteEntry(req,res){
		try{
			if(!req.body._id){
				return __.badValues(res);
			}
			await employeeModel.findOne({_id:req.body._id}).remove().exec();
			let employees = await employeeModel.find({}).lean();
			return __.success(res, employees, 'successfully removed');
		}catch(err){
			return __.errorInternal(res, err);
		}
	}
}

Employee = new Employee();
module.exports = Employee;