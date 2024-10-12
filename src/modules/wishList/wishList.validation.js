import joi from "joi";
import { generalFields } from "../../middelware/validation.js";

export const addWishListVal = joi.object({
    productId: generalFields.objectId.required()
})
export const deleteWishListVal = joi.object({
    productId: generalFields.objectId.required()
})