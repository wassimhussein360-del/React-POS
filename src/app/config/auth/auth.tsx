"use client";

import { onAuthStateChanged } from "firebase/auth";
import { use, useEffect } from "react";
import { auth } from "../../../../firebaseConfig";
import FirestoreService from "@/servies/firestoreService";
import toast from "react-hot-toast";
import { User, Vendor } from "@/app/abstraction/types";
import { useAppDispatch } from "@/reduxStore/hooks";
import { SetLoader, SetUser, SetVendor, SetVendors } from "@/reduxStore/slices/userSlice";
import { $getFromLocal, $getImgSrc, $translate, $writeOnLocal } from "@/app/helpers/helpers";
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

              let condition = {};
              if (!formattedUser.isAdmin) {
                condition = {
                  whereConditions: [{ field: "id", operator: "in", value: authUser.vendorIds }],
                };
              }

              FirestoreService.getCollection("vendors", condition).then((vendors) => {
                const formattedVendors = formatVendors(vendors);

                const localVendor = $getFromLocal("vendor");
                const vendorToSave = localVendor || formattedVendors[0];

                dispatch(
                  SetUser({
                    ...formattedUser,
                    permissions: formattedUser.isAdmin
                      ? undefined
                      : vendorToSave.users.find((u: any) => u.id == formattedUser.id).permissions,
                  })
                );

                if (!localVendor) $writeOnLocal("vendor", vendorToSave);
                dispatch(SetVendor(vendorToSave));
                dispatch(SetLoader(false));
                dispatch(SetVendors(formattedVendors));
              });
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
    role: user.role,
    image: user.image || "https://www.webiconio.com/_upload/255/image_255.svg",
  };
}

function formatVendors(vendors: any[]): Vendor[] {
  return vendors.map((vendor) => {
    const payments = { ...vendor.payments };
    Object.keys(payments).forEach((key) => {
      if (!payments[key].active) {
        delete payments[key];
        return;
      }
      if (payments[key].methods?.length) {
        payments[key].methods = payments[key].methods.filter((m) => m.active);
      }
    });
    return {
      id: vendor.id,
      name: $translate(vendor.name),
      logo: $getImgSrc(vendor.id, vendor.logo[0], "w=500"),
      apiKey: vendor.apikey,
      defaultCurrency: vendor.defaultCurrency || "KWD",
      payments,
      users: vendor.users || [],
    };
  });
}
