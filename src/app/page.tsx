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
import { useCartItems, useUser, useVendor } from "@/reduxStore/hooks";
import { Spinner } from "@material-tailwind/react";

export default function Home() {
  const [openCart, setOpenCart] = useState(true);
  const cartItems = useCartItems();
  const [allProducts, setAllProducts] = useState<Item[]>([]);
  const [categorizedProducts, setCategorizedProducts] = useState<Item[]>([]);

  const vendor = useVendor();
  const user = useUser();

  return (
    <div className="">
      {(!vendor || !user) && (
        <div className="flex-center w-screen h-screen bg-secondary absolute z-[99]">
          <Spinner />
          <p className="text-white ps-4 text-xl">Loading . . . </p>
        </div>
      )}
      <Header></Header>
      <SubHeader />
      <article className={` flex justify-between ${(!vendor || !user) && "hidden"}`}>
        <section className={`p-5 md:p-10 w-full   ${openCart && "hidden md:block"}`}>
          <Categories
            products={allProducts}
            setProducts={setCategorizedProducts}
            setAllProducts={setAllProducts}
          />
          <br />
          <Products products={categorizedProducts} />
        </section>
        <CartInfo
          className={`${!openCart ? "hidden md:block" : cartItems.length ? "" : "hidden"}`}
        />
      </article>
    </div>
  );
}
