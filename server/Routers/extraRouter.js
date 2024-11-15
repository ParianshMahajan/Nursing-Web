const express = require('express');
const { getAllCities, getNursesByCity } = require('../Controllers/CommonFuncs');
const { protect } = require('../middlewares/protect');
const app = express();
const extraRouter = express.Router();


extraRouter.get('/verifyAuthToken', protect, (req, res) => {
    if (req.nurse) {
        res.status(200).send({ ...req.nurse, authorized: true });
    }
    else if (req.user) {
        res.status(200).send({ ...req.user, authorized: true });
    } else {
        res.status(401).send({ authorized: false });
    }
});


extraRouter.get('/getCities', getAllCities);
extraRouter.post('/getNursesByCity', getNursesByCity);



module.exports = extraRouter;