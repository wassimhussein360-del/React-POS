import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const useCartItems = () => useAppSelector((state) => state.cart.items);
export const useCart = () => useAppSelector((state) => state.cart);
export const useUser = () => useAppSelector((state) => state.user.user);
export const useVendors = () => useAppSelector((state) => state.user.vendors);
export const useVendor = () => useAppSelector((state) => state.user.vendor);
export const useLoader = () => useAppSelector((state) => state.user.isLoading);
export const useCustomer = () => useAppSelector((state) => state.cart.customer);
