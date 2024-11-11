

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