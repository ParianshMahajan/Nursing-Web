const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const nurseAppsSchema = new Schema({
    NurseId: {
        type: Schema.Types.ObjectId,
        ref: "nurse"
    },
    Skilled:{
        type:Number,
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
    Amount:{
        type:Number,
    },
    IsPaid:{
        type:Boolean,
    },
    AmountPaid:{
        type:Number,
        // In case of any deduction
    },
    Rating:{
        type:Number, 
    },
    Review:{
        type:JSON, 
        // [string Review, Hospitality Rating, Work Rating......]
    },
    Duration:{
        type:Number,
    },
    TermCompleted:{
        type:Boolean,
        default:false,
    },
    UserApp:{
        type: Schema.Types.ObjectId,
        ref: "userApps"
        // Where the nurse worked for a particular User's application 
    },
});


module.exports = mongoose.model("nurseApps", nurseAppsSchema);