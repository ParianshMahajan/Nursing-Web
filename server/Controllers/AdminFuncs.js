const axios = require('axios');

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwt=require('jsonwebtoken');
const secret_key=process.env.secret_key;

const { default: getImgurLink } = require('../middlewares/ImgurAPI');
const UserModel = require('../models/UserModel');
const NurseModel = require('../models/NurseModel');
const RequestModel = require('../models/RequestModel');
const NurseAppsModel = require('../models/NurseAppsModel');
const UserAppsModel = require('../models/UserAppsModel');




// LOGIN
module.exports.createJWT = async function createJWT(req, res) {
    try {
      let data = req.body;
      if(data.Password==adminPassword){
          const uuid = data.Password;
          const token = jwt.sign({ payload: uuid }, secret_key);
      
          res.json({
            status: true,
            token: token,
          });
      }
      else{
          res.json({
              status: false,
              message: "Incorrect Password",
            });
      }
  
    } catch (error) {
      res.json({
        message: error.message,
        status: false,
      });
    }
  };
  
  


// Pay Nurse
module.exports.PayNurse= async function PayNurse(req,res){
    try {
        let data=req.body;
        // Containing the request ID

        let payment=false;
        
        let nurse=await NurseModel.findById(data.nurseID);

        // Calculating amount to be paid
        let amount=request.Amount;
        


        
        //
        
        // <--------Payment Code------->
        
        // 
        if(payment){

            let nurseApp=await NurseAppsModel.findById(nurse.CurrentApplication);
            nurseApp.IsPaid=true;
            nurseApp.AmountPaid=amount;
            nurseApp.save();

            nurse.PreviousRecords.push(nurseApp._id);
            nurse.IsAvailable=true;
            await nurse.save();


            res.json({
                status:true,
                Requests:requests,
            });
        }
        else{
            nurse.IsAvailable=true;
            await nurse.save();
            res.json({
                status:false,
            });
        }

        
        
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}






// Ban
module.exports.Ban = async function Ban(req, res) {
    try {
        let data=req.body;
        let nurse=await NurseModel.findById(data.clientId);
        if(nurse){
            nurse.Ban=true;
            await nurse.save();
        }
        else{
            let user=await UserModel.findById(data.clientId);
            user.Ban=true;
            await user.save();
        }
        
        res.json({
          status: true,
          message: "Client Blocked",
        });
  
    } catch (error) {
      res.json({
        message: error.message,
        status: false,
      });
    }
  };
  
  
