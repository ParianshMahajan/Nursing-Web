const mongoose  = require("mongoose");


const Schema = mongoose.Schema;
const UserAppsSchema = new Schema({
    UserId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    Reason:{
        type: String
        // For what (not the skills) but for record purpose
    },
    Requirements:{
        type: JSON
    },
    Report:{
        type:String,
        // Report on any kind of misbhave of user with nurse
    },

    Location:{

    },
    Address:{

    },
    City:{

    },

    Amount:{
        type:Number,
    },
    ApplicationStatus:{
        type:Number,
        // 0--> for the Request
        // 1--> Request Accepted
        // 2--> Initial/Complete Amount Paid   ||  Session Initiated
        // 3--> Term Completed
        // 4--> Paid Successfully
    },
    AmountPaid:{
        type:Number,
    },
    NurseApp:{
        type: Schema.Types.ObjectId,
        ref: "nurseApps"
        // Application of Nurse they hired  
    },
});


module.exports = mongoose.model("userApps", UserAppsSchema);






