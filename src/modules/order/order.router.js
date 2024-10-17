import { Router } from "express";
import { isAuthenticated } from "../../middelware/authentication.js";
import { isAuthorized } from "../../middelware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middelware/validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { createOrderVal, getOrderByIdVal, updateOrderVal } from "./order.validation.js";
import { creatOrder, deleteOrder, getOrderById, getOrders, updateOrder } from "./order.controller.js";

const orderRouter = Router()

// creat order
orderRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    isValid(createOrderVal),
    asyncHandler(creatOrder)
)

// update order
orderRouter.put('/:orderId',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    isValid(updateOrderVal),
    asyncHandler(updateOrder)
)

// get orders 
orderRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    asyncHandler(getOrders)
)

// getOrderById
orderRouter.get('/:orderId',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    isValid(getOrderByIdVal),
    asyncHandler(getOrderById)
)

// delete order
orderRouter.delete('/:orderId',
    isAuthenticated(),
    isAuthorized([roles.USER, roles.ADMIN]),
    isValid(getOrderByIdVal),
    asyncHandler(deleteOrder)
)




export default orderRouter;