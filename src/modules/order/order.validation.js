import joi from "joi";
import { generalFields } from "../../middelware/validation.js";

export const createOrderVal = joi.object({
    phone: generalFields.phone.required(),
    street: generalFields.street.required(),
    paymentMethod: generalFields.paymentMethod,
    coupon: generalFields.code
})

export const updateOrderVal = joi.object({
    orderId: generalFields.objectId.required(),
    phone: generalFields.phone.optional(),
    street: generalFields.street.optional(),
    paymentMethod: generalFields.paymentMethod.optional(),
    status: generalFields.orderStatus.optional()
})

export const getOrderByIdVal = joi.object({
    orderId: generalFields.objectId.required()
})