import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';

import Cart from '../components/Cart';
import { connect } from "react-redux";
import { addToCart, removeFromCart, updateCartQuantity, updateProducts, setCurrentProduct } from '../redux/actions';

import { idbPromise } from "../utils/helpers";

function Detail({ state, addToCart, removeFromCart, updateCartQuantity, updateProducts, setCurrentProduct }) {
    
    const { id } = useParams();
   
    const { loading, data } = useQuery(QUERY_PRODUCTS);
    const { products, currentProduct, cart } = state;

    useEffect(() => {
        // already in global store
        if (products.length) {
            setCurrentProduct(products.find(product => product._id === id));
        }
        // retrieved from server
        else if (data) {
            updateProducts(data.products);
            data.products.forEach((product) => {
                idbPromise('products', 'put', product);
            });
        }
        // get cache from idb
        else if (!loading) {
            idbPromise('products', 'get').then((indexedProducts) => {
                updateProducts(indexedProducts);
            });
        }
    }, [products, data, loading, updateProducts, setCurrentProduct, id]);

    const doAddToCart = () => {
        const itemInCart = cart.find((cartItem) => cartItem._id === id);


        if (itemInCart) {
            updateCartQuantity({_id: id, quantity: parseInt(itemInCart.quantity) + 1});
            // if we're updating quantity, use existing item data and increment quantity value by one
            idbPromise('cart', 'put', {
                ...itemInCart,
                quantity: parseInt(itemInCart.quantity) + 1
            });
        } else {
            addToCart({...currentProduct, quantity: 1 });
            // if product isn't in the cart yet, add it to the current shopping cart in IndexedDB
            idbPromise('cart', 'put', {...currentProduct, quantity: 1 });
        }
    };

    const doRemoveFromCart = () => {
        removeFromCart(currentProduct._id)
        // upon removal from cart, delete the item from IndexedDB using the `currentProduct._id` to locate what to remove
        idbPromise('cart', 'delete', {...currentProduct });
    };

    return ( <> {
            currentProduct ? ( 
                <div className = "container my-1" >
                <Link to = "/" > ←Back to Products </Link>

                <h2> { currentProduct.name } </h2>
                <p> { currentProduct.description } </p>
                <p><strong > Price: </strong>${currentProduct.price}{' '} 
                <button onClick = { doAddToCart } > Add to Cart </button> 
                <button disabled = {!cart.find(p => p._id === currentProduct._id) }
                onClick = { doRemoveFromCart } >
                Remove from Cart </button> </p>

                <img src = { `/images/${currentProduct.image}` }
                alt = { currentProduct.name }/>
                </div>
            ) : null
        } { loading ? < img src = { spinner }
            alt = "loading" / >: null } 
            <Cart />
        </>
    );
}

const mapStateToProps = state => {
    // Details need access to both Cart and Product state props
    return { state: {...state.CartFilter, ...state.ProductFilter }};
  };
  
  export default connect(
    mapStateToProps,
    { addToCart, removeFromCart, updateCartQuantity, updateProducts, setCurrentProduct }
  )(Detail);