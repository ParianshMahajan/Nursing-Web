const { mongoose } = require("mongoose");


const Schema = mongoose.Schema;
const application = new Schema({
    DateApplied: {
        type: Date,
        default: Date.now()
    },
    DateReviewed: {
        type: Date,
    },
    UserId:{
        type:Schema.ObjectId
    },
    Status: {
        type: Number,
        default:1
        // 1--> under process,

        // -1--> not shortlisted,
        // 2--> shortlisted for interview,

        // -2-->Rescheduled Interview,
        // 0-->Slot Selected,
        
        // 3--> Interview rejected
        // 4--> to be decided
        // 5--> Recruited
    },
    Links:[{
        type:String
    }],
    AboutMe: {
        type: String
    },
    TechStack: {
        type: String
    },
    NonTech: {
        type: String
    },
    Slots: {
        type: Array,
    },
    SelectedSlot:{
        type:String,
        default:"NULL",
    },
    SlotRequest: {
        type: String,
        default:"NULL",
    },
    WhyCCS: {
        type: String
    },
    Questions:[{
        type:String
    }],
    AllotedSlot:{
        type:String
    },
    Review:{
        type:String
    }
});


module.exports = mongoose.model("applications", application);