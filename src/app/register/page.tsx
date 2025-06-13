"use client";

import { useEffect } from "react";
import LogIn from "./logIn";
import "./register.css";
import { RightSideComponent } from "./rightSide/rightSide";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

import { useAppDispatch } from "@/reduxStore/hooks";
import { SetLoader } from "@/reduxStore/slices/userSlice";

export default function SimpleRegistrationForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(SetLoader(false));
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch(SetLoader(false));
    });

    return () => unsubscribe(); // cleanup on unmount
  }, [router]);

  return (
    <div className="flex h-screen">
      <LogIn className="w-full lg:w-1/2 flex-center bg-white rounded-none" />
      <span className="hidden lg:block w-1/2 bg-secondary">
        <RightSideComponent className="w-full " />
      </span>
    </div>
  );
}
