const express=require('express');
const { apply, sendData, createUser, updateProfile, pastApp, changeSlot, test, selectSlot, getProfile, UserLogin, UserLoginPart2, sendRequest, AllRequests, withdrawRequest, getNurseProfile } = require('../Controllers/UserFuncs');
const { SearchLocation } = require('../Controllers/CommonFuncs');
const { protect } = require('../middlewares/protect');
const app=express();
const userRouter=express.Router();

// not loggedIn then /newuser 
userRouter
.route('/test')
.get(SearchLocation)

userRouter.get('/profile',protect,getProfile);


//register function
userRouter
.route('/create')
.post(createUser)

//login function
userRouter.post('/sendOTP',UserLogin);
userRouter.post('/verifyOTP',UserLoginPart2);

// request 
userRouter.post('/create-request',protect,sendRequest);
userRouter.get('/all-requests',protect,AllRequests);
userRouter.get('/withdraw-request/:id',protect,withdrawRequest);


userRouter.get('/getNurseProfile/:id',protect,getNurseProfile);


module.exports=userRouter;