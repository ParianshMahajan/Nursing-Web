const mongoose  = require("mongoose");
var validator = require("email-validator");
require('dotenv').config();


const Schema = mongoose.Schema;
const usersSchema = new Schema({
    ImgUrl: {
        type: String,
    },
    Name: {
        type: String
    },
    Password:{
        type:String,
        required:true,
        minLength:8,
    },
    ConfirmPassword:{
        type:String,
        required:true,
        minLength:8,
        validate:function(){                                                               
            //Confirming Password....
            return this.ConfirmPassword==this.Password;
        }
    },
    Email:{
        type:String,
        unique:true,
        validate:function(){
            return validator.validate(this.Email);
        }
    },
    PhoneNumber: {
        type: Number    
    },
    PreviousRecords:[{
        type:Schema.Types.ObjectId,
        ref:"userApps"
    }],
    RequestSent:[{
        type:JSON
    }],
    CurrentLocation:{
        // type:Location,
    },
    Address:{
        type:String, 
    },
    Report:{
        type:String,
        // Report on any kind of misbhave of user with nurse
    },
    Ban:{
        type:Boolean,
        default:false,
    }
});

    
usersSchema.pre('save',function(){
    this.ConfirmPassword=undefined;
});







module.exports = mongoose.model("user", usersSchema);