const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const secret_key=process.env.secret_key;

const jwt=require('jsonwebtoken');
const users = require('../models/UserModel');

module.exports.verify= async function verify(req,res,next){
    try {
        let data=req.body; 
        if(data.token){
            let payload=jwt.verify(data.token,secret_key);               
  
            if(payload){
                let user= await users.findById(payload.payload);              
                res.user=user;
                next();
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

