import { Router } from "express";
import { cloudUpload } from "../../utils/multer-cloud.js";
import { isValid } from "../../middelware/validation.js";
import { addProductVal } from "./product.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { addProduct } from "./product.controller.js";

const productRouter = Router()
// add product  todo authentcation & autherizaton
productRouter.post('/',
    cloudUpload().fields([{ name: 'mainImage', maxCount: 1 }, { name: 'subImages', maxCount: 10 }]),
    isValid(addProductVal),
    asyncHandler(addProduct)
)



export default productRouter;