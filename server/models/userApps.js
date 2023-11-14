const { mongoose } = require("mongoose");


const Schema = mongoose.Schema;
const userApps = new Schema({
    UserId: {
        type:Schema.ObjectId,
    },
    Reason:{
        type: String
        // For what (not the skills) but for record purpose
    },
    Report:{
        type:String,
        // Report on any kind of misbhave of user with nurse
    },
    Amount:{
        type:Number,
    },
    IsPaid:{
        type:Number,
        // 1--> for the Installment
        // 2--> for all paid (Initially) No Installments
        // 3--> for all paid (Finally) after Installments
    },
    AmountPaid:{
        type:Number,
    },
    NurseApp:{
        type:Schema.ObjectId,
        // Application of Nurse they hired  
    },
});


module.exports = mongoose.model("userApps", userApps);