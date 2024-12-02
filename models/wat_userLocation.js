const mongoose = require('mongoose')

const userLocationSchema = new mongoose.Schema({
    name: String,
    email: String,
    location: {
        latitude: Number,
        longitude: Number,
    }
})

const userLocationData = mongoose.model('userLocation', userLocationSchema)
module.exports = userLocationData;