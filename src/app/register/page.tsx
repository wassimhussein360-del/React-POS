"use client";

import LogIn from "./logIn";
import "./register.css";
import { RightSideComponent } from "./rightSide/rightSide";

export default function SimpleRegistrationForm() {
  return (
    <div className="flex h-screen">
      <LogIn className="w-full lg:w-1/2 flex-center bg-white rounded-none" />
      <span className="hidden lg:block w-1/2 bg-secondary">
        <RightSideComponent className="w-full " />
      </span>
    </div>
  );
}
