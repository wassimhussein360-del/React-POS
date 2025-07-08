import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import generalReducer from "./slices/generalSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer, // Add the user reducer
      general: generalReducer,
      // products: productsReducer, // Add the products reducer
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
