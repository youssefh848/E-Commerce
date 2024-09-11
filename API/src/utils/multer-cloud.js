// import modules
import multer, { diskStorage } from "multer";
import { APPError } from './appError.js';
import { fileValidation } from "./multer.js";



export const cloudUpload = ({ allowFile = fileValidation.image }={}) => {
    const storage = diskStorage({})
    const fileFilter = (req, file, cb) => {
        if (allowFile.includes(file.mimetype)) {
            return cb(null, true)
        }
        return cb(new APPError('invalid file format', 400), false)
    }
    return multer({ storage, fileFilter })

}
