import { model, Schema, Types } from "mongoose";

// schema
const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'name is required'],
        trim: true,
        minLength: [2, 'too short category name'],
        lowercase: true
    },
    slug: {
        type: String,
        required: true,
        unique: [true, 'slug is required'],
        trim: true,
        lowercase: true
    },
    logo: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User',
        // required: true
    }
    
}, { timestamps: true, versionKey: false })

// model
export const Brand = model('Brand', schema);