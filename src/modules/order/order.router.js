import { Router } from "express";
import { isAuthenticated } from "../../middelware/authentication.js";
import { isAuthorized } from "../../middelware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middelware/validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { createOrderVal } from "./order.validation.js";
import { creatOrder } from "./order.controller.js";

const orderRouter = Router()

// creat order
orderRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    isValid(createOrderVal),
    asyncHandler(creatOrder)
)

export default orderRouter;