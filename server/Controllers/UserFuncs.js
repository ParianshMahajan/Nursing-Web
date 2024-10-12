const axios = require('axios');

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwt=require('jsonwebtoken');
const secret_key=process.env.secret_key;
const cron = require('node-cron');







const { default: getImgurLink } = require('../middlewares/ImgurAPI');
const UserModel = require('../models/UserModel');
const NurseModel = require('../models/NurseModel');
const RequestModel = require('../models/RequestModel');
const NurseAppsModel = require('../models/NurseAppsModel');
const UserAppsModel = require('../models/UserAppsModel');




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
  




  
  
  
  
// Send Request to a nurse
module.exports.sendRequest= async function sendRequest(req,res){
    try{
        let data=req.body;
        let user=res.user;
        let requestData={
            UserId:user._id,
            NurseId:data.nurseId,
            Reason:data.Reason,
            Requirements:data.Requirements,
            Location:data.Location,
            City:data.City,
            Status:0,
            Duration:data.Duration,
            Amount:data.Amount,
        }
        let request=await RequestModel.create(requestData);
        user.RequestSent.push(request._id);
        let nurse=await NurseModel.findById(data.nurseId);
        nurse.Requests.push(request._id);
        res.json({
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



// Negotiate Request to a nurse
module.exports.negotiateRequest= async function negotiateRequest(req,res){
    try{
        let data=req.body;
        let user=res.user;
        let request=await RequestModel.findById(data.requestID);
        
        request.Status=3,
        request.Amount=data.Amount,
        request.Duration=data.Duration,
        
        await request.save();
        res.json({
            message:"Request Negotiatation Sent",
            status:true
        })
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}






// Fetch Requests
module.exports.AllRequests= async function AllRequests(req,res){
    try {
        let user=res.user;
        let requests=[];
        for(let i in user.Requests){
            let requestId=user.Requests[i];
            let request=await RequestModel.findById(requestId);

            let nurse=await NurseModel.findById(request.UserId);
            request={...request,
                    ImgUrl:nurse.ImgUrl,
                    Name:nurse.Name,
                    Email:nurse.Email,
                    PhoneNumber:nurse.PhoneNumber ,
                    Address:nurse.Address,
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


  


module.exports.initialPay= async function initialPay(req,res){
    try {
        let data=req.body;
        // Containing the request ID

        let payment=false;
        
        let user=res.user;
        let request=await RequestModel.findById(data.requestID);
        let nurse=await NurseModel.findById(data.nurseID);

        // Calculating amount to be paid
        let amount=request.Amount;


        nurse.IsAvailable=false;
        await nurse.save();

        //
        
        // <--------Payment Code------->
        
        // 
        
        if(payment){
            

            // Creating NurseApplication
            let nurseAppData={
                NurseID:nurse._id,
                Skilled:nurse.Skilled,
                Skills:nurse.Skills,
                Links:nurse.Links,
                Amount:request.Amount,
                IsPaid:false,
                AmountPaid:amount,
                Review:{},
                Duration:request.Duration,
                UserApp:'',
            }
            let nurseApp=await NurseAppsModel.create(nurseAppData)

            // creating UserApplication.
            let userAppData={
                UserId:user._id,
                Reason:request.Reason,
                Requirements:request.Requirements,
                Report:'',
                Location:request.Location,
                Address:user.Address,
                City:request.City,
                Amount:request.Amount,
                ApplicationStatus:0,
                AmountPaid:amount,
                NurseApp:nurseApp._id,
            }
            let userApp=await UserAppsModel.create(userAppData)

            nurseApp.UserApp=userApp._id;
            await nurseApp.save();



            let index1 = nurse.Requests.indexOf(request._id);
            nurse.Requests.splice(index1, 1);
            nurse.CurrentApplication=nurseApp._id;
            await nurse.save();

            let index2 = user.RequestSent.indexOf(request._id);
            user.RequestSent.splice(index2, 1);
            user.CurrentContracts.nurseContracts.push(userApp._id);
            await user.save();




            const cronExpression = `0 1 */${request.Duration} * *`;
            cron.schedule(cronExpression, async () => {

                userApp.ApplicationStatus = 1;
                await userApp.save();
                
                
                nurse.IsAvailable = true;
                nurse.CurrentApplication='';
                nurse.PreviousRecords.push(nurseApp._id);
                await nurse.save();

            }, {
              scheduled: true,
              timezone: "Asia/Kolkata"
            });

            
            // Deleting Request
            let request=await RequestModel.findById(data.requestID);
            await request.deleteOne();

            user.CurrentContracts.nurseContracts.push(userApp._id);
            await user.save();

            res.json({
                status:true,
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











// Final Pay

module.exports.finalPay= async function finalPay(req,res){
    try {
        let data=req.body;
        
        let payment=false;
        
        let user=res.user;

        // Calculating amount to be paid
        let amount=request.Amount;
        


        //
        
        // <--------Payment Code------->
        
        // 
        
        if(payment){
            let nurseApp=await NurseAppsModel.findById(data.nurseAppId);
            let userApp=await UserAppsModel.findById(nurseApp.UserApp);

            userApp.ApplicationStatus=2;
            userApp.AmountPaid=userApp.Amount;
            await userApp.save();

            // removing userApp from currentContracts
            let index=user.CurrentContracts.nurseContracts.indexOf(userApp._id);
            user.CurrentContracts.nurseContracts.splice(index,1);

            user.PreviousRecords.nurseContracts.push(userApp._id);
            await user.save();

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












// Radius Filter
module.exports.sendNurses= async function sendNurses(req,res){
    try {
        let data=req.body;
        let currLocation=data.currLocation; // A json object eg. currLocation.latitude
        let radius=data.radius;

        const nurses = await NurseModel.find({
          $expr: {
            $lte: [
              {
                $function: {
                  body: function (lat1, lon1, lat2, lon2) {
                    const R = 6371e3; // Earth's radius in meters
                    const dLat = deg2rad(lat2 - lat1);
                    const dLon = deg2rad(lon2 - lon1);
                    const a =
                      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(deg2rad(lat1)) *
                        Math.cos(deg2rad(lat2)) *
                        Math.sin(dLon / 2) *
                        Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const distance = R * c; // Distance in meters
                    return distance/1000;
                  },
                  args: ["$location.latitude", "$location.longitude", currLocation.latitude, currLocation.longitude],
                  lang: "js",
                },
              },
              radius,
            ],
          },
        });
        
        function deg2rad(deg) {
          return deg * (Math.PI / 180);
        }


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







  
  


module.exports.Ratings= async function Ratings(req,res){
    try {
        let data=req.body;
        let nurseApp=await NurseAppsModel.findById(data.nurseAppId);

        nurseApp.Rating=data.Rating;
        nurseApp.Review=data.Review;

        await nurseApp.save();

        let nurse=await NurseModel.findById(nurseApp.NurseId);
        // Taking Average
        nurse.Rating=(((nurse.Rating)*((nurse.PreviousRecords.length)-1))+data.Rating)/nurse.PreviousRecords.length;
        
        await nurse.save();


        res.json({
            message:"Test"
        })
    
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
}




  
  


module.exports.test= async function test(req,res){
    try {
        
        res.json({
            message:"Test"
        })
    
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
}


