var app = angular.module('app',['ngFileUpload']);
// local
var __appurl = "http://localhost:5000/";

checkError = function(error, status){
    if(error.message){
        alert(error.message)
    }
}