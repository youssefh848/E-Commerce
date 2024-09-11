import { model, Schema, Types } from "mongoose";

// schema
const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'name is required'],
        trim: true,
        minLength: [2, 'too short category name'],
    },
    slug: {
        type: String,
        required: true,
        unique: [true, 'slug is required'],
        trim: true,
    },
    image: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    category: {
        type: Types.ObjectId,
        ref: 'Category'
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: false //todo
    }

}, { timestamps: true, versionKey: false })

// model
export const Subcategory = model('Subcategory', schema);