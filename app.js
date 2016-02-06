/**
 * Created by SMD on 1/29/2016.
 */
var express = require('express');
var server= require('http');
var path= require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app= express();

var staticDIR = path.resolve(__dirname, "./www");
app.use(express.static(staticDIR));
app.use(bodyParser.json());
app.get("*", function (req, res) {
    var indexViewPath = path.resolve(__dirname, "./www/index.html");
    res.sendFile(indexViewPath);
});
var dbURI = 'mongodb://localhost:27017/mydatabase';
mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

var userSchema = new mongoose.Schema({
    name: String,
    password:String,
    email: {type: String, unique:true},
    createdOn: { type: Date, default: Date.now }
    //modifiedOn: Date,
    //lastLogin: Date
});

mongoose.model( 'User', userSchema );
var User = mongoose.model('User');





var CompanySchema = new mongoose.Schema({
    CompanyName: String,
    password:String,
    email: {type: String, unique:true},
    createdOn: { type: Date, default: Date.now }
    //modifiedOn: Date,
    //lastLogin: Date
});
mongoose.model( 'company', userSchema );
var company = mongoose.model('company');





User.find({}, function(err, users) {
    if(!err){
        console.log(users);
    }
});

company.find({}, function(err, users) {
    if(!err){
        console.log(users);
    }
});

app.get('/account', function (req, res) {
    console.log('I received a GET request');
    company.find({}, function(err, users) {
        if(!err){
            console.log(users);
        }
        else{
            res.render('/details',{users:docs})
        }
    });

});


app.post('/account', function(req, res){
    new company({
        CompanyName:req.body.Company,
        email:req.body.email,
        password:req.body.password
    }).save(function(err,doc){
            if(err)res.json(err);
            else res.send("succesfully inserted");
            console.log(res);

        });
});



app.listen(9000);
console.log("Server Running on port 3000");
