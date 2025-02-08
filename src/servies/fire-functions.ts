import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebaseConfig";

export const createCustomerAddress = httpsCallable(functions, "createCustomerAddress");
export const createCustomer = httpsCallable(functions, "createOrGetCustomer");
export const updateOrderStatus = httpsCallable(functions, "updateOrderStatus");
export const createOrder = httpsCallable(functions, "createOrder");
