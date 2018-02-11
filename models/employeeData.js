const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EmployeeModel = mongoose.Schema({
    email:{
        type: String,
        default: ''
    },
    phoneNumber:{
        type: String,
        default: ''
    },
    name:{
        type: String,
        default: ''
    },
    empCode:{
        type: String,
        default: ''
    },
    //to distinguish the user from others
    mark:{
        type:Boolean,
        default:false
    }
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});


const employeeModel = mongoose.model('employeeTable', EmployeeModel, 'employeeTable');

module.exports = employeeModel;
