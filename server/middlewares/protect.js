const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const secret_key=process.env.secret_key;

const jwt=require('jsonwebtoken');
const UserModel = require("../models/UserModel");
const NurseModel = require("../models/NurseModel");

module.exports.protect= async function protect(req,res,next){
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
          return res.status(401).json({
            status: false,
            message: 'Authorization header missing or invalid format'
          });
        }
      
        const token = authHeader.split(' ')[1];

        const ip =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

        if(token){
            
            let auth= await authModel.findOne({SessionID:token,IPV4:ip});
            
            if(auth){
                let payload=jwt.verify(token,secret_key);               
                if(payload){
                    if(payload.Role=="User"){
                        let user= await UserModel.findById(payload.uuid);      
                        if(!user){
                            throw new Error("Invalid token");
                        }
                        if(user.Ban==false){
                            res.user=user;
                            next();
                        }
                        else{
                            throw new Error("Blocked By admin");
                        }
                    }

                    else if(payload.Role=="Nurse"){
                        let nurse= await NurseModel.findById(payload.uuid);
                        if(!nurse){
                            throw new Error("Invalid token");
                        }
                        if(nurse.Ban==false){
                            res.nurse=nurse;
                            next();
                        }
                        else{
                            throw new Error("Blocked By admin");
                        }              
                    }

                    else{
                        throw new Error("Unauthorised");
                    }
                }
                else{
                    throw new Error("Invalid token");
                }
            }
            else{
                throw new Error("Session Expired");
            }
        }
        else{
            throw new Error("No token provided");
        }

        
    }catch (error) {
        res.status(500).json({
            message:error.message,
            status:false
        })
    }
}

