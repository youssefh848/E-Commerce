import { Router } from "express";
import { cloudUpload } from "../../utils/multer-cloud.js";
import { isValid } from "../../middelware/validation.js";
import { addProductVal, deleteProductVal, updateProductVal } from "./product.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "./product.controller.js";

const productRouter = Router()
// add product  todo authentcation & autherizaton
productRouter.post('/',
    cloudUpload().fields([{ name: 'mainImage', maxCount: 1 }, { name: 'subImages', maxCount: 10 }]),
    isValid(addProductVal),
    asyncHandler(addProduct)
)

// update product  todo authentcation & autherizaton
productRouter.put('/:productId',
    cloudUpload().fields([{ name: 'mainImage', maxCount: 1 }, { name: 'subImages', maxCount: 10 }]),
    isValid(updateProductVal),
    asyncHandler(updateProduct)
)

// get product
productRouter.get('/', asyncHandler(getAllProducts))

// get specific product 
productRouter.get('/:productId', asyncHandler(getProductById))

// delete producr todo authentcation & autherizaton
productRouter.delete('/:productId', isValid(deleteProductVal), asyncHandler(deleteProduct))


export default productRouter;