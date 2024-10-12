const express=require('express');
const { apply, sendData, createUser, updateProfile, pastApp, changeSlot, test, selectSlot } = require('../Controllers/UserFuncs');
const { SearchLocation } = require('../Controllers/CommonFuncs');
const app=express();
const userRouter=express.Router();

// not loggedIn then /newuser 
userRouter
.route('/test')
.get(SearchLocation)


module.exports=userRouter;