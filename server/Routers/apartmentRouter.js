const express = require('express');
const { createApartment, ApartmentLogin, ApartmentLoginPart2, getAllApartments, getApartmentById, createBookingRequest, updateBookingStatus, getApartmentRequests } = require('../Controllers/ApartmentFuncs');
const { protectRoute } = require('../middlewares/protectRoute');

const apartmentRouter = express.Router();

// Authentication routes
apartmentRouter.post('/signup', createApartment);
apartmentRouter.post('/login', ApartmentLogin);
apartmentRouter.post('/login2', ApartmentLoginPart2);

// Apartment listing routes
apartmentRouter.get('/all', getAllApartments);
apartmentRouter.get('/:id', getApartmentById);

// Booking routes
apartmentRouter.post('/book', protectRoute, createBookingRequest);
apartmentRouter.patch('/booking-status', protectRoute, updateBookingStatus);
apartmentRouter.get('/requests/:apartmentId', protectRoute, getApartmentRequests);

module.exports = apartmentRouter;
