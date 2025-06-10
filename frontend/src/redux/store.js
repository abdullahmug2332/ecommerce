import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productsSlice from "./productsSlice";
import cartReducer from './cartSlice';


// ✅ Load cart from localStorage
const loadFromLocalStorage = () => {
  try {
    const state = localStorage.getItem('cartState');
    return state ? JSON.parse(state) : undefined;
  } catch (e) {
    console.warn("Could not load cart from localStorage:", e);
    return undefined;
  }
};

// ✅ Save cart to localStorage
const saveToLocalStorage = (state) => {
  try {
    const cartState = {
      cart: state.cart,
    };
    localStorage.setItem('cartState', JSON.stringify(cartState));
  } catch (e) {
    console.warn("Could not save cart to localStorage:", e);
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsSlice,
    cart: cartReducer,
  },
   preloadedState: loadFromLocalStorage(),
});

// ✅ Subscribe to changes
store.subscribe(() => {
  saveToLocalStorage(store.getState());
});
