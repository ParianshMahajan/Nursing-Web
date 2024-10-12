const mongoose  = require("mongoose");


const Schema = mongoose.Schema;
const loginAccountSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now()
    },
    UserID:{
        type: Schema.Types.ObjectId,
    },
    SessionID: {
        type: String
    },
    Role: {
        type: String
    },
    IPV4: {
        type: String
    },
    OTP: {
        type: String
    },
});


module.exports = mongoose.model("Authentication", loginAccountSchema);