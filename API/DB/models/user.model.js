import { model, Schema } from "mongoose";
import { roles, status } from "../../src/utils/constant/enums.js";

//schema
const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: Object.values(roles),
        default: roles.USER
    },
    status: {
        type: String,
        enum: Object.values(status),
        default: status.PENDING
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    image: {
        secure_url: { type: String, required: false },
        public_id: { type: String, required: false }
    },
    DOB: {
        type: String,
        default: Date.now()
    }


}, { timestamps: true, versionKey: false })


//model
export const User = model('User', schema)