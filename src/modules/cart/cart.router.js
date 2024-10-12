import { Router } from "express";
import { isAuthenticated } from "../../middelware/authentication.js";
import { isAuthorized } from "../../middelware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middelware/validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { addToCartVal, deleteProductFromCartVal } from "./cart.validation.js";
import { addToCart, deleteProductFromCart, getCart } from "./cart.controller.js";

const cartRouter = Router();

// add to cart
cartRouter.put('/',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    isValid(addToCartVal),
    asyncHandler(addToCart)
)

// get cart 
cartRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    asyncHandler(getCart)
)

// delte product from cart
cartRouter.delete('/:productId',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    isValid(deleteProductFromCartVal),
    asyncHandler(deleteProductFromCart)
)

export default cartRouter;