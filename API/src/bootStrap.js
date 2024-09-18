import { globalErrorHandling } from "./utils/appError.js"
import { authRouter, brandRouter, categoryRouter, productRouter, subcategoryRouter } from "./modules/index.js"

export const bootStrap = (app, express) => {
    // parse req
    app.use(express.json())
    // public filder
    app.use('/uploads', express.static('uploads'))
    // routing
    app.use('/product', productRouter)
    app.use('/category', categoryRouter)
    app.use('/subcategory', subcategoryRouter)
    app.use('/brand', brandRouter)
    app.use('/auth', authRouter)
    // global error
    app.use(globalErrorHandling)
}