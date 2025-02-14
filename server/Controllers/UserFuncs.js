const axios = require('axios');

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwt = require('jsonwebtoken');
const secret_key = process.env.secret_key;
const cron = require('node-cron');







function capitalizeKeys(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        acc[capitalizedKey] = obj[key];
        return acc;
    }, {});
}

const { default: getImgurLink } = require('../middlewares/ImgurAPI');
const UserModel = require('../models/UserModel');
const NurseModel = require('../models/NurseModel');
const RequestModel = require('../models/RequestModel');
const NurseAppsModel = require('../models/NurseAppsModel');
const UserAppsModel = require('../models/UserAppsModel');
const crypto = require('crypto');
const authModel = require('../models/authModel');
const { sendMail } = require('../middlewares/nodeMailer');



// SIGNUP

module.exports.createUser = async function createUser(req, res) {
    try {
        let data = req.body;

        // const link = await getImgurLink(data.ImgUrl);
        // data.ImgUrl=link;
        data = capitalizeKeys(data);
        data.ImgUrl = data.ProfilePhoto ?? '';

        try {
            data.City = data.Address.split(',').slice(-3)[0].trim();
        } catch (e) {
            data.City = '';
        }

        let old = await UserModel.findOne({ Email: data.Email });
        if (old) {
            res.status(409).json({
                message: "User already exists",
                status: false
            });
            return;
        }

        let user = await UserModel.create(data);

        const ip =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const payload = {
            uuid: user._id,
            Role: 'User',
            IPV4: ip,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // Token expires in 24 hours
        }

        const token = jwt.sign(payload, secret_key);

        let auth = await authModel.create({ UserID: user._id, Role: "User", SessionID: token, IPV4: ip });

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
module.exports.UserLogin = async function UserLogin(req, res) {
    try {
        let data = req.body;
        let user = await UserModel.findOne({ Email: data.Email });


        if (user) {
            if (data.Password === user.Password) {

                let otp = parseInt(crypto.randomBytes(3).toString("hex"), 16).toString().substring(0, 6);

                let auth = await authModel.findOne({ UserID: user._id });

                if (auth) {
                    auth.OTP = otp;
                    await auth.save();
                }
                else {
                    let auth = await authModel.create({ UserID: user._id, Role: "User", OTP: otp });
                }

                //Mailing The OTP to the registered mail
                sendMail(user.Email, otp);

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
module.exports.UserLoginPart2 = async function UserLoginPart2(req, res) {
    try {
        const { Email, Password, OTP } = req.body;
        const user = await UserModel.findOne({ Email });

        if (!user) {
            return res.json({
                status: false,
                message: "User does not exist"
            });
        }

        if (Password !== user.Password) {
            return res.json({
                status: false,
                message: "Incorrect password"
            });
        }

        const auth = await authModel.findOne({ UserID: user._id });
        
        if (!auth || auth.OTP !== OTP) {
            return res.json({
                status: false,
                message: "Invalid OTP"
            });
        }

        const ip = req.headers['x-forwarded-for'] || 
                  req.connection.remoteAddress || 
                  req.socket.remoteAddress || 
                  req.connection.socket?.remoteAddress;

        const payload = {
            uuid: user._id,
            Role: "User",
            IPV4: ip,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        };

        const token = jwt.sign(payload, secret_key);

        // Update auth record
        auth.SessionID = token;
        auth.timestamp = Date.now();
        auth.IPV4 = ip;
        auth.OTP = undefined;
        await auth.save();

        res.json({
            status: true,
            token: token,
            user: {
                _id: user._id,
                Name: user.Name,
                Email: user.Email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        });
    }
}






//Get Nurse Profile By Id 
module.exports.getNurseProfile = async function getNurseProfile(req, res) {
    try {
        let id = req.params.id;
        let nurse = await NurseModel.findById(id);
        res.json({
            status: true,
            nurse: nurse
        });
    } catch (error) {
        res.json({
            message: error.message,
            status: false
        })
    }
}




// Send Request to a nurse
module.exports.sendRequest = async function sendRequest(req, res) {
    try {
        let data = req.body;
        let user = req.user;
        let requestData = {
            UserId: user._id,
            NurseId: data.nurseId,
            Reason: data.Reason,
            Requirements: data.Requirements,
            Location: data.Location,
            Address: data.Address,
            Duration: data.Duration,
            Amount: data.Amount,
            Status: 0,
        }

        let exist = await RequestModel.findOne({ UserId: user._id, NurseId: data.nurseId, Status: 0 });
        if (exist) {

        }

        let request = await RequestModel.create(requestData);
        user.RequestSent.push(request._id);
        let nurse = await NurseModel.findById(data.nurseId);
        nurse.Requests.push(request._id);
        res.json({
            message: "Request Sent",
            status: true
        })
    }
    catch (err) {
        res.json({
            message: err.message
        })
    }
}




// Fetch Requests
module.exports.AllRequests = async function AllRequests(req, res) {
    try {
        let user = req.user;
        
        // Find all requests for this user and populate nurse info
        const requests = await RequestModel.find({ 
            UserId: user._id 
        }).populate({
            path: 'NurseId',
            select: 'ImgUrl Name Email PhoneNumber Address'
        });

        // Format the response
        const formattedRequests = requests.map(request => {
            const nurse = request.NurseId;
            return {
                _id: request._id,
                reason: request.Reason,
                requirements: request.Requirements,
                location: request.Location,
                address: request.Address,
                status: request.Status,
                allowedPay: request.AllowedPay,
                amount: request.Amount,
                duration: request.Duration,
                messages: request.messages,
                nurseInfo: {
                    _id: nurse._id,
                    imgUrl: nurse.ImgUrl,
                    name: nurse.Name,
                    email: nurse.Email,
                    phoneNumber: nurse.PhoneNumber,
                    address: nurse.Address
                }
            };
        });

        res.json({
            status: true,
            requests: formattedRequests
        });

    } catch (error) {
        console.error('Error in AllRequests:', error);
        res.status(500).json({
            message: error.message,
            status: false
        });
    }
}






module.exports.withdrawRequest = async function withdrawRequest(req, res) {
    try {
        let reqid = req.params.id;
        let user = req.user;

        let index = user.RequestSent.indexOf(reqid);
        user.RequestSent.splice(index, 1);
        await user.save();

        let request = await RequestModel.findById(reqid);

        let nurse = await NurseModel.findById(request.NurseId);
        let index1 = nurse.Requests.indexOf(reqid);
        nurse.Requests.splice(index1, 1);
        await nurse.save();

        await request.deleteOne();


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






module.exports.chatOptionsUser = async function chatOptionsUser(req, res) {
    try {
        let user = res.user;

        let requests = await RequestModel.find({ UserId: user._id, Status: 1 })
        .select('messages NurseId') 
        .populate({
          path: 'NurseId',
          select: 'Name _id'  
        });        
        const formattedRequests = requests.map(request => ({
            messages: request.messages,
            nurse: {
              _id: request.NurseId._id,
              Name: request.NurseId.Name
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





module.exports.initialPay = async function initialPay(req, res) {
    try {
        let data = req.body;
        // Containing the request ID

        let payment = false;

        let user = res.user;
        let request = await RequestModel.findById(data.requestID);
        if (request.AllowedPay == false) {
            throw new Error("Payment not allowed");
        }
        let nurse = await NurseModel.findById(data.nurseID);

        // Calculating amount to be paid
        let amount = request.Amount;


        nurse.IsAvailable = false;
        await nurse.save();

        //

        // <--------Payment Code------->

        // 

        if (payment) {


            // Creating NurseApplication
            let nurseAppData = {
                NurseID: nurse._id,
                Skilled: nurse.Skilled,
                Skills: nurse.Skills,
                Links: nurse.Links,
                Amount: request.Amount,
                IsPaid: false,
                AmountPaid: amount,
                Review: {},
                Duration: request.Duration,
                UserApp: '',
            }
            let nurseApp = await NurseAppsModel.create(nurseAppData)

            // creating UserApplication.
            let userAppData = {
                UserId: user._id,
                Reason: request.Reason,
                Requirements: request.Requirements,
                Report: '',
                Location: request.Location,
                Address: user.Address,
                City: request.City,
                Amount: request.Amount,
                ApplicationStatus: 0,
                AmountPaid: amount,
                NurseApp: nurseApp._id,
            }
            let userApp = await UserAppsModel.create(userAppData)

            nurseApp.UserApp = userApp._id;
            await nurseApp.save();



            let index1 = nurse.Requests.indexOf(request._id);
            nurse.Requests.splice(index1, 1);
            nurse.CurrentApplication = nurseApp._id;
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
                nurse.CurrentApplication = '';
                nurse.PreviousRecords.push(nurseApp._id);
                await nurse.save();

            }, {
                scheduled: true,
                timezone: "Asia/Kolkata"
            });


            // Deleting Request
            let request = await RequestModel.findById(data.requestID);
            await request.deleteOne();

            user.CurrentContracts.nurseContracts.push(userApp._id);
            await user.save();

            res.json({
                status: true,
            });
        }
        else {
            nurse.IsAvailable = true;
            await nurse.save();
            res.json({
                status: false,
            });
        }

    } catch (error) {
        res.json({
            message: error.message,
            status: false
        })
    }

}











// Final Pay

module.exports.finalPay = async function finalPay(req, res) {
    try {
        let data = req.body;

        let payment = false;

        let user = res.user;

        // Calculating amount to be paid
        let amount = request.Amount;



        //

        // <--------Payment Code------->

        // 

        if (payment) {
            let nurseApp = await NurseAppsModel.findById(data.nurseAppId);
            let userApp = await UserAppsModel.findById(nurseApp.UserApp);

            userApp.ApplicationStatus = 2;
            userApp.AmountPaid = userApp.Amount;
            await userApp.save();

            // removing userApp from currentContracts
            let index = user.CurrentContracts.nurseContracts.indexOf(userApp._id);
            user.CurrentContracts.nurseContracts.splice(index, 1);

            user.PreviousRecords.nurseContracts.push(userApp._id);
            await user.save();

            res.json({
                status: true,
                Requests: requests,
            });
        }
        else {
            nurse.IsAvailable = true;
            await nurse.save();
            res.json({
                status: false,
            });
        }

    } catch (error) {
        res.json({
            message: error.message,
            status: false
        })
    }

}












// Radius Filter
module.exports.sendNurses = async function sendNurses(req, res) {
    try {
        let data = req.body;
        let currLocation = data.currLocation; // A json object eg. currLocation.latitude
        let radius = data.radius;

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
                                return distance / 1000;
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
            status: true,
            Nurses: nurses
        });
    } catch (error) {
        res.json({
            status: false,
            message: error.message
        })
    }
}











module.exports.Ratings = async function Ratings(req, res) {
    try {
        let data = req.body;
        let nurseApp = await NurseAppsModel.findById(data.nurseAppId);

        nurseApp.Rating = data.Rating;
        nurseApp.Review = data.Review;

        await nurseApp.save();

        let nurse = await NurseModel.findById(nurseApp.NurseId);
        // Taking Average
        nurse.Rating = (((nurse.Rating) * ((nurse.PreviousRecords.length) - 1)) + data.Rating) / nurse.PreviousRecords.length;

        await nurse.save();


        res.json({
            message: "Test"
        })


    } catch (error) {
        res.json({
            message: error.message,
            status: false
        })
    }
}








module.exports.test = async function test(req, res) {
    try {

        res.json({
            message: "Test"
        })


    } catch (error) {
        res.json({
            message: error.message,
            status: false
        })
    }
}


module.exports.getProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving user profile',
            error: error.message
        });
    }
};