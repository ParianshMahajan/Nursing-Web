const axios = require('axios');

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwt=require('jsonwebtoken');
const secret_key=process.env.secret_key;

const { default: getImgurLink } = require('../middlewares/ImgurAPI');
const NurseModel = require('../models/NurseModel');
const UserModel = require('../models/UserModel');
const authModel = require('../models/authModel');
const { sendMail } = require('../middlewares/nodeMailer');
const RequestModel = require('../models/RequestModel');



// SIGNUP

module.exports.createNurse= async function createNurse(req,res){
    try {
        let data=req.body; 

        const link = await getImgurLink(data.ImgUrl);
        data.ImgUrl=link;
        let nurse=await NurseModel.create(data);
        
        const ip =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

        const payload={
          uuid:nurse._id,
          Role:'Nurse',
          IPV4:ip,
        }

        const token=jwt.sign(payload,secret_key);

        let auth= await authModel.create({UserID:nurse._id,Role:"Nurse",SessionID:token,IPV4:ip});

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




// LOGIN
// OTP generation and mail
module.exports.NurseLogin= async function NurseLogin(req,res){
    try {
        let data=req.body;
        let nurse=await NurseModel.findOne(data.Email);

        
        if(nurse){
            if(data.Password===nurse.Password){
                
                let otp = parseInt(crypto.randomBytes(3).toString("hex"),16).toString().substring(0, 6);
                
                let auth=await authModel.findOne({UserID:nurse._id});
                
                if(auth){
                    auth.OTP=otp;
                    await auth.save();
                }
                else{
                    let auth= await authModel.create({UserID:user._id,Role:"Nurse",OTP:otp});
                }

                //Mailing The OTP to the registered mail
                sendMail(nurse.Email,otp);

                res.json({
                    status:true,
                    message:"OTP has been sent"
                });   
            }
            else{
                res.json({
                    status:false,
                    message:"Incorrect password"
                });
            }
        }
        else{
            res.json({
                status:false,
                message:"User does not exits"
            });
        }
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
}



//   OTP and JWT generation
module.exports.NurseLoginPart2= async function NurseLoginPart2(req,res){
    try {
        let data=req.body;
        let nurse=await NurseModel.findOne(data.Email);
        
        if(nurse){
            if(data.Password===nurse.Password){
                
                let auth=await authModel.findOne({UserID:nurse._id});
                
                if(auth.OTP===data.OTP){

                    const ip =
                    req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;
                    
                    const payload={
                        uuid:nurse._id,
                        Role:"Nurse",
                        IPV4:ip,
                    }
                    const token=jwt.sign(payload,secret_key);
                    
                    auth.SessionID=token;
                    auth.timestamp=Date.now();
                    auth.IPV4=ip;
                    auth.OTP=undefined;
                    await auth.save();
                    
                    res.json({ 
                        status:true,
                        token:token,
                    });   
                }
                else{
                    res.json({
                        status:false,
                        message:"Incorrect OTP",
                    });
                }
            }
            else{
                res.json({
                    status:false,
                    message:"Incorrect password"
                });
            }
        }
        else{
            res.json({
                status:false,
                message:"User does not exits"
            });
        }
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
  }   
  






// Fetch Requests
module.exports.Requests= async function Requests(req,res){
    try {
        let nurse=res.nurse;

        
        let requests=[];

        for(let i in nurse.Requests){
            let requestId=nurse.Requests[i];
            let request=await RequestModel.findById(requestId);

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













