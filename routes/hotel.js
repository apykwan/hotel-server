const express = require('express');
const formidable = require('express-formidable');

const { 
    create, 
    hotels, 
    image, 
    sellerHotels, 
    removeHotel, 
    read,
    updateHotel,
    userHotelBookings,
    isAlreadyBooked,
    searchListings
} = require('../controllers/hotel');
const { requireSignin, hotelOwner } = require('../middlewares');

const router = express.Router();

// route middelware
router.get('/hotels', hotels);
router.get('/hotel/:hotelId', read);
router.get('/hotel/image/:hotelId', image);
router.post('/search-listings', searchListings);

router.use(requireSignin);
router.post('/create-hotel', formidable(), create);
router.get('/seller-hotels', sellerHotels);
router.delete('/delete-hotel/:hotelId', hotelOwner, removeHotel);
router.put('/update-hotel/:hotelId', hotelOwner, formidable(), updateHotel);

// orders
router.get('/user-hotel-bookings', userHotelBookings);
router.get('/is-already-booked/:hotelId', isAlreadyBooked);

module.exports = router;