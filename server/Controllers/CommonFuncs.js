const axios = require('axios');

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const UserModel = require('../models/UserModel');
const RequestModel = require('../models/RequestModel');





// Decline Requests
module.exports.declineRequest= async function declineRequest(req,res){
    try {
        let data=req.body;
        let request =await RequestModel.findById(data.requestID);

        request.Status=2;
        await request.save();


        res.json({
            status:true,
            message:'Request Declined'
        });
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}





// Negotiate Requests
module.exports.negotiateRequest= async function negotiateRequest(req,res){
    try {
        let data=req.body;
        let request =await RequestModel.findById(data.requestID);

        request.Status=3;
        request.Amount=data.Amount,
        request.Duration=data.Duration,
        await request.save();


        res.json({
            status:true,
            message:'Request Accepted'
        });
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}




// Accept Requests
module.exports.acceptRequest= async function acceptRequest(req,res){
    try {
        let data=req.body;
        let request =await RequestModel.findById(data.requestID);

        request.Status=true;
        await request.save();


        res.json({
            status:true,
            message:'Request Accepted'
        });
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}





module.exports.ReportUser= async function ReportUser(req,res){
    try {
        let data=req.body;
        let user =await UserModel.findById(data.userID);

        user.Report=data.Report;
        await user.save();

        res.json({
            status:true,
            message:'Report Submitted'
        });
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}

