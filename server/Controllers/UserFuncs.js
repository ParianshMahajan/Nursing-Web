const axios = require('axios');

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwt=require('jsonwebtoken');
const secret_key=process.env.secret_key;

const { default: getImgurLink } = require('../middlewares/ImgurAPI');
const UserModel = require('../models/UserModel');
const NurseModel = require('../models/NurseModel');




// SIGNUP

module.exports.createUser= async function createUser(req,res){
    try {
        let data=req.body; 

        const link = await getImgurLink(data.ImgUrl);
        data.ImgUrl=link;
        let user=await UserModel.create(data);
        
        const ip =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

        const payload={
          uuid:user._id,
          Role:'User',
          IPV4:ip,
        }

        const token=jwt.sign(payload,secret_key);

        let auth= await authModel.create({UserID:user._id,Role:"User",SessionID:token,IPV4:ip});

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
module.exports.UserLogin= async function UserLogin(req,res){
    try {
        let data=req.body;
        let user=await UserModel.findOne(data.Email);

        
        if(user){
            if(data.Password===user.Password){
                
                let otp = parseInt(crypto.randomBytes(3).toString("hex"),16).toString().substring(0, 6);
                
                let auth=await authModel.findOne({UserID:user._id});
                
                if(auth){
                    auth.OTP=otp;
                    await auth.save();
                }
                else{
                    let auth= await authModel.create({UserID:user._id,Role:"User",OTP:otp});
                }

                //Mailing The OTP to the registered mail
                sendMail(user.Email,otp);

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
module.exports.UserLoginPart2= async function UserLoginPart2(req,res){
    try {
        let data=req.body;
        let user=await UserModel.findOne(data.Email);
        
        if(user){
            if(data.Password===user.Password){
                
                let auth=await authModel.findOne({UserID:user._id});
                
                if(auth.OTP===data.OTP){

                    const ip =
                    req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;
                    
                    const payload={
                        uuid:user._id,
                        Role:"User",
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





