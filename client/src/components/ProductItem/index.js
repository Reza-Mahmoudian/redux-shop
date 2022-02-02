import React from "react";
import { Link } from "react-router-dom";
import { pluralize } from "../../utils/helpers"

import { connect } from "react-redux";
import { addToCart, updateCartQuantity } from '../../redux/actions';
import { idbPromise } from "../../utils/helpers";

function ProductItem(props ){
  // ProductList passes individual properties for item and redux gives us objects
  // sort them all out below and build an item object manually
  const {
    image,
    name,
    _id,
    price,
    quantity,
    //objects below
    addToCart, updateCartQuantity , state
  } = props;
  const item = {
      image,
      name,
      _id,
      price,
      quantity
  }

  //const [state, dispatch] = useStoreContext();
  const { cart } = state;

  const doAddToCart = () => {
    // find the cart item with the matching id
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);
  
    // if there was a match, call UPDATE with a new purchase quantity
    if (itemInCart) {
      //dispatch({        type: UPDATE_CART_QUANTITY,        _id: _id,        quantity: parseInt(itemInCart.quantity) + 1      }); 
      updateCartQuantity({ _id, quantity: parseInt(itemInCart.quantity) + 1 });
      idbPromise('cart', 'put', {
        ...itemInCart,
        quantity: parseInt(itemInCart.quantity) + 1
      });
    } else {
      //dispatch({        type: ADD_TO_CART,        product: { ...item, quantity: 1 }      });
      addToCart({ ...item, quantity: 1 })
      idbPromise('cart', 'put', { ...item, quantity: 1 });
    }
  };

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={doAddToCart}>Add to cart</button>
    </div>
  );
}

const mapStateToProps = state => {
  return { state: state.CartFilter };
};

export default connect(
  mapStateToProps,
  { addToCart, updateCartQuantity }
)(ProductItem);
