import { Router } from "express";
import { cloudUpload } from "../../utils/multer-cloud.js";
import { isValid } from "../../middelware/validation.js";
import { addBrandVal, deleteBrandVal, getSpecificBrandVal, updateBrandVal } from "./brand.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { addBrand, deleteBrand, getAllBrand, getBrandById, updateBrand } from "./brand.controller.js";


const brandRouter = Router();

// add brand  todo authentication,autherization
brandRouter.post('/',
    cloudUpload().single('logo'),
    isValid(addBrandVal),
    asyncHandler(addBrand)
)

// update brand  todo authentication,autherization
brandRouter.put('/:brandId',
    cloudUpload().single('logo'),
    isValid(updateBrandVal),
    asyncHandler(updateBrand)

)

// get all brand
brandRouter.get('/', asyncHandler(getAllBrand))

// get specific brand
brandRouter.get('/:brandId',isValid(getSpecificBrandVal), asyncHandler(getBrandById))

// delete brand  todo authentication,autherization
 brandRouter.delete('/:brandId',isValid(deleteBrandVal), asyncHandler(deleteBrand))


export default brandRouter;
