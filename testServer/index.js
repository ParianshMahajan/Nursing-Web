const express = require('express')
const { default: mongoose } = require('mongoose')
var cors = require('cors')

const app = express()
app.use(cors())
const { faker } = require('@faker-js/faker');

mongoose.connect("mongodb://localhost:27017/nursing");

const nurseSchema = new mongoose.Schema({
    ImgUrl: {
        type: String,
    },
    Name: {
        type: String,
        required: true,
    },
    AboutMe:{
        type: String
    },
    Email:{
        type:String,
        unique:true,
        required: true,
    },
    PhoneNumber: {
        type: String,
        required: true,
    },
    Skilled:{
        type:Number,
        required: true,
    },
    Skills:{
        type:Array
    },
    Links:{
        type:JSON
    },
    Price:{
        type:Number,
    },
    Address:{
        type:String, 
    },
    City:{
        type:String, 
    },
    State:{
        type:String, 
    },
    Ratings:{
        type:Number,
    },
})

const Nurse = mongoose.model('nurse', nurseSchema);


// const generateDummyData = () => {
//     const dummyData = [];

//     for (let i = 0; i < 10; i++) {
//         const nurse = new Nurse({
//             ImgUrl: faker.image.avatar(),
//             Name: faker.internet.displayName(),
//             AboutMe: faker.lorem.paragraph(),
//             Email: faker.internet.email(),
//             PhoneNumber: faker.phone.number(),
//             Skilled: faker.number.int({min: 1, max: 3}),
//             Skills: [],
//             Links: { certificate: faker.internet.url(), achievement: faker.internet.url() },
//             Price: faker.number.int({min: 68, max:500}),
//             Address: faker.location.streetAddress(),
//             City: faker.location.city(),
//             State: faker.location.state(),
//             Ratings: faker.number.int({ min: 1, max: 5 }),
//         });

//         dummyData.push(nurse);
//     }

//     return dummyData;
// };

app.get("/search", async function(req, res){

    let q = req.query;

    for(var key in q){
        if(q[key] == "0"){
            delete(q[key]);
        }
    }

    console.log(q);
    const data = await Nurse.find(q);
    res.send(data);

})

app.get("/nurse/:id", async function(req, res){

    console.log(req.params.id);
    const data = await Nurse.find({_id: req.params.id});
    res.send(data);

})

app.listen(8000, ()=>{console.log("----------AppStarted-----------");})