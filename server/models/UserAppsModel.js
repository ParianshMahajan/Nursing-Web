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
        type:JSON,
    },
    Address:{
        type:String
    },
    City:{
        type:String
    },

    Amount:{
        type:Number,
    },
    ApplicationStatus:{
        type:Number,
        // 0--> Initial/Complete Amount Paid   ||  Session Initiated
        // 1--> Term Completed
        // 2--> Paid Successfully
    },
    AmountPaid:{
        type:Number,
    },
    NurseApp:{
        type: Schema.Types.ObjectId,
        ref: "nurseApps"
        // Application of Nurse they hired  
    },
    homeApp:{
        type: Schema.Types.ObjectId,
        // ref: "nurseApps"
        // Application of Home they rented  
    },
});


module.exports = mongoose.model("userApps", UserAppsSchema);






