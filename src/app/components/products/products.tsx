import { Chevron } from "@/assets/icons";
import React, { useEffect } from "react";
import SingleProduct from "./singleProduct";
import { Item, Modifier } from "@/app/abstraction/types";
import FirestoreService from "@/servies/firestoreService";
import ProductSkeleton from "./productSkeletone";

interface ProductProps {
  products: Item[];
}

const Products: React.FC<ProductProps> = ({ products }) => {
  return (
    <article>
      <section className="flex justify-between items-center mb-4">
        <h4 className="font-semibold ">Products</h4>
        <aside className="flex gap-4 ">
          <Chevron className="  rotate-90 w-4 h-4 cursor-pointer" />
          <Chevron className=" -rotate-90 w-4 h-4 cursor-pointer" />
        </aside>
      </section>
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6  gap-5  grid-flow-row grid-rows-2 custom-grid">
        {products.length
          ? products.map((pr, i) => {
              return <SingleProduct key={i} product={pr} />;
            })
          : new Array(10).fill(0).map((num, index: number) => {
              return <ProductSkeleton key={index} />;
            })}
      </section>
    </article>
  );
};

export default Products;

export const formatProducts = (products: any[], vendorId: string, outletId: string): Item[] => {
  const formattedProducts = products
    .filter((product) => product.stockQuantity > 0 && product.branchesIds.includes(outletId))
    .map((product) => {
      return {
        ...product,
        modifiers:
          product.assignedModifiers
            .filter((assignedMd: any) => assignedMd.active && assignedMd.list.length > 0)
            .map((md: any) => {
              if (!md.active) return;

              return {
                ...md,
                list: md.list
                  .filter((filterOption: any) => filterOption.active)
                  .map((opt: any) => {
                    if (opt.active) return opt;
                  }),
              };
            }) || [],
      };
    });

  return formattedProducts;
};
