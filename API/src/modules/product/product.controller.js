import slugify from "slugify"
import { Brand, Product, Subcategory } from "../../../DB/index.js"
import { APPError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messaeges.js"
import cloudinary from "../../utils/cloud.js"

// add product
const addProduct = async (req, res, next) => {
    // get data form req
    const { name, price, description, stock, discount, discountType, colors, sizes, brand, category, subcategory } = req.body
    // check existence 
    // 1- brand 
    const brandExist = await Brand.findById(brand)
    if (!brandExist) {
        return next(new APPError(messages.brand.notExist, 404))
    }
    // 2- subcategory 
    const subcategoryExist = await Subcategory.findById(subcategory)
    if (!subcategoryExist) {
        return next(new APPError(messages.subcategory.notExist, 404))
    }
    // upload images
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.mainImage[0].path,
        { folder: '/E-Commerce/product/main-image' }
    )
    let mainImage = { secure_url, public_id }
    
    /*  const images = req.files.mainImage.map((image) => {
        const { secure_url, public_id } = cloudinary.uploader.upload(image.path, 
        { folder: '/E-Commerce/product/main-image',}
        )
        return { secure_url, public_id }
        }) */
    /*  
     req.files.subImages.forEach(async (image) => {
         const { secure_url, public_id } = await cloudinary.uploader.upload(image.path,
             { folder: '/E-Commerce/product/sub-images' }
         )
         subImages.push({ secure_url, public_id })
     }) */
    let subImages = []
    for (const file of req.files.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
            { folder: '/E-Commerce/product/sub-images' })
        subImages.push({ secure_url, public_id })
    }

    // prepare data
    const slug = slugify(name)
    const product = new Product({
        name,
        slug,
        price,
        description,
        stock,
        discount,
        discountType,
        colors: JSON.parse(colors),
        sizes: JSON.parse(sizes),
        brand,
        category,
        subcategory,
        mainImage,
        subImages,
        // todo createdBy updatedBy
    })
    // add to db 
    const createdProduct = await product.save()
    // handel fail
    if (!createdProduct) {
        // todo rollback multi image
        failImage = { secure_url, public_id }
        req.subImages = subImages.map(image => image.public_id);  // Store only public_ids in req.subImages
        return next(new APPError(messages.product.failToCreate, 500))
    }
    // send res
    return res.status(201).json({
        message: messages.product.created,
        success: true,
        data: createdProduct
    })
}

export {
    addProduct,
}