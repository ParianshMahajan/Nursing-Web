const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const nurseSchema = new Schema({
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
        // validate: () => {                                                               
        //     //Confirming Password....
        //     return this.ConfirmPassword==this.Password;
        // }
    },
    AboutMe:{
        type: String
    },
    Email:{
        type:String,
        unique:true,
        required: true,
        validate:function(){
            //write this email validation code
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
        type:JSON
    },
    Links:{
        type:JSON
        // Contains links or certificates or achievements
    },
    Price:{
        type:Number,
    },
    Requests:[{
        type:Schema.Types.ObjectId,
        ref:"Requests"
    }],
    CurrentApplication:{
        type:Schema.Types.ObjectId,
        ref:"nurseApps"
    },
    IsAvailable:{
        type:Boolean,
    },
    PreviousRecords:[{
        type:Schema.Types.ObjectId,
        ref:"nurseApps"
    }],
    CurrentLocation:{
        type:JSON,
    },
    //address +++
    Address:{
        type:String, 
    },
    City:{
        type:String,
    },
    Coords:{
        type:JSON
    },
   //address +++
    Rating:{
        type:Number,
        default:0
        // [1-5]
        // Avergae of all the Records
    },
    Ban:{
        type:Boolean,
        default:false,
    }
});

nurseSchema.pre('save',function(){
    this.ConfirmPassword=undefined;
});

nurseSchema.index({
    Name: "text",
    AboutMe: "text",
    Skills: "text"
});


module.exports = mongoose.model("nurse", nurseSchema);