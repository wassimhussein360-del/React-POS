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
import { useCartItems, useLoader, useUser, useVendor } from "@/reduxStore/hooks";
import { Spinner } from "@material-tailwind/react";
import PageLoader from "./components/pageLoader/pageLoader";
import { useRouter } from "next/navigation";

export default function Home() {
  const [openCart, setOpenCart] = useState(true);
  const cartItems = useCartItems();
  const [allProducts, setAllProducts] = useState<Item[]>([]);
  const [categorizedProducts, setCategorizedProducts] = useState<Item[]>([]);

  const navigator = useRouter();

  const vendor = useVendor();
  const user = useUser();

  const isLoading = useLoader();
  if (isLoading) return;

  return (
    <div className="">
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
        <CartInfo className={`${!openCart ? "hidden md:block" : ""}`} />
      </article>
    </div>
  );
}
