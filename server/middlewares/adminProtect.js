const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const secret_key=process.env.secret_key;
const adminPassword=process.env.adminPassword;

const jwt=require('jsonwebtoken');

module.exports.isAdmin= async function isAdmin(req,res,next){
    try {
        let data=req.body; 
        if(data.token){
            let payload=jwt.verify(data.token,secret_key);               
  
            if(payload){
                if(payload.payload==adminPassword){
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

