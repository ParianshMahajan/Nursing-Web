const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const secret_key=process.env.secret_key;

const jwt=require('jsonwebtoken');
const NurseModel = require("../models/NurseModel");

module.exports.isNurse= async function isNurse(req,res,next){
    try {
        let data=req.body; 

        const ip =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

        if(data.token){
            
            let auth= await authModel.findOne({SessionID:data.token,IPV4:ip});
            
            if(auth){

                let payload=jwt.verify(data.token,secret_key);               
                
                if(payload){
                    if(payload.Role=="Nurse"){
                        let nurse= await NurseModel.findById(payload.uuid);
                        if(nurse.Ban==false){
                            res.nurse=nurse;
                            next();
                        }
                        else{
                            res.json({
                                status:false,
                                message:"Blocked by the Admin."
                            });
                        }              
                    }
                    else{
                        res.json({
                            status:false,
                            message:"No rights"
                        });
                    }
                }
                else{
                    res.json({
                        status:false,
                    });
                }
            }
            else{
                res.json({
                    status:false,
                });
            }
        }
        else{
            res.json({
                status:false,
            });
        }

        
    }catch (error) {
        res.status(500).json({
            message:error.message,
            status:false
        })
    }
}

