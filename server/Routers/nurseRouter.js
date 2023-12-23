const express=require('express');
const { createNurse } = require('../Controllers/NurseFuncs');
const app=express();
const nurseRouter=express.Router();



//From frontend Questions and Links comes in array

nurseRouter
.route('/create')
.post(createNurse)




module.exports=nurseRouter;