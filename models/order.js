const { Schema, model } = require('mongoose');

const { ObjectId } = Schema;

const orderSchema = new Schema({
    hotel: {
        type: ObjectId,
        ref: 'Hotel'
    },
    session: {},
    orderedBy: {
        type: ObjectId,
        ref: 'User'
    }
},
    {
        typestamps: true
    }
);

module.exports = model('Order', orderSchema);