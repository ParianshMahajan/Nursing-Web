const axios = require('axios');

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwt=require('jsonwebtoken');
const secret_key=process.env.secret_key;

const { default: getImgurLink } = require('../middlewares/ImgurAPI');
const UserModel = require('../models/UserModel');
const NurseModel = require('../models/NurseModel');




module.exports.createUser= async function createUser(req,res){
try {
    let data=req.body; 

    const link = await getImgurLink(data.ImgUrl);
    data.ImgUrl=link;
    let user=await UserModel.create(data);
    
    
    const uuid=user._id;
    const token=jwt.sign({user:uuid},secret_key);

    res.json({
        status:true,
        token:token,
    });
    
} catch (error) {
    res.json({
        message:error.message,
        status:false
    })
}
    
}





// primary Filter ::- On the basis of City
module.exports.sendNurses= async function sendNurses(req,res){
    try {
        let data=req.body;
        let city=data.city;
        let nurses= await NurseModel.find({City:city})

        res.json({
            status:true,
            Nurses:nurses
        }); 
    } catch (error) {
        res.json({
            status:false,
            message:error.message
        })
    }
}   





// Send Request to a nurse
module.exports.sendRequest= async function sendRequest(req,res){
    try{
        let data=req.body;
        let user=res.user;
        let request={
            UserId:user._id,
            Reason:data.Reason,
            Requirements:data.Requirements,
            Location:data.Location
        }                
        let nurse=await NurseModel.findById(data.nurseId);
        nurse.Requests.push(request);
        res.jsom({
            message:"Request Sent",
            status:true
        })
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}





