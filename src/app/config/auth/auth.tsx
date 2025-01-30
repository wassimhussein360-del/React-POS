"use client";

import { onAuthStateChanged } from "firebase/auth";
import { use, useEffect } from "react";
import { auth } from "../../../../firebaseConfig";
import FirestoreService from "@/servies/firestoreService";
import toast from "react-hot-toast";
import { User, Vendor } from "@/app/abstraction/types";
import { useAppDispatch } from "@/reduxStore/hooks";
import { SetLoader, SetUser, SetVendor, SetVendors } from "@/reduxStore/slices/userSlice";
import { $getFromLocal, $getImgSrc, $writeOnLocal } from "@/app/helpers/helpers";
import { useRouter } from "next/navigation";

const AuthService = () => {
  const dispatch = useAppDispatch();
  const navigator = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        FirestoreService.getDocument("users", user.uid)
          .then((authUser) => {
            if (authUser) {
              const formattedUser = formatUser(authUser);
              dispatch(SetUser(formattedUser));
              if (formattedUser.isAdmin) {
                FirestoreService.getCollection("vendors").then((vendors) => {
                  const formattedVendors = formatVendors(vendors);

                  const localVendor = $getFromLocal("vendor");
                  const vendorToSave = localVendor || formattedVendors[2];

                  if (!localVendor) $writeOnLocal("vendor", vendorToSave);
                  dispatch(SetVendor(vendorToSave));
                  dispatch(SetLoader(false));
                  dispatch(SetVendors(formattedVendors));
                });
              }
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
      } else {
        navigator.push("/register");
      }
    });
  }, []);

  return <div></div>;
};

export default AuthService;

function formatUser(user: any): User {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    isAdmin: user.admin,
  };
}

function formatVendors(vendors: any[]): Vendor[] {
  console.log(vendors);

  return vendors.map((vendor) => {
    return {
      id: vendor.id,
      name: vendor.name.en,
      logo: $getImgSrc(vendor.id, vendor.logo[0], "w=500"),
      apiKey: vendor.apikey,
      defaultCurrency: vendor.defaultCurrency || "KWD",
      payments: vendor.payments,
    };
  });
}
