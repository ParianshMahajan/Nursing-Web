const axios = require('axios');

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwt=require('jsonwebtoken');
const secret_key=process.env.secret_key;

const users = require('../models/users');
const application = require('../models/application');
const { default: getImgurLink } = require('../middlewares/ImgurAPI');











module.exports.createUser= async function createUser(req,res){
try {
    let data=req.body; 

    const link = await getImgurLink(data.ImgUrl);
    data.ImgUrl=link;

    let user=await users.create(data);
    
    
    const uuid=user._id;
    const token=jwt.sign({payload:uuid},secret_key);

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






module.exports.sendData= async function sendData(req,res){
    res.json({
        Users:res.user
    });
}   



module.exports.apply= async function apply(req,res){
    try{
        let data=req.body;
        
        //update if any changes applied while applying;
        let user=res.user;

        user.PhoneNumber=data.PhoneNumber;
        user.Branch=data.Branch;
        user.AboutMe=data.AboutMe;
        user.CG=data.CG;
        user.TechStack=data.TechStack;
        user.NonTech=data.NonTech;
        user.Links=data.Links;

        
        await user.save();




        //creating application
        let applic={
            UserId:user._id,
            AboutMe:user.AboutMe,   
            TechStack:user.TechStack,   
            NonTech:user.NonTech,   
            AboutMe:user.AboutMe,
            Slots:data.Slots,   
            WhyCCS:data.WhyCCS, 
            Links:data.Links,  
            Questions:data.Questions
        }
        let applied=await application.create(applic);
        user.Applications.push(applied._id);
        user.LastApplied=Date.now();

        await user.save();

    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}





//1st step Shortlisting send status=2 or -1 from frontend
module.exports.selectSlot = async function selectSlot(req, res) {
    try {
      let data=req.body; 
      let user=await users.findOne({_id:data.user});
  
      //Providing Slots to the last applied application
      let app=await application.findById(user.Applications[user.Applications.length-1]);
      
      //Selected
      if(data.Status==0){
        app.SelectedSlot=data.Slot;
        app.Status=0;
        await app.save();
      }
      // Rewschedule requested
      else if(data.Status==-2){
        app.SlotRequest=data.SlotRequest;
        app.Status=-2;
        await app.save();
      }
      res.json({
        status: true,
      });
  
    } catch (error) {
      res.json({
        message: error.message,
        status: false,
      });
    }
  }
  







module.exports.updateProfile= async function updateProfile(req,res){
    try{
        let data=req.body;
        
        let user=res.user;
        
        user.PhoneNumber=data.PhoneNumber;
        user.Branch=data.Branch;
        user.AboutMe=data.AboutMe;
        user.CG=data.CG;
        user.TechStack=data.TechStack;
        user.NonTech=data.NonTech;
        user.Links=data.Links;

        await user.save();
        res.json({
            message:"Updated",
        })
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}






module.exports.pastApp= async function pastApp(req,res){
    try{
        let user=res.user;
        let apps=[];
        for(let i in user.Applications){
            let app=await application.findOne({_id:user.Applications[i]});
            apps.push(app);
        }


        res.json({
            status:true,
            Applications:apps,
            User:user,
        })

    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}












module.exports.test= async function test(req,res){
    try{
        res.json({
            message:"Hi"
        })
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}



