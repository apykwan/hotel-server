const fs = require('fs');

const Hotel = require('../models/hotel');
const Order = require('../models/order');

exports.create = async (req, res) => {
    // console.log('req.fields', req.fields);
    // console.log('req.files', req.files);
    try {
        let fields = req.fields;
        let files = req.files;
        
        let hotel = new Hotel(fields);
        hotel.postedBy = req.user._id;
        // handle image
        if (files.image) {
            hotel.image.data = fs.readFileSync(files.image.path);
            hotel.image.contentType = files.image.type;
        }
        hotel.save((err, result) => {
            if (err) {
                console.log('saving hotel err => ', err);
                res.status(400).send('Error saving!');
            }
            res.json(result);
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            err: err.message
        });
    }
};

exports.hotels = async (req, res) => {
    let all = await Hotel.find({ from: { $gte: new Date() }})
        .limit(24)
        .select('-image.data -__v')
        .populate('postedBy', '_id name')
        .exec();
    // console.log('ALL HOTELS ', all)
    res.json(all);
};

exports.image = async (req, res) => {
    let hotel = await Hotel.findById(req.params.hotelId).exec();
    if (hotel && hotel.image && hotel.image.data !== null) {
        res.set('Content-Type', hotel.image.contentType);
        return res.send(hotel.image.data);
    }
};

exports.sellerHotels = async (req, res) => {
    let all = await Hotel.find({ postedBy: req.user._id })
        .select('-image.data -__v')
        .populate('postedBy', '_id name')
        .exec();

    res.send(all);
};

exports.removeHotel = async (req, res) => {
    let removed = await Hotel.findByIdAndDelete(req.params.hotelId)
        .select('-image.data -__v')
        .exec();
        
    res.json(removed);
};

exports.read = async (req, res) => {
    let hotel = await Hotel.findById(req.params.hotelId)
        .select('-image.data -__v')
        .populate('postedBy', '_id name')
        .exec();

    console.log('SINGLE HOTEL', hotel);
    res.json(hotel);
};

exports.updateHotel = async (req, res) => {
    try {
        let fields = req.fields;
        let files = req.files;

        let data = {...fields};

        if (files.image) {
            let image = {};
            image.data = fs.readFileSync(files.image.path);
            image.contentType = files.image.type;

            data.image = image;
        }

        let updated = await Hotel.findByIdAndUpdate(req.params.hotelId, data, { new: true })
            .select('-image.data -__v');

        res.json(updated);
    } catch (err) {
        console.log(err);
        res.status(401).send('Hotel update failed. Try again.');
    }
};

exports.userHotelBookings = async (req, res) => {
    const all = await Order.find({ orderedBy: req.user._id })
        .select('session')
        .populate('hotel', '-image.data')
        .populate('orderedBy', '_id name')
        .exec();
    res.json(all);
};

exports.isAlreadyBooked = async (req, res) => {
    const { hotelId } = req.params;
    // find orders of the currently logged in user
    const userOrders = await Order.find({ orderedBy: req.user._id })
        .select('hotel')
        .exec();
    // check if hotel id is found in userOrders array
    let ids = [];
    for (let i = 0; i < userOrders.length; i++) {
        ids.push(userOrders[i].hotel.toString());
    }

    res.json({
        ok: ids.includes(hotelId)
    });
};

exports.searchListings = async (req, res) => {
    const { location, date, bed } = req.body;

    const fromDate = date.split(",");

    const result = await Hotel.aggregate([
        {
            $match: {
                $and: [
                    { from: { $lte: new Date(fromDate[0])} },
                    { to: { $gte: new Date(fromDate[1])} },
                    { bed: { $gte: Number(bed) }},
                    { location }
                ]
            }
        },  {
            
            $project: {
                "image.data": 0
            }
        }
    ]);

    res.json(result);
};
