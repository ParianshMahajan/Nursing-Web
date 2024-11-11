const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./config/DatabaseConfig.js')
const app = express();
const dotenv = require("dotenv");
const session = require('express-session');
const path = require('path');
const http = require('http');
var https = require('https');
const nurseRouter = require('./Routers/nurseRouter.js');

dotenv.config({ path: "./config.env" });

var cors = require('cors');
const extraRouter = require('./Routers/extraRouter.js');
app.use(cors());
app.use(express.json({limit: '5mb', extended: true}));

app.use(session({
  secret
  : 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));


  
const port = process.env.PORT;
app.listen(port , () => console.log('App listening on port ' + port));
  


startRoutes();

function startRoutes(){
  app.use('/user',require('./Routers/userRouter.js'));
  app.use('/nurse',nurseRouter);
  app.use('/extra',extraRouter);
}