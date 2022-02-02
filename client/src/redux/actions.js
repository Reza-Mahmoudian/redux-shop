import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    ADD_TO_CART,
    ADD_MULTIPLE_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    TOGGLE_CART,
    SET_CURRENT_PRODUCT
} from "./actionTypes";

export const setCurrentProduct = content => ({
    type: SET_CURRENT_PRODUCT,
    payload: {
        product: content
    }
});

export const updateProducts = content => ({
    type: UPDATE_PRODUCTS,
    payload: {
        products: [...content]
    }
});

export const updateCategories = content => ({
    type: UPDATE_CATEGORIES,
    payload: {
        categories: [...content]
    }
});

export const updateCurrentCategory = content => ({
    type: UPDATE_CURRENT_CATEGORY,
    payload: {
        currentCategory: content
    }
});

export const addToCart = content => ({
    type: ADD_TO_CART,
    payload: {
        cartOpen: true,
        product: content
    }
});

export const addMultipleToCart = content => ({
    type: ADD_MULTIPLE_TO_CART,
    payload: {
        cartOpen: true,
        products: [...content]
    }
});

export const removeFromCart = content => ({
    type: REMOVE_FROM_CART,
    payload: {
        _id: content
    }
});

export const updateCartQuantity = content => ({
    type: UPDATE_CART_QUANTITY,
    payload: {
        _id: content._id,
        quantity: content.quantity
    }
});

export const clearCart = () => ({
    type: CLEAR_CART,
    //payload: {}
});

export const toggleCart = () => ({
    type: TOGGLE_CART,
    //payload: {}
});