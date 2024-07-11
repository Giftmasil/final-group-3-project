const mongoose = require("mongoose")

const emergencySchema = new mongoose.Schema({
    title: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    place: {
        type: String,
        default: ""
    },
    latitude: {
        type: String,
        default: ""
    },
    longitude: {
        type: String,
        default: ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    condition: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "Delivered"
    },
    responder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    responderLatitude: {
        type: String,
        default: ""
    },
    responderLongitude: {
        type: String,
        default: ""
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("Emergency", emergencySchema)