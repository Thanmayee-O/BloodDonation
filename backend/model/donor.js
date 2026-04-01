import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
    },
    address: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
});

export const Donor = mongoose.model('Donor', donorSchema);
