// import modules
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import multer, { diskStorage } from "multer";
import { APPError } from './appError.js';
export const fileValidation = {
    image: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/jfif'],
    video: ['video/mp4', 'video/quicktime'],
    audio: ['audio/mpeg', 'audio/wav'],
    file: ['application/pdf', 'application/msword']
}


export const fileUpload = ({ folder, allowFile = fileValidation.image }) => {
    const storage = diskStorage({
        destination: (req, file, cb) => {
            const folderPath = path.resolve(`uploads/${folder}`);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true })
            }
            cb(null, `uploads/${folder}`)
        },
        filename: (req, file, cb) => {
            cb(null, nanoid() + "-" + file.originalname)
        }
    })
    const fileFilter = (req, file, cb) => {
        if (allowFile.includes(file.mimetype)) {
            return cb(null, true)
        }
        return cb(new APPError('invalid file format', 400), false)
    }
    return multer({ storage, fileFilter })

}
