"use client";

import { useState, useEffect } from "react";
import CartInfo from "./components/card/card";
import Categories from "./components/categories/categories";
import Header from "./components/header/header";
import SubHeader from "./components/subHeader/subHeader";
import "./style.css";
import Products, { formatProducts } from "./components/products/products";

import { Item } from "./abstraction/types";
import FirestoreService from "@/servies/firestoreService";

export default function Home() {
  const [openCart, setOpenCart] = useState(true);
  const [allProducts, setAllProducts] = useState<Item[]>([]);
  const [categorizedProducts, setCategorizedProducts] = useState<Item[]>([]);

  useEffect(() => {
    FirestoreService.getSubcollection("vendors", "UVCVz6a9GWLzuRGnGVfx", "products").then(
      (fetchedProducts) => {
        const formattedProducts = formatProducts(fetchedProducts);
        setAllProducts(formattedProducts);
        setCategorizedProducts(formattedProducts);
      }
    );
  }, []);

  return (
    <div className="">
      <Header></Header>
      <SubHeader />
      <article className="flex justify-between ">
        <section className={`p-5 md:p-10 w-full   ${openCart && "hidden md:block"}`}>
          <Categories
            products={allProducts}
            setProducts={setCategorizedProducts}
            setAllProducts={setAllProducts}
          />
          <br />
          <Products products={categorizedProducts} />
        </section>
        <CartInfo className={`${openCart || "hidden md:block"}`} />
      </article>
    </div>
  );
}
