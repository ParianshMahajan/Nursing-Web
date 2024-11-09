const express=require('express');
const { apply, sendData, createUser, updateProfile, pastApp, changeSlot, test, selectSlot, getProfile, UserLogin, UserLoginPart2 } = require('../Controllers/UserFuncs');
const { SearchLocation } = require('../Controllers/CommonFuncs');
const { authenticate } = require('../Controllers/NurseFuncs');
const app=express();
const userRouter=express.Router();

// not loggedIn then /newuser 
userRouter
.route('/test')
.get(SearchLocation)

userRouter.get('/profile',authenticate,getProfile);


//register function
userRouter
.route('/create')
.post(createUser)

//login function
userRouter.post('/sendOTP',UserLogin);
userRouter.post('/verifyOTP',UserLoginPart2);



module.exports=userRouter;