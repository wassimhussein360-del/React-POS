"use client";

import { useLoader, useUser, useVendor } from "@/reduxStore/hooks";
import { Spinner } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

const PageLoader = () => {
  const isLoading = useLoader();
  return isLoading ? (
    <div className="flex justify-center items-center w-screen h-screen bg-secondary absolute z-[99]">
      <Spinner />
      <p className="text-white ps-4 text-xl">Loading . . . </p>
    </div>
  ) : (
    <></>
  );
};

export default PageLoader;
