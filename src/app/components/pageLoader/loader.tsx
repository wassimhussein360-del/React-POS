import React from "react";
import logoLoader from "../../../assets/gifs/Menasa loader.gif";
import Image from "next/image";

const Loader: React.FC = () => {
  return (
    <article id="my-loader" className="hidden">
      <div className="bg-white flex-center bg-opacity-40  h-full top-0 w-full overflow-hidden z-[99999] fixed">
        <div className="relative">
          <Image src={logoLoader} className="w-[4rem]" alt="Auth screens" />
        </div>{" "}
      </div>
    </article>
  );
};

export default Loader;
