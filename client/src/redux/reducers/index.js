import { combineReducers } from "redux";
import CartFilter from "./cartFilter";
import ProductFilter from "./productFilter";


export default combineReducers({ CartFilter, ProductFilter });