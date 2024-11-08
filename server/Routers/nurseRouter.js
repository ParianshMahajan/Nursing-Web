const express=require('express');
const { createNurse, authenticate, deleteProfile, updateProfile, NurseLogin, NurseLoginPart2, dashboard } = require('../Controllers/NurseFuncs');
const app=express();
const nurseRouter=express.Router();



//From frontend Questions and Links comes in array

nurseRouter
.route('/create')
.post(createNurse)

nurseRouter.delete('/delete-profile', authenticate, deleteProfile);
nurseRouter.patch('/update-profile', authenticate, updateProfile);

nurseRouter.post('/sendOTP',NurseLogin);
nurseRouter.post('/verifyOTP',NurseLoginPart2);


nurseRouter.get('/dashboard', authenticate, dashboard);


module.exports=nurseRouter;