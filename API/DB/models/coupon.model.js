import { model, Schema, Types } from "mongoose";

// schema
const schema = new Schema({
    code:{
        type: String,
        required: true,
        unique: true
    },
    discount:{
        type: Number,
        required: true
    },
    expires:{
        type: Date,
        required: true
    }
}, { timestamps: true, versionKey: false })

// model
export const Coupon = model('Coupon', schema)