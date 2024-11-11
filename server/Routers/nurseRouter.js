const express=require('express');
const { createNurse, authenticate, deleteProfile, updateProfile, NurseLogin, NurseLoginPart2, dashboard, getProfile, Requests, acceptRequest, declineRequest, setRequest } = require('../Controllers/NurseFuncs');
const { protect } = require('../middlewares/protect');
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


nurseRouter.get('/profile', authenticate, getProfile);

// request 
nurseRouter.get('/all-requests',protect,Requests);
nurseRouter.get('/accept-request/:id',protect,acceptRequest);
nurseRouter.get('/decline-request/:id',protect,declineRequest);
nurseRouter.post('/set-request/',protect,setRequest);

module.exports=nurseRouter;