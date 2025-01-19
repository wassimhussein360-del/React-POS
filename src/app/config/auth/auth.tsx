"use client";

import { onAuthStateChanged } from "firebase/auth";
import { use, useEffect } from "react";
import { auth } from "../../../../firebaseConfig";
import FirestoreService from "@/servies/firestoreService";
import toast from "react-hot-toast";

const AuthService = () => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log({ user });
      if (user) {
        FirestoreService.getDocument("users", user.uid)
          .then((userData) => {
            console.log({ userData });
          })
          .catch((error) => {
            toast.error(error.message);
          });
      } else {
        toast.error("User not found");
      }
    });
  }, []);

  return <div></div>;
};

export default AuthService;
