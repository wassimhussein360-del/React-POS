import { $getSingularOrPlural } from "@/app/helpers/helpers";
import React from "react";
import allCategoriesIcon from "@/assets/images/categories.png";
import Image from "next/image";

interface SingleCategoryCardProps {
  className?: string;
  onClick: Function;
  category: {
    image: string;
    name: string;
    quantity: number;
  };
}

const SingleCategoryCard: React.FC<SingleCategoryCardProps> = ({
  category,
  className,
  onClick,
}) => {
  return (
    <figure
      className={`flex items-center flex-col  justify-center border aspect-square border-gray-300 rounded-xl  ${className}`}
      onClick={() => onClick()}
    >
      {category.image ? (
        <img src={category.image} className="h-1/2 w-1/2 rounded-xl object-cover" />
      ) : (
        <Image src={allCategoriesIcon} className="h-1/3  w-1/3  mb-5 " alt={""} />
      )}

      <h4 className="font-semibold mt-3 text-sm">{category.name}</h4>
      <p className="text-xs text-gray-500">
        {category.quantity} {$getSingularOrPlural("items", category.quantity)}
      </p>
    </figure>
  );
};

export default SingleCategoryCard;
