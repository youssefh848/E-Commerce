
const generateMessage = (entity) => ({
    alreadyExist: `${entity} already exist`,
    notExist: `${entity} not found`,
    created: `${entity} created successfully`,
    failToCreate: `Failed to create ${entity}`,
    updated: `${entity} updated successfully`,
    failToUpdate: `Failed to update ${entity}`,
    deleted: `${entity} deleted successfully`,
    failToDelete: `Failed to delete ${entity}`,
    fetchedSuccessfully: `${entity} fetched successfully`,

})
export const messages = {
    category: generateMessage('category'),
    subcategory: generateMessage('subcategory'),
    brand: generateMessage('brand'),
    file: { required: 'file is required' },
    product: {
        ...generateMessage('product'),
        stockNotEnough: 'stock is not enough',
        addedToCart: 'product added to cart successfully',
        failToAddToCart: 'Failed to add product to cart',
        deletedFromCart: 'product deleted from cart successfully',
        notExistInCart: 'product not exist in cart',
    },
    order: generateMessage('order'),
    wishList: generateMessage('wishList'),
    user: {
        ...generateMessage('user'),
        verified: "user verified successfully",
        invalidCredntiols: "invalid Credntiols",
        notVerified: "not Verified",
        loginSuccessfully: "login successfully",
        unauthorized: "unauthorized to access this api"
    },
    review: generateMessage('review'),
    coupon: {
        ...generateMessage('coupon'),
        discountAmount: "must be less than 100",
    }
}