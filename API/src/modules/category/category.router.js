import { Router } from "express";
import { isValid } from "../../middelware/validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { fileUpload } from "../../utils/multer.js";
import { addCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "./category.controller.js";
import { addCategoryVal, deleteCategoryVal, getCategoryByIdVal, updateCategoryVal } from "./category.validation.js";
import { cloudUpload } from "../../utils/multer-cloud.js";

const categoryRouter = Router();

// add category todo authentication & auth
categoryRouter.post('/',
   // fileUpload({ folder: 'category' }).single('image'),  file sys
   cloudUpload().single('image'),
    isValid(addCategoryVal),
    asyncHandler(addCategory)
);

// update category todo authentication ,auth
categoryRouter.put('/:categoryId',
    //fileUpload({ folder: 'category' }).single('image'),  //file sys
    cloudUpload().single('image'),
    isValid(updateCategoryVal),
    asyncHandler(updateCategory)
)

// get all category
categoryRouter.get('/', asyncHandler(getCategories))

//git specific category
categoryRouter.get('/:categoryId', isValid(getCategoryByIdVal), asyncHandler(getCategoryById))    

// delete category todo authentication ,auth
categoryRouter.delete('/:categoryId', isValid(deleteCategoryVal), asyncHandler(deleteCategory))    




export default categoryRouter;