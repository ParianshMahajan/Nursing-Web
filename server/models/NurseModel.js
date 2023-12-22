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
        type:JSON
    }],
    PreviousRecords:[{
        type:Schema.Types.ObjectId,
        ref:"nurseApps"
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
<<<<<<< HEAD:Actual Server/models/NurseModel.js
=======
    State:{
        type:String, 
    },

>>>>>>> c196fca1c6683f19c3065d91745728248a18ea36:server/models/nurses.js
    Ratings:{
        type:Number,
        // [1-5]
        // Avergae of all the Records
    },
    Ban:{
        type:Boolean,
        default:false,
    }
});


module.exports = mongoose.model("nurse", nurseSchema);