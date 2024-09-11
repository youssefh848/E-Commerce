import { brandRouter, categoryRouter, productRouter, subcategoryRouter } from "./modules/index.js"
import { globalErrorHandling } from "./utils/appError.js"

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
    // global error
    app.use(globalErrorHandling)
}