import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebaseConfig";

export const createCustomerAddress = httpsCallable(functions, "createCustomerAddress");
export const createCustomer = httpsCallable(functions, "createOrGetCustomer");
