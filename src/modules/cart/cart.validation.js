import joi from "joi";
import { generalFields } from "../../middelware/validation.js";

export const addToCartVal = joi.object({
    productId: generalFields.objectId.required(),
    quantity: generalFields.quantity.required()
})
export const deleteProductFromCartVal = joi.object({
    productId: generalFields.objectId.required()
})