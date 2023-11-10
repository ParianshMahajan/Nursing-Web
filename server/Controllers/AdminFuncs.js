const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const jwt = require("jsonwebtoken");
const secret_key = process.env.secret_key;

const users = require("../models/users");
const application = require("../models/application");

const adminPassword=process.env.adminPassword;








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



//Without the applications
// Applications ids only  
// Status 1 only
module.exports.Applicants = async function Applicants(req, res) {
  try {
        let users=await users.find({Status:1});
        res.json({
          status: true,
          Applicants: users,
        });

  } catch (error) {
    res.json({
      message: error.message,
      status: false,
    });
  }
};




// In post request we have sent user id  
module.exports.userApplications = async function userApplications(req, res) {
  try {
    let data=req.body; 
    let user=await users.findOne({_id:data.user});
    let apps=[];
    for(let i in user.Applications){
      let application=await application.findOne({_id:el});
      apps.push(application);
    }
    res.json({
      Applications: apps,
      status: true,
    });


  } catch (error) {
    res.json({
      message: error.message,
      status: false,
    });
  }
}







//1st step Shortlisting send status=2 or -1 from frontend
module.exports.provideSlots = async function provideSlots(req, res) {
  try {
    let data=req.body; 
    let user=await users.findOne({_id:data.user});

    //Providing Slots to the last applied application
    let app=await application.findById(user.Applications[user.Applications.length-1]);
    
    //Shortlisted
    if(data.Status==2){
      app.Slots=data.Slots;
      app.Status=2;
      await app.save();
    }
    // Rejected
    else if(data.Status==-1){
      app.Review=data.Review;
      app.Status=-1;
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








//Applicants those have selected Slots
module.exports.intervewPanel = async function intervewPanel(req, res) {
  try {
    let applicants=await application.find({Status:0});

    res.json({
      Shortlisted:applicants,
      status: true,
    });


  } catch (error) {
    res.json({
      message: error.message,
      status: false,
    });
  }
}




//Applicants those have applied for reschedule request
module.exports.reScheduled = async function reScheduled(req, res) {
  try {
    let applicants=await application.find({Status:-2});

    res.json({
      Rescheduled:applicants,
      status: true,
    });


  } catch (error) {
    res.json({
      message: error.message,
      status: false,
    });
  }
}






// Operated on Scheduled Interviews Panel

//1st step Shortlisting send status=3 or 4 or 5 from frontend
module.exports.marking = async function marking(req, res) {
  try {
    let data=req.body; 
    let user=await users.findOne({_id:data.user});

    //Providing Slots to the last applied application
    let app=await application.findById(user.Applications[user.Applications.length-1]);

    //Interview Rejected
    if(data.Status==3){
      app.Review=data.Review;
      app.Status=3;
      await app.save();
    }

    // To be decided
    else if(data.Status==4){
      app.Review=data.Review;
      app.Status=4;
      await app.save();
    }
    
    
    // Recruited
    else if(data.Status==5){
      app.Status=5;
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







// Final Deciding between tbd and recruited 
// Changes can be made
// Selection Panel
module.exports.selectionPanel = async function selectionPanel(req, res) {
  try {
    let applicantsTBD=await application.find({Status:4});
    let applicantsGREEN=await application.find({Status:5});

    res.json({
      Rescheduled:[...applicantsTBD,...applicantsGREEN],
      status: true,
    });


  } catch (error) {
    res.json({
      message: error.message,
      status: false,
    });
  }
}




//Recruited people
// Mail Sending Portal
module.exports.sendMail = async function sendMail(req, res) {
  try {
    let applicants=await application.find({Status:5});

    ///Send mail to applicants

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