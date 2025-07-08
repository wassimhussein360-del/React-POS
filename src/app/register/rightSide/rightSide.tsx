import Image from "next/image";
import React from "react";
import logo from "../../../assets/logos/logogreen.svg";
import xImage from "../../../assets/images/auth-screens.svg";
import background from "../../../assets/images/authback.svg";

export const RightSideComponent: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`flex flex-col items-center w-full h-full ${className}`}
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundPosition: "center",
        backgroundSize: "110%",
      }}
    >
      <div className="head flex justify-between mt-9 items-center w-full px-10 relative">
        <Image src={logo} alt="Logo" />
        <p className="text-primary text-4xl font-sans ">Suite POS</p>
        <span></span>
      </div>

      <Image src={xImage} className="my-[10%]" alt="Auth screens" />

      <h2 className="text-white text-2xl font-bold text-center mb-7 font-sora">
        Empowering Commerce, Simplifying Success!
      </h2>
      <div className="desc text-sm text-white text-center leading-6 mb-8 font-sora">
        Revolutionize your <span className="text-[#61e4a3]">Online Business</span> with us!
        <br /> Our <span className="text-[#61e4a3]">eCommerce SaaS Solution</span> makes selling a
        breeze, transforming startups into success stories. <br />
        Scale smartly, sell globally, and turn your{" "}
        <span className="text-[#61e4a3]">Dreams Into Reality</span>.
      </div>
    </div>
  );
};
