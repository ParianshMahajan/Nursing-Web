const { mongoose } = require("mongoose");


const Schema = mongoose.Schema;
const nurses = new Schema({
    ImgUrl: {
        type: String,
    },
    Name: {
        type: String,
        required: true,
    },
    Password:{
        type:String,
        required:true,
        // minLength:6,
    },
    ConfirmPassword:{
        type:String,
        required:true,
        // minLength:8,
        validate: () => {                                                               
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
        required: true,
        validate:function(){
            return validator.validate(this.Email);
        }
    },
    PhoneNumber: {
        type: Number,
        required: true,
    },
    Skilled:{
        type:Number,
        required: true,
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
        // type:Location,
    },

    Address:{
        type:String, 
    },
    City:{
        type:String, 
    },
    State:{
        type:String, 
    },

    Ratings:{
        type:Number,
        // [1-5]
        // Avergae of all the Records
    },
});


module.exports = mongoose.model("nurses", nurses);