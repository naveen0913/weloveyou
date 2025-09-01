
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slices/authSlice";
import cartSlice from "./Slices/cartSlice";

export const store = configureStore({
    reducer: {
      auth: authSlice,
    //   products: productsSlice,
      cart: cartSlice,
    },
  });
  
  export default store;