const { default: mongoose } = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
    },
    password: {
        type: String,
        minlength: 8,
    },
    gender: {
        type: String,
    },
    address: {
        type: String,
    },
    profilePhoto: {
        type: String,
    },
    secret: {
        type: String,
    },
    authStatus: {
        type: Number,
        default: 0,
    },
    status: {
        type: Number,
        default: 0
    },
    role:{
        type:String,
        default:"patient"
    },
    otp: {
        type: Number
    }
}, {
    timestamps: true
});

const patient = mongoose.model("Patient", patientSchema);
module.exports = patient;
