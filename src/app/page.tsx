"use client";

import { useState, useEffect } from "react";
import CartInfo from "./components/card/card";
import Categories from "./components/categories/categories";
import SubHeader from "./components/subHeader/subHeader";
import "./style.css";
import Products from "./components/products/products";

import { Item } from "./abstraction/types";
import { useCartItems, useGeneral, useLoader, useUser, useVendor } from "@/reduxStore/hooks";
import { Drawer } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [openCart, setOpenCart] = useState(false);
  const cartItems = useCartItems();
  const [allProducts, setAllProducts] = useState<Item[]>([]);
  const [categorizedProducts, setCategorizedProducts] = useState<Item[]>([]);

  const navigator = useRouter();

  const vendor = useVendor();
  const user = useUser();
  const $general = useGeneral();

  const handleDrawer = () => setOpenCart(!openCart);

  useEffect(() => {
    setOpenCart(!!$general.cartDrawer);
  }, [$general.cartDrawer]);

  const isLoading = useLoader();
  if (isLoading) return;

  return (
    <div className="">
      <SubHeader />
      <article className={`flex justify-between ${(!vendor || !user) && "hidden"}`}>
        <section className={`p-5 md:p-10 w-full lg:mr-[350px]`}>
          <Categories
            products={allProducts}
            setProducts={setCategorizedProducts}
            setAllProducts={setAllProducts}
          />
          <br />
          <Products products={categorizedProducts} />
        </section>

        {/* Fixed CartInfo component */}
        <CartInfo className="hidden lg:block fixed right-0 top-36 h-[calc(100vh-9rem)] overflow-y-auto z-50" />

        {/* Drawer remains the same */}
        <Drawer
          placement="right"
          open={openCart}
          overlayProps={{ className: "fixed z-[9999]" }}
          onClose={handleDrawer}
          size={350}
          className="!max-h-screen overflow-y-auto lg:hidden block"
        >
          <CartInfo className={`${!openCart ? "hidden md:block" : ""}`} />
        </Drawer>
      </article>
    </div>
  );
}
