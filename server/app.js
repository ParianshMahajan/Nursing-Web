const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./config/DatabaseConfig.js')
const app = express();
const session = require('express-session');
const path = require('path');
const http = require('http');
var https = require('https');
const nurseRouter = require('./Routers/nurseRouter.js');




  
const port = process.env.PORT;
app.listen(port , () => console.log('App listening on port ' + port));
  


startRoutes();

function startRoutes(){
  app.use('/user',require('./Routers/userRouter.js'));
  app.use('/nurse',nurseRouter);
}