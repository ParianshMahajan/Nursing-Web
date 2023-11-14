const { mongoose } = require("mongoose");


const Schema = mongoose.Schema;
const nurseApps = new Schema({
    NurseId: {
        type:Schema.ObjectId,
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
    Review:{
        type:JSON, 
        // [string Review, Hospitality Rating, Work Rating......]
    },
    Duration:{
        type:Location,
    },
    UserApp:{
        type:Schema.ObjectId,
        // Where the nurse worked for a particular User's application 
    },
});


module.exports = mongoose.model("nurseApps", nurseApps);