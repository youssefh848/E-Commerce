import { Router } from "express";
import { isAuthenticated } from "../../middelware/authentication.js";
import { isAuthorized } from "../../middelware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middelware/validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { addWishListVal, deleteWishListVal } from "./wishList.validation.js";
import { addWishList, deleteWishList, getWishList } from "./wishList.controller.js";


const wishListRouter = Router();

// add wishLsit
wishListRouter.post('/:productId',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    isValid(addWishListVal),
    asyncHandler(addWishList)
)

// get wishList
wishListRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    asyncHandler(getWishList)
)

// delete product in wishList
wishListRouter.delete('/:productId',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    isValid(deleteWishListVal),
    asyncHandler(deleteWishList)
)


export default wishListRouter;