"use client";

import { useState } from "react";
import CartInfo from "./components/card/card";
import Categories from "./components/categories/categories";
import Header from "./components/header/header";
import SubHeader from "./components/subHeader/subHeader";
import "./style.css";
import Products from "./components/products/products";
import StoreProvider from "../reduxStore/storeProvider";
import { Toaster } from "react-hot-toast";
import { Item } from "./abstraction/types";

export default function Home() {
  const [openCart, setOpenCart] = useState(true);
  const [allProducts, setAllProducts] = useState<Item[]>([]);

  return (
    <StoreProvider>
      <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />
      <div className="">
        <Header></Header>
        <SubHeader />
        <article className="flex justify-between ">
          <section className={`p-5 md:p-10 w-full   ${openCart && "hidden md:block"}`}>
            <Categories products={allProducts} />
            <br />
            <Products emitProducts={setAllProducts} />
          </section>
          <CartInfo className={`${openCart || "hidden md:block"}`} />
        </article>
      </div>
    </StoreProvider>
  );
}
