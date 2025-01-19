"use client";

import LogIn from "./logIn";
import "./register.css";

export default function SimpleRegistrationForm() {
  return (
    <div className="flex justify-center items-center h-screen">
      <LogIn />
      <div className="area">
        <ul className="circles">
          {new Array(10).fill(0).map((_, i) => {
            return <li key={i}></li>;
          })}
        </ul>
      </div>
    </div>
  );
}
