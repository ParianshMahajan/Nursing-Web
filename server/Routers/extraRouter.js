const express=require('express');
const { authenticate } = require('../Controllers/NurseFuncs');
const app=express();
const extraRouter=express.Router();


extraRouter.get('/verifyAuthToken', authenticate,(req, res) => {
    if(req.nurse){
        res.status(200).send({...req.nurse,authorized:true});
    }
    else if(req.user){
        res.status(200).send({...req.user,authorized:true});
    }else{
        res.status(401).send({authorized:false});
    }
});
    
module.exports=extraRouter;