const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    profileUrl: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    roles: {
        type: [String],
        default: ["User"]
    },
    age : {
        type: Number,
        default: 0
    },
    address: {
        type: String,
        default: ""
    },
    medicalHistory: {
        type: String,
        default: ""
    },
    currentMedication: {
        type: String,
        default: ""
    },
    vaccination: {
        type: String,
        default: ""
    },
    emergencyContactName: {
        type: String,
        default: ""
    },
    relationship: {
        type: String,
        default: ""
    },
    emergencyContactNumber: {
        type: Number,
        default: 0
    },
    refreshToken: {
        type: String,
        default: ""
    }
}, {timestamps: true}
)

module.exports = mongoose.model("User", userSchema)
