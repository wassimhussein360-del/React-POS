import { Chevron } from "@/assets/icons";
import React, { useEffect, useState } from "react";
import SingleProduct from "./singleProduct";
import { Item, Modifier } from "@/app/abstraction/types";
import FirestoreService from "@/servies/firestoreService";
import ProductSkeleton from "./productSkeletone";

interface ProductProps {
  emitProducts: React.Dispatch<React.SetStateAction<Item[]>>;
}

const Products: React.FC<ProductProps> = ({ emitProducts }) => {
  const [products, setProducts] = useState<Item[]>([]);
  useEffect(() => {
    FirestoreService.getSubcollection("vendors", "UVCVz6a9GWLzuRGnGVfx", "products").then(
      (fetchedProducts) => {
        const formattedProducts = formatProducts(fetchedProducts);
        setProducts(formattedProducts);
        emitProducts(formattedProducts);
      }
    );
  }, []);

  return (
    <article>
      <section className="flex justify-between items-center mb-4">
        <h4 className="font-semibold ">Products</h4>
        <aside className="flex gap-4 ">
          <Chevron className="  rotate-90 w-4 h-4 cursor-pointer" />
          <Chevron className=" -rotate-90 w-4 h-4 cursor-pointer" />
        </aside>
      </section>
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6  gap-5">
        {products.length
          ? products.map((pr, i) => {
              return <SingleProduct key={i} product={pr} />;
            })
          : new Array(10).fill(0).map(() => {
              return <ProductSkeleton />;
            })}
      </section>
    </article>
  );
};

export default Products;

const formatProducts = (products: any[]): Item[] => {
  const formattedProducts = products
    .filter((product) => product.stockQuantity > 0)
    .map((product) => {
      return {
        id: product.id,
        name: product.name.en,
        price: product.price,
        quantity: 1,
        barcode: product.id,
        stock: product.stockQuantity,
        modifiers:
          product.assignedModifiers
            .filter((assignedMd: any) => assignedMd.active && assignedMd.list.length > 0)
            .map((md: any) => {
              if (!md.active) return;

              const modifier: Modifier = {
                type: md.type,
                required: md.required,
                multiple: md.multiple,
                name: md.name?.en || md.nameEn,

                options: md.list
                  .filter((filterOption: any) => filterOption.active)
                  .map((opt: any) => {
                    if (!opt.active) return;

                    return {
                      name: opt.name?.en || opt.nameEn,
                      price: parseFloat(opt.price || "0"),
                      value: opt.color || undefined,
                    };
                  }),
              };

              if (modifier.multiple) {
                modifier.min = parseInt(md.minSelection);
                modifier.max = parseInt(md.maxSelection);
              }

              return modifier;
            }) || [],

        category: product.categories.map((cat: any) => cat.name.en).join(", "),
        categoryId: product.categories.map((cat: any) => cat.id).join(", "),
        image: product.images[0].url,
      };
    });

  return formattedProducts;
};
