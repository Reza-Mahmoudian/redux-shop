import React, { useEffect } from "react";
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';

import { connect } from "react-redux";
import { toggleCart, addMultipleToCart } from '../../redux/actions';

import { idbPromise } from "../../utils/helpers";

import { useLazyQuery } from '@apollo/client';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = ({ state, toggleCart, addMultipleToCart}) => {
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);
  // for checkout session success
  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);
  // for cart items
  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      addMultipleToCart([...cart])
    };

    if (!state.cart.length) {
      getCart();
    }
  }, [state.cart.length, addMultipleToCart]);

  function calculateTotal() {
    let sum = 0;
    state.cart.forEach(item => {
      sum += item.price * item.quantity;
    });
    return sum.toFixed(2);
  }

  function submitCheckout() {
    const productIds = [];
    const productQtys = [];
  
    state.cart.forEach((item) => {
      console.log(item);
      //for (let i = 0; i < item.quantity; i++) {
        productIds.push(item._id);
        productQtys.push(item.quantity);
     //}
    });
    
    getCheckout({
      variables: { products: productIds, qtys: productQtys }
    });
  }

  if (!state.cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span
          role="img"
          aria-label="Shopping Cart">🛒</span>
      </div>
    );
  }

  return (
    <div className="cart">
  <div className="close" onClick={toggleCart}>[close]</div>
  <h2>Shopping Cart</h2>
  {state.cart.length ? (
    <div>
      {state.cart.map(item => (
        <CartItem key={item._id} item={item} />
      ))}
      <div className="flex-row space-between">
        <strong>Total: ${calculateTotal()}</strong>
        {
          Auth.loggedIn() ?
          <button onClick={submitCheckout}>
            Checkout
          </button>
            :
            <span>(log in to check out)</span>
        }
      </div>
    </div>
  ) : (
    <h3>
      <span role="img" aria-label="shocked">
        😱
      </span>
      You haven't added anything to your cart yet!
    </h3>
  )}
</div>
  );
};

const mapStateToProps = state => {
  return { state: state.CartFilter };
};

export default connect(
  mapStateToProps,
  { toggleCart, addMultipleToCart }
)(Cart);