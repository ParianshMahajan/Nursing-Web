const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const RequestSchema = new Schema({
    RecieverId: {
        type: Schema.Types.ObjectId,
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
        type:JSON,
    },
    City:{
        type:String,
    },
    Status:{
        type:Number,
        default:0,
        // 0 ---> Request Sent
        // 1 ---> Request Accepted
        // 2 ---> Request Declined
        // 3 ---> Request Negotiated
    },
    Amount:{
        type:Number,
    },
    Duration:{
        type:Number,
        // no. of Days
    },
});


module.exports = mongoose.model("Requests", RequestSchema);