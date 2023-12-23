const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const RequestSchema = new Schema({
    NurseId: {
        type: Schema.Types.ObjectId,
        ref: "nurse"      
    },
    UserId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    Reason:{
        type:String,
    },
    Requirements:{
        type:JSON
    },
    Location:{
        type:Location,
    },
    Status:{
        type:Boolean,
        default:false
    },
});


module.exports = mongoose.model("Requests", RequestSchema);