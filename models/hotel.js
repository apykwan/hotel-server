const { Schema, model } = require('mongoose');

const { ObjectId } = Schema;

const hotelSchema = new Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    content: {
        type: String,
        required: 'Content is required',
        maxlength: 10000
    },
    location: {
        type: String,
        required: 'Location is required'
    },
    price: {
        type: Number,
        required: 'Title is required',
        trim: true
    },
    postedBy: {
        type: ObjectId,
        ref: 'User'
    },
    image: {
        data: Buffer,
        contentType: String
    },
    from : {
        type: Date
    },
    to: {
        type: Date
    },
    bed: {
        type: Number
    }
}, {
    timestamps: true 
});

module.exports = model('Hotel', hotelSchema);