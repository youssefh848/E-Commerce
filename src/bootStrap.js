import { globalErrorHandling } from "./utils/appError.js"
import { authRouter, brandRouter, cartRouter, categoryRouter, couponRouter, orderRouter, productRouter, reviewRouter, subcategoryRouter, wishListRouter } from "./modules/index.js"

export const bootStrap = (app, express) => {
    // parse req
    // app.post('/webhook', express.raw({ type: 'application/json' }), webhook)
    app.use(express.json())
    // public filder
    app.use('/uploads', express.static('uploads'))
    // routing
    app.use('/product', productRouter)
    app.use('/category', categoryRouter)
    app.use('/subcategory', subcategoryRouter)
    app.use('/brand', brandRouter)
    app.use('/auth', authRouter)
    app.use('/review', reviewRouter)
    app.use('/coupon', couponRouter)
    app.use('/wishList', wishListRouter)
    app.use('/cart', cartRouter)
    app.use('/order', orderRouter)
    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "Route not found " })
    })
    // global error
    app.use(globalErrorHandling)
}