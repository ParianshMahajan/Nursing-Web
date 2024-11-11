const axios = require('axios');

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwt = require('jsonwebtoken');
const secret_key = process.env.secret_key;

const NurseModel = require('../models/NurseModel');
const UserModel = require('../models/UserModel');
const authModel = require('../models/authModel');
const { sendMail } = require('../middlewares/nodeMailer');
const RequestModel = require('../models/RequestModel');
const { getImgurLink } = require('../middlewares/ImgurAPI');
const crypto = require('crypto');



// SIGNUP
function capitalizeKeys(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    acc[capitalizedKey] = obj[key];
    return acc;
  }, {});
}


module.exports.createNurse = async function createNurse(req, res) {
  try {
    let data = req.body;
    
    data = capitalizeKeys(data);
    // const link = await getImgurLink(data.ProfilePhoto);
    // console.log(link);
    // data.ImgUrl=link;
    data.ImgUrl = data.ProfilePhoto ?? '';
    data.IsAvailable = true;
    
    try{
      data.City =data.Address.split(',').slice(-3)[0].trim();
    }catch(e){
      data.City = '';
    }
  

    let oldNurse = await NurseModel.findOne({ Email: data.Email });
    if (oldNurse) {
      res.status(409).json({
        message: "User already exists",
        status: false
      });
      return;
    }
    let nurse = await NurseModel.create(data);

    const ip =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const payload = {
      uuid: nurse._id,
      Role: 'Nurse',
      IPV4: ip,
    }

    const token = jwt.sign(payload, secret_key);

    let auth = await authModel.create({ UserID: nurse._id, Role: "Nurse", SessionID: token, IPV4: ip });

    res.json({
      status: true,
      token: token,
    });

  } catch (error) {
    res.json({
      message: error.message,
      status: false
    })
  }
}




// LOGIN
// OTP generation and mail
module.exports.NurseLogin = async function NurseLogin(req, res) {
  try {
    let data = req.body;
    let nurse = await NurseModel.findOne({ Email: data.Email });


    if (nurse) {
      if (data.Password === nurse.Password) {

        let otp = parseInt(crypto.randomBytes(3).toString("hex"), 16).toString().substring(0, 6);

        let auth = await authModel.findOne({ UserID: nurse._id });

        if (auth) {
          auth.OTP = otp;
          await auth.save();
        }
        else {
          let auth = await authModel.create({ UserID: user._id, Role: "Nurse", OTP: otp });
        }

        //Mailing The OTP to the registered mail
        sendMail(nurse.Email, otp);

        res.json({
          status: true,
          message: "OTP has been sent"
        });
      }
      else {
        res.json({
          status: false,
          message: "Incorrect password"
        });
      }
    }
    else {
      res.json({
        status: false,
        message: "User does not exits"
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
      status: false
    })
  }
}



//   OTP and JWT generation
module.exports.NurseLoginPart2 = async function NurseLoginPart2(req, res) {
  try {
    let data = req.body;
    let nurse = await NurseModel.findOne({ Email: data.Email });

    if (nurse) {
      if (data.Password === nurse.Password) {

        let auth = await authModel.findOne({ UserID: nurse._id });

        if (auth.OTP === data.OTP) {

          const ip =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

          const payload = {
            uuid: nurse._id,
            Role: "Nurse",
            IPV4: ip,
          }
          const token = jwt.sign(payload, secret_key);

          auth.SessionID = token;
          auth.timestamp = Date.now();
          auth.IPV4 = ip;
          auth.OTP = undefined;
          await auth.save();

          res.json({
            status: true,
            token: token,
          });
        }
        else {
          res.json({
            status: false,
            message: "Incorrect OTP",
          });
        }
      }
      else {
        res.json({
          status: false,
          message: "Incorrect password"
        });
      }
    }
    else {
      res.json({
        status: false,
        message: "User does not exits"
      });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}







// Fetch Requests
module.exports.Requests = async function Requests(req, res) {
  try {
    let nurse = res.nurse;
    let requests = [];

    for (let i in nurse.Requests) {
      let requestId = nurse.Requests[i];
      let request = await RequestModel.findById(requestId);

      let user = await UserModel.findById(request.UserId);
      request = {
        ...request,
        ImgUrl: user.ImgUrl,
        id: user._id,
        Name: user.Name,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
        Address: user.Address,
      };
      requests.push(request);
    }


    res.json({
      status: true,
      Requests: requests,
    });

  } catch (error) {
    res.json({
      message: error.message,
      status: false
    })
  }
}



module.exports.acceptRequest = async function acceptRequest(req, res) {
  try {
    let nurse = res.nurse;
    let reqid=req.params.id;

    let request = await RequestModel.findById(reqid);
    request.Status = 1;
    await request.save();

    res.json({
      status: true,
      message:"Request Accepted"
    });

  } catch (error) {
    res.json({
      message: error.message,
      status: false
    })
  }
}

module.exports.declineRequest = async function declineRequest(req, res) {
  try {
    let nurse = res.nurse;
    let reqid=req.params.id;

    let request = await RequestModel.findById(reqid);
    request.Status = 2;
    await request.save();

    res.json({
      status: true,
      message:"Request Accepted"
    });

  } catch (error) {
    res.json({
      message: error.message,
      status: false
    })
  }
}

module.exports.setRequest = async function setRequest(req, res) {
  try {
    let nurse = res.nurse;
    let {reqid,amount,isAllowedPay}=req.body;

    let request = await RequestModel.findById(reqid);
    request.Amount = amount;
    request.AllowedPay = isAllowedPay;
    await request.save();

    res.json({
      status: true,
      message:"Request Accepted"
    });

  } catch (error) {
    res.json({
      message: error.message,
      status: false
    })
  }
}


module.exports.chatOptionsNurse = async function chatOptionsNurse(req, res) {
  try {
      let nurse = res.nurse;

      let requests = await RequestModel.find({ NurseId: nurse._id, Status: 1 })
      .select('messages UserId') 
      .populate({
        path: 'UserId',
        select: 'Name _id'  
      });        
      const formattedRequests = requests.map(request => ({
          messages: request.messages,
          user: {
            _id: request.UserId._id,
            Name: request.UserId.Name
          }
        }));

      res.json({
          status: true,
          Requests: formattedRequests,
      });

  } catch (error) {
      res.json({
          message: error.message,
          status: false
      })
  }
}








module.exports.authenticate = (req, res, next) => {

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      status: false,
      message: 'Authorization header missing or invalid format'
    });
  }

  const token = authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Invalid token ' + err });
      } else {
        req.nurse = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
}

module.exports.dashboard = (req, res) => {
  NurseModel.findById(req.nurse.uuid, (err, nurse) => {
    if (err) {
      res.status(404).json({ message: 'Nurse not found' });
    } else {
      res.json(nurse);
    }
  });
}



module.exports.deleteProfile = (req, res) => {
  NurseModel.findByIdAndRemove(req.nurse.uuid, (err) => {
    if (err) {
      res.status(404).json({ message: 'Nurse not found' });
    } else {
      authModel.findOneAndRemove({ UserID: req.nurse.uuid }, (err) => {
        if (err) {
          res.status(400).json({ message: 'Error deleting nurse profile' });
        } else {
          res.json({ message: 'Nurse profile deleted successfully' });
        }
      });
    }
  });
}


module.exports.updateProfile = async (req, res) => {
  try {
    // Validate the request body
    const updateFields = {
      Name: req.body.Name,
      AboutMe: req.body.AboutMe,
      Email: req.body.Email,
      PhoneNumber: req.body.PhoneNumber,
      Skilled: req.body.Skilled,
      Skills: req.body.Skills,
      Links: req.body.Links,
      Price: req.body.Price,
      IsAvailable: req.body.IsAvailable,
      Address: req.body.Address,
      City: req.body.City,
      ImgUrl: req.body.ImgUrl
    };

    // Remove undefined fields
    Object.keys(updateFields).forEach(key => 
      updateFields[key] === undefined && delete updateFields[key]
    );

    // Find and update the nurse profile
    const nurse = await NurseModel.findById(req.nurse.uuid);

    if(!nurse.ConfirmPassword){
      nurse.ConfirmPassword=nurse.Password;
    }
    
    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: 'Nurse profile not found'
      });
    }

    // If email is being updated, check if it's already in use
    if (updateFields.Email && updateFields.Email !== nurse.Email) {
      const emailExists = await NurseModel.findOne({ 
        Email: updateFields.Email,
        _id: { $ne: req.nurse.uuid }
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use'
        });
      }
    }

    // Validate phone number format if it's being updated
    if (updateFields.PhoneNumber) {
      const phoneRegex = /^\d{10}$/;  // Assumes 10-digit phone number
      if (!phoneRegex.test(updateFields.PhoneNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone number format'
        });
      }
    }

    // Validate skill level if it's being updated
    if (updateFields.Skilled && ![1, 2, 3].includes(updateFields.Skilled)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid skill level. Must be 1 (Skilled), 2 (Semi-Skilled), or 3 (Unskilled)'
      });
    }

    // Validate price if it's being updated
    if (updateFields.Price && updateFields.Price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative'
      });
    }

    // Update the nurse profile
    Object.assign(nurse, updateFields);

    // Save the updated profile
    await nurse.save();

    // Return the updated nurse profile
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: nurse
    });

  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle other errors
    console.error('Error updating nurse profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating profile',
      error: error.message
    });
  }
};

// Optional: Add a method to update just the availability status
module.exports.updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'IsAvailable must be a boolean value'
      });
    }

    const nurse = await NurseModel.findById(req.nurse.uuid);
    
    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: 'Nurse profile not found'
      });
    }

    // Check if price is set before allowing availability to be true
    if (isAvailable && !nurse.Price) {
      return res.status(400).json({
        success: false,
        message: 'Cannot set availability to true without setting a price'
      });
    }

    nurse.IsAvailable = isAvailable;
    await nurse.save();

    return res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: { isAvailable: nurse.IsAvailable }
    });

  } catch (error) {
    console.error('Error updating nurse availability:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating availability',
      error: error.message
    });
  }
};


module.exports.getProfile = async (req, res) => {
  try {
    const nurse = await NurseModel.findById(req.nurse.uuid);
    
    if (!nurse) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nurse not found' 
      });
    }
    
    return res.status(200).json({
      success: true,
      data: nurse
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving nurse profile',
      error: error.message
    });
  }
};