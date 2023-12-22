const axios = require('axios');

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwt=require('jsonwebtoken');
const secret_key=process.env.secret_key;

const { default: getImgurLink } = require('../middlewares/ImgurAPI');
const NurseModel = require('../models/NurseModel');
const UserModel = require('../models/UserModel');




module.exports.createNurse= async function createNurse(req,res){
    try {
        let data=req.body; 

        const link = await getImgurLink(data.ImgUrl);
        data.ImgUrl=link;
        let nurse=await NurseModel.create(data);
        
        const uuid=nurse._id;
        const token=jwt.sign({nurse:uuid},secret_key);

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






// Fetch Requests
module.exports.Requests= async function Requests(req,res){
    try {
        let nurse=res.nurse;

        // let request={
        //     UserId:user._id,
        //     Reason:data.Reason,
        //     Requirements:data.Requirements,
        // }                

        let requests=[];

        for(let i in nurse.Requests){
            let request=nurse.Requests[i];
            let user=await UserModel.findById(request.UserId);
            request={...request,
                    ImgUrl:user.ImgUrl,
                    Name:user.Name,
                    Email:user.Email,
                    PhoneNumber:user.PhoneNumber ,
                    Address:user.Address,
            };
            requests.push(request);
        }


        res.json({
            status:true,
            Requests:requests,
        });
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}






// Accept Requests
module.exports.Requests= async function Requests(req,res){
    try {
        let nurse=res.nurse;

        // let request={
        //     UserId:user._id,
        //     Reason:data.Reason,
        //     Requirements:data.Requirements,
        // }                

        let requests=[];

        for(let i in nurse.Requests){
            let request=nurse.Requests[i];
            let user=await UserModel.findById(request.UserId);
            request={...request,
                    ImgUrl:user.ImgUrl,
                    Name:user.Name,
                    Email:user.Email,
                    PhoneNumber:user.PhoneNumber ,
                    Address:user.Address,
            };
            requests.push(request);
        }


        res.json({
            status:true,
            Requests:requests,
        });
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}






