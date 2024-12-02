const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: String,
    email: String,
    companyType: String,
    companyName: String,
    contact: String,
    address: String,
    location: {
        latitude: Number,
        longitude: Number,
    }
})

const vendorData = mongoose.model('vendorsdata', vendorSchema);

module.exports = vendorData;