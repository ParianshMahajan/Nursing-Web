const { mongoose } = require("mongoose");


const Schema = mongoose.Schema;
const nurses = new Schema({
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
    AboutMe:{
        type: String
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
    Skilled:{
        type:Number,
        // 1--->Skilled;
        // 2--->Semi-Skilled;
        // 3--->UnSkilled;
    },
    Skills:{
        type:Array
    },
    Links:{
        type:JSON
        // Contains links or certificates or achievements
    },
    Price:{
        type:Number,
    },
    PreviousRecords:[{
        type:Schema.ObjectId,
    }],
    CurrentLocation:{
        type:Location,
    },
    Address:{
        type:String, 
    },
    Ratings:{
        type:Number,
        // [1-5]
        // Avergae of all the Records
    },
});


module.exports = mongoose.model("nurses", nurses);