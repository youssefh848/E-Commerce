import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import { isValid } from "../../middelware/validation.js";
import { addSubcategoryVal, deleteSubCategoryVal, updatesubCategoryVal } from "./subcategory.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { addSubcategory, deleteSubcategory, getSubcategory, subcategoryById, updateSubcategory } from "./subcategory.controller.js";
import { cloudUpload } from "../../utils/multer-cloud.js";

const subcategoryRouter = Router();

// add subcategory  todo authentcation,auth
subcategoryRouter.post('/',
    //fileUpload({ folder: 'subcategory' }).single('image'),  // file sys
    cloudUpload().single('image'),
    isValid(addSubcategoryVal),
    asyncHandler(addSubcategory)
)


// update subcategory  todo authentcation,auth
subcategoryRouter.put('/:subcategoryId',
    //fileUpload({ folder: 'subcategory' }).single('image'),
    cloudUpload().single('image'),
    isValid(updatesubCategoryVal),
    asyncHandler(updateSubcategory)
)

// get subcategory  
subcategoryRouter.get('/:categoryId', asyncHandler(getSubcategory))

// get specific subcategory
subcategoryRouter.get('/specific/:subcategoryId', asyncHandler(subcategoryById))

// delete subcategory todo authentcation,auth
subcategoryRouter.delete('/:subcategoryId', isValid(deleteSubCategoryVal), asyncHandler(deleteSubcategory))







export default subcategoryRouter;