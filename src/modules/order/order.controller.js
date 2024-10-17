import Stripe from "stripe";
import { Cart, Coupon, Order, Product } from "../../../DB/index.js";
import { APPError } from "../../utils/appError.js";
import { discountTybes, paymentMethods, roles } from "../../utils/constant/enums.js";
import { messages } from "../../utils/constant/messaeges.js";
import { ApiFeature } from "../../utils/apiFeatures.js";

// create order 
const creatOrder = async (req, res, next) => {
    // get data from req 
    const { phone, street, coupon, paymentMethod } = req.body;
    const user = req.authUser._id;
    // check coupon 
    let couponExist = null;
    if (coupon) {
        couponExist = await Coupon.findOne({ code: coupon })
        if (!couponExist) {
            return next(new APPError(messages.coupon.notExist, 404))
        }
        // Check if coupon is within the valid date range
        const currentDate = new Date();
        if (currentDate < new Date(couponExist.fromDate) || currentDate > new Date(couponExist.toDate)) {
            return next(new APPError(messages.coupon.couponExpired, 400));
        }

        // Check if coupon is assigned to specific users
        if (couponExist.assignedUsers && couponExist.assignedUsers.length > 0) {
            const isAssigned = couponExist.assignedUsers.includes(user);
            if (!isAssigned) {
                return next(new APPError(messages.coupon.notAssigned, 403));
            }
        }
    }
    // check cart 
    const cart = await Cart.findOne({ user })
    if (!cart) {
        return next(new APPError(messages.user.notHaveCart, 400))
    }
    const products = cart.products
    let orderPrice = 0
    let finalPrice = 0
    let orderProducts = []
    // check products
    for (const product of products) {
        const productExist = await Product.findById(product.productId)
        if (!productExist) {
            return next(new APPError(messages.product.notExist, 404))
        }
        if (!productExist.inStock(product.quantity)) {
            return next(new APPError(messages.product.stockNotEnough, 404))
        }
        // calculate order price
        orderPrice += productExist.finalPrice * product.quantity
        orderProducts.push({
            productId: productExist._id,
            price: productExist.price,
            finalPrice: productExist.finalPrice,
            quantity: product.quantity,
            discount: productExist.discount,
            name: productExist.name,
            mainImage: {
                secure_url: productExist.mainImage.secure_url,
                public_id: productExist.mainImage.public_id
            }
        })
    }
    // Apply coupon discount if exists
    if (couponExist) {
        if (couponExist.discountType === discountTybes.FIXED_AMOUNT) {
            finalPrice = Math.max(orderPrice - couponExist.discountAmount, 0); // Ensure final price is not negative
        } else {
            // Percentage-based discount
            finalPrice = orderPrice - (orderPrice * (couponExist.discountAmount / 100));
            finalPrice = Math.max(finalPrice, 0); // Ensure final price is not negative
        }
    } else {
        finalPrice = orderPrice;
    }
    // creat order
    const order = new Order({
        user,
        phone,
        address: { phone, street },
        ...(couponExist && {
            coupon: {
                couponId: couponExist._id,
                code: coupon,
                discount: couponExist.discountAmount
            }
        }),
        paymentMethod,
        products: orderProducts,
        orderPrice,
        finalPrice
    })
    // add to db 
    const createdOrder = await order.save()
    // After creating the order, delete the cart
    await Cart.deleteOne({ user });
    // integrate payment getway
    if (paymentMethod == paymentMethods.VISA) {
        const stripe = new Stripe(process.env.STRIBE_SECRET_KEY)
        const checkout = await stripe.checkout.sessions.create({
            success_url: 'https://google.com',
            cancel_url: 'https://facebook.com',
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: createdOrder.products.map(
                product => ({
                    price_data: {
                        currency: 'egp',
                        unit_amount: product.finalPrice * 100,
                        product_data: {
                            name: product.name,
                            images: [product.mainImage.secure_url]
                        }
                    },
                    quantity: product.quantity
                })
            )
        })
        return res.status(200).json({
            message: messages.order.created,
            success: true,
            data: createdOrder,
            url: checkout.url
        })
    }
    // handel fail 
    if (!createdOrder) {
        return next(new APPError(messages.order.failToCreate, 500))
    }
    // send res
    return res.status(200).json({
        message: messages.order.created,
        success: true,
        data: createdOrder
    })
}

// update order 
const updateOrder = async (req, res, next) => {
    // get data from req 
    const { orderId } = req.params;
    const { phone, street, paymentMethod, status } = req.body;
    const user = req.authUser._id;
    const userRole = req.authUser.role;
    // check if order exist
    const orderExist = await Order.findById(orderId)
    if (!orderExist) {
        return next(new APPError(messages.order.notExist, 404))
    }
    // Check if the user is not an admin and the order doesn't belong to them
    if (userRole !== roles.ADMIN && !orderExist.user.equals(user)) {
        return next(new APPError(messages.user.unauthorized, 403));
    }
    // Allow admins to update the order status, if provided
    if (userRole === roles.ADMIN && status) {
        orderExist.status = status;
    }
    // update fields if provides
    if (phone) orderExist.address.phone = phone
    if (street) orderExist.address.street = street
    // Update payment method if provided
    if (paymentMethod) {
        orderExist.paymentMethod = paymentMethod;
    }
    // save update 
    const updatedOrder = await orderExist.save();
    // handel fail
    if (!updatedOrder) {
        return next(new APPError(messages.order.failToUpdate, 404));
    }
    // send res
    res.status(200).json({
        message: messages.order.updated,
        success: true,
        data: updatedOrder
    })
}

// get orders
const getOrders = async (req, res, next) => {
    // get data from req 
    const user = req.authUser._id;
    const userRole = req.authUser.role;

    let apiFeature;
    // get orders for user 
    if (userRole === roles.USER) {
        apiFeature = new ApiFeature(Order.find({ user }), req.query).filter().sort().select().pagination();
    }
    // get all orders for admin
    if (userRole === roles.ADMIN) {
        apiFeature = new ApiFeature(Order.find(), req.query).filter().sort().select().pagination();
    }

    // fetch orders 
    const orders = await apiFeature.mongooseQuery;
    // send res
    res.status(200).json({
        message: messages.order.fetchedSuccessfully,
        success: true,
        data: orders
    })
}

// getOrderById
const getOrderById = async (req, res, next) => {
    // get data from req
    const user = req.authUser._id;
    const userRole = req.authUser.role;
    const { orderId } = req.params;

    // Find the order by ID
    let order = await Order.findById(orderId);
    if (!order) {
        return next(new APPError(messages.order.notExist, 404));
    }
    // Check if the user is authorized to view the order
    if (userRole === roles.USER && !order.user.equals(user)) {
        return next(new APPError(messages.user.unauthorized, 403));
    }
    // Send the response
    res.status(200).json({
        message: messages.order.fetchedSuccessfully,
        success: true,
        data: order
    });
}

// delete order
const deleteOrder = async (req, res, next) => {
    // get data from req
    const { orderId } = req.params;
    const user = req.authUser._id;
    const userRole = req.authUser.role;

    // Check if the order exists
    const orderExist = await Order.findById(orderId);
    if (!orderExist) {
        return next(new APPError(messages.order.notExist, 404));
    }
    // Check if the user is authorized to delete the order
    if (userRole !== roles.ADMIN && !orderExist.user.equals(user)) {
        return next(new APPError(messages.user.unauthorized, 403));
    }
    // Perform deletion
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
        return next(new APPError(messages.order.failToDelete, 500));
    }
    // Send response
    res.status(200).json({
        message: messages.order.deleted,
        success: true
    });
}

export {
    creatOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
}