const express=require('express');
const { isAdmin } = require('../middlewares/adminProtect');
const { createJWT, Applicants, userApplications, provideSlots, intervewPanel, reScheduled, marking, selectionPanel, sendMail } = require('../Controllers/AdminFuncs');
const app=express();
const adminRouter=express.Router();



//From frontend Questions and Links comes in array

adminRouter
.route('/create')
.post(createJWT)


adminRouter
.route('/applicants')
.post(isAdmin,Applicants)

adminRouter
.route('/applications')
.post(isAdmin,userApplications)


adminRouter
.route('/shortlist')
.post(isAdmin,provideSlots)



adminRouter
.route('/interview')
.post(isAdmin,intervewPanel)


adminRouter
.route('/reschedule')
.post(isAdmin,reScheduled)


adminRouter
.route('/marking')
.post(isAdmin,marking)




adminRouter
.route('/selection')
.post(isAdmin,selectionPanel)




adminRouter
.route('/sendmail')
.post(isAdmin,sendMail)


module.exports=adminRouter;