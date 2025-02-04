import { Spinner } from "@material-tailwind/react";
import React from "react";

const Loader: React.FC = () => {
  return (
    <article id="my-loader" className="hidden">
      <div className="bg-white flex-center bg-opacity-40  h-full top-0 w-full overflow-hidden z-10 fixed">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-100"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-primary animate-spin"></div>
        </div>{" "}
      </div>
    </article>
  );
};

export default Loader;
