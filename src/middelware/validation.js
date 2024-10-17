// import modules
import joi from 'joi';
import { APPError } from '../utils/appError.js';
import { discountTybes, orderStatus, paymentMethods } from '../utils/constant/enums.js';

const parseArray = (value, helper) => {
    let data = JSON.parse(value)
    let schema = joi.array().items(joi.string())
    const { error } = schema.validate(data, { abortEarly: false })
    if (error) { return helper(error.details) }
    return true
}
export const generalFields = {
    name: joi.string(),
    description: joi.string().max(2000),
    objectId: joi.string().hex().length(24),
    stock: joi.number().positive(),
    quantity: joi.number().positive(),
    price: joi.number().positive(),
    discount: joi.number(),
    discountTybe: joi.string().valid(...Object.values(discountTybes)),
    colors: joi.custom(parseArray),
    sizes: joi.custom(parseArray),
    rate: joi.number().min(1).max(5),
    email: joi.string().email(),
    phone: joi.string().pattern(new RegExp(/^01[0-2,5]{1}[0-9]{8}$/)),
    password: joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
    cPassword: joi.string().valid(joi.ref('password')),
    DOB: joi.string(),
    comment: joi.string().max(2000),
    rate: joi.number().min(1).max(5),
    code: joi.string().max(6),
    discountAmount: joi.number().positive(),
    fromDate: joi.date().greater(Date.now() - 24 * 60 * 60 * 1000),
    toDate: joi.date().greater(joi.ref('fromDate')),
    street: joi.string(),
    paymentMethod: joi.string().valid(...Object.values(paymentMethods)),
    orderStatus: joi.string().valid(...Object.values(orderStatus))
}

export const isValid = (schema) => {
    return (req, res, next) => {
        let data = { ...req.body, ...req.params, ...req.query }
        const { error } = schema.validate(data, { abortEarly: false })
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(new APPError(errorMessage, 400));

            //return next(new APPError(error.details, 400))
        }
        next()
    }
}