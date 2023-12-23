const express=require('express');
const { apply, sendData, createUser, updateProfile, pastApp, changeSlot, test, selectSlot } = require('../Controllers/UserFuncs');
const app=express();
const userRouter=express.Router();

// not loggedIn then /newuser 
userRouter
.route('/create')
.post(createUser)



//if some changes done while applying they will automatically merged in user profile
userRouter
.route('/apply')
.post(verify,apply)








//test
userRouter
.route('/test')
.get(test)










module.exports=userRouter;