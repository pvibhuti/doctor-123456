const { default: mongoose } = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');

const appointmentSchema = new Schema({
    doctorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
    },
    patientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Patient', 
    },
    appointmentDate: { 
        type: Date, 
        default: moment().format('YYYY-MM-DD')
    },
    appointmentTime: { 
        type: String, 
    }, 
    disease: { 
        type: String, 
    }, 
    status: { 
        type: Number, 
        default: 0 
    },
    approveStatus:{
        type: Number, 
        default: 0 
    },
    rejectReasong:{
        type: String
    },
    appointmentFor:{
        type:String
    }
},{
    timestamps: true
});

const appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = appointment;