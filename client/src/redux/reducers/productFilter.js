import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    SET_CURRENT_PRODUCT
} from "../actionTypes";

const initialState = {
    products: [],
    categories: [],
    currentCategory: '',
    currentProduct: ''
}

const ProductFilter = (state = initialState, action) => {
    switch (action.type) {
        // if action type value is the value of `SET_CURRENT_PRODUCT`, return a new state object with an updated products array
        case SET_CURRENT_PRODUCT:
            return {
                ...state,
                currentProduct: action.payload.product
            };
            // if action type value is the value of `UPDATE_PRODUCTS`, return a new state object with an updated products array
        case UPDATE_PRODUCTS:
            return {
                ...state,
                products: [...action.payload.products]
            };
            // if action type value is the value of `UPDATE_CATEGORIES`, return a new state object with an updated categories array
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.payload.categories]
            };
            // if action type value is the value of `UPDATE_CURRENT_CATEGORY`, return a new state object with an updated currentCategory value
        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.payload.currentCategory
            };

        default:
            return state;
    }
};

export default ProductFilter;