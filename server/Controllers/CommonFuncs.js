const axios = require('axios');

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const UserModel = require('../models/UserModel');
const RequestModel = require('../models/RequestModel');


const mapApiKey=process.env.MAPS_API_KEY;


// Decline Requests
module.exports.declineRequest= async function declineRequest(req,res){
    try {
        let data=req.body;
        let request =await RequestModel.findById(data.requestID);

        request.Status=2;
        await request.save();


        res.json({
            status:true,
            message:'Request Declined'
        });
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}





// Negotiate Requests
module.exports.negotiateRequest= async function negotiateRequest(req,res){
    try {
        let data=req.body;
        let request =await RequestModel.findById(data.requestID);

        request.Status=3;
        request.Amount=data.Amount,
        request.Duration=data.Duration,
        await request.save();


        res.json({
            status:true,
            message:'Request Accepted'
        });
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}




// Accept Requests
module.exports.acceptRequest= async function acceptRequest(req,res){
    try {
        let data=req.body;
        let request =await RequestModel.findById(data.requestID);

        request.Status=true;
        await request.save();


        res.json({
            status:true,
            message:'Request Accepted'
        });
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}





module.exports.ReportUser= async function ReportUser(req,res){
    try {
        let data=req.body;
        let user =await UserModel.findById(data.userID);

        user.Report=data.Report;
        await user.save();

        res.json({
            status:true,
            message:'Report Submitted'
        });
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}




module.exports.SearchLocation= async function SearchLocation(req,res){
    // const query=req.body.query;
    
    const query="Jaisinghpur";
    
    const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchText?fields=*',
        {
          'textQuery': query,
          'pageSize': 5,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization': "Bearer ya29.a0AcM612x7KDzlF_f8i5HsY-Iv36TvhalbnmJkDvDYmuh9d6UWP74n_AMrpdhLqnER_wDYuEAnBf0RlGbfN6szPLx5sY7hYm5dbR2yac8YFUfrRhyb53fsWV-11gPgYXe3GtbmVPW2UoNT9_Xz-49q0BvVrm3OPe191VReKgUaCgYKAdsSARMSFQHGX2MipT523cIxeNPZV5_vV1j86Q0174",
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,places.location'
          }
        }
      );
    try {

        const places = response.data.places.slice(0, 5).map(place => ({
            name: place.displayName,
            formattedAddress: place.formattedAddress,
            location: place.location
        }));

        res.json({
            status:true,
            message:'Report Submitted',
            places:places,
            // data:response.data
        });
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}





