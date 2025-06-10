import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // The cart will hold an array of product objects
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      // Check if the product already exists in the cart
      const existingProduct = state.items.find(item => item.id === product.id);
      if (existingProduct) {
        // If product exists, increment the quantity
        existingProduct.quantity += 1;
      } else {
        // If product does not exist, add it to the cart with quantity 1
        state.items.push({ ...product, quantity: 1 });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },

    clearCart: (state) => {
      state.items = [];
    },

    // ✅ NEW - Increment
    incrementQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      }
    },

    // ✅ NEW - Decrement
    decrementQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },
});
export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
