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
    

    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': mapApiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel',
    }
    
    json_data = {
        'textQuery': 'Spicy Vegetarian Food in Sydney, Australia',
    }
    const response = await axios.post('https://places.googleapis.com/v1/places:searchText', headers=headers, json=json_data)
    console.log(response.data);
    // const response = await axios.post(
    //     'https://places.googleapis.com/v1/places:searchText?fields=*',
    //     {
    //       'textQuery': query,
    //       'pageSize': 5,
    //     },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'authorization': "Bearer ",
    //         'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,places.location'
    //       }
    //     }
    //   );
    try {

        const places = response.data.places.slice(0, 5).map(place => ({
            name: place.displayName,
            formattedAddress: place.formattedAddress,
            location: place.location
        }));

        res.json({
            status:true,
            // message:'Report Submitted',
            // places:places,
            data:response.data
        });
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
        
}





