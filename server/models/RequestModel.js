const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const RequestSchema = new Schema({
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        default: [],
    }],

    NurseId: {
        type: Schema.Types.ObjectId,
        ref: "nurse"
    },
    ApartmentId: {
        type: Schema.Types.ObjectId,
        ref: "apartment"
    },
    UserId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    RequestType: {
        type: String,
        enum: ['nurse', 'apartment'],
        required: true
    },
    Reason: {
        type: String,
    },
    Requirements: [{
        type: String
    }],
    Location: {
        type: String,
    },
    Address: {
        type: String,
    },
    Status: {
        type: Number,
        default: 0,
        // 0 ---> Request Sent
        // 1 ---> Request Accepted -- allowed to chat
        // 2 ---> Request Declined
    },
    AllowedPay: {
        type: Boolean,
        default: false,
    },
    Amount: {
        type: Number,
    },
    Duration: {
        type: Number,
        // no. of Days
    },
    CheckInDate: {
        type: Date
    },
    CheckOutDate: {
        type: Date
    }
});

module.exports = mongoose.model("Requests", RequestSchema);