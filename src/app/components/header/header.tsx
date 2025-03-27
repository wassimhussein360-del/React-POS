"use client";

import { Bag, Chevron, OutIcon } from "@/assets/icons";
import { Badge, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import { Select, Option } from "@material-tailwind/react";

import "./header.css";
import {
  useAppDispatch,
  useCart,
  useGeneral,
  useUser,
  useVendor,
  useVendors,
} from "@/reduxStore/hooks";
import { use, useEffect, useState } from "react";
import { $getFromLocal, $toTitleCase, $writeOnLocal } from "@/app/helpers/helpers";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "../../../../firebaseConfig";
import { SetVendor } from "@/reduxStore/slices/userSlice";
import { Item, Vendor } from "@/app/abstraction/types";
import { ActivateCart, VoidCart } from "@/reduxStore/slices/cartSlice";
import FirestoreService from "@/servies/firestoreService";
import { SetGeneralField } from "@/reduxStore/slices/generalSlice";
import { refactorOrder } from "../card/factoryMethod";

export default function Header() {
  const dispatch = useAppDispatch();
  const user = useUser();
  const vendors = useVendors();

  const $vendor = useVendor();
  const $general = useGeneral();
  const $cart = useCart();
  const navigator = useRouter();
  const pathname = usePathname();

  const [vendor, setVendor] = React.useState<any>();

  const [outlets, setOutlets] = React.useState<Array<any>>([]);

  useEffect(() => {
    if (!vendor && $vendor) {
      setVendor($vendor);
    }
    if ($vendor) {
      FirestoreService.getSubcollection("vendors", $vendor.id, "outlets", {
        whereConditions: [{ field: "active", operator: "==", value: true }],
      }).then((_outlets) => {
        const storedOutlet = $getFromLocal("branch");
        const selectedOutlet =
          storedOutlet && _outlets.some((ou) => ou.id === storedOutlet.id)
            ? storedOutlet
            : _outlets[0];

        dispatch(
          SetGeneralField({
            field: "outlets",
            value: _outlets,
          })
        );

        setOutlets(() => _outlets);
        onOutletSelect(selectedOutlet.id, selectedOutlet);
      });
    }
  }, [$vendor]);

  useEffect(() => {
    if (!$vendor?.id && !$general.branch.id) return;

    let getLocalCarts = $getFromLocal("carts") || {};
    const cartKey = `${$vendor?.id}_${$general.branch.id}`;
    const foundCart = getLocalCarts[cartKey]?.find((_cart: any) => _cart.active);

    if (foundCart) {
      dispatch(ActivateCart({ cart: foundCart }));
    } else {
      dispatch(VoidCart());
    }
  }, [$general.branch]);

  useEffect(() => {
    if (!$vendor || !outlets) return;
    const refactoredOrder = refactorOrder($cart, $general);

    dispatch(
      SetGeneralField({
        field: "order",
        value: refactoredOrder.order,
      })
    );
  }, [$cart]);

  const signOut = () => {
    localStorage.clear();

    auth.signOut();
    window.location.reload();
  };

  const onStoreSelect = (id: Vendor) => {
    const newVendor = vendors.find((v) => v.id === id);
    setVendor(newVendor);
    dispatch(SetVendor(newVendor));
    $writeOnLocal("vendor", newVendor);

    window.location.reload();
  };

  const onOutletSelect = (id: string, branch?: any) => {
    const newOutlet = branch ? branch : outlets.find((o) => o.id === id);
    $writeOnLocal("branch", newOutlet);
    dispatch(
      SetGeneralField({
        field: "branch",
        value: newOutlet,
      })
    );
  };

  const getSelectVendorMenu = (className: string) => {
    return (
      <section className={className}>
        <Select
          label="Select Store"
          className="flex"
          placeholder="Select Store"
          value={$vendor?.id || ""}
          onChange={(value: any) => onStoreSelect(value)}
        >
          {vendors.map((vendor: Vendor, vendorIndex) => (
            <Option key={vendorIndex} value={vendor.id} className="flex gap-2">
              <img src={vendor.logo} className=" w-5 h-5" alt="Small Logo" />
              {vendor.name}
            </Option>
          ))}
        </Select>
      </section>
    );
  };

  const getSelectOutletMenu = (className: string) => {
    return (
      <section className={className}>
        <Select
          label="Select Branch"
          className="flex"
          placeholder="Select Branch"
          value={$general.branch?.id || ""}
          selected={() => $general.branch?.name?.en}
          onChange={(value: any) => onOutletSelect(value)}
        >
          {outlets.map((outlet: any, index) => (
            <Option key={index} value={outlet.id} className="flex gap-2">
              <img src={outlet.image} className=" w-5 h-5" alt="Small Logo" />
              {outlet.name.en}
            </Option>
          ))}
        </Select>
      </section>
    );
  };

  if (!vendor || !user) return <div className="hidden"></div>;

  return (
    <article className={"sticky top-0 z-[9999] bg-white  bg-opacity-[99]"}>
      <div className="border-b border-gray-300 flex  justify-between items-center py-3  px-2  ">
        <article className="flex items-end">
          {/* Logo  */}
          <img
            src={vendor?.logo}
            className="lg:w-10 w-8 rounded-xl me-2 cursor-pointer"
            alt="Small Logo"
            onClick={() => {
              navigator.push("/");
            }}
          />

          {/* End Logo */}
        </article>

        <article className="flex items-center lg:items-end gap-5 mb-1 lg:mb-0 ">
          {/* Select store */}
          {getSelectOutletMenu("relative   lg:flex w-full max-w-[24rem] store-selector  hidden ")}
          {getSelectVendorMenu("relative   lg:flex w-full max-w-[24rem] store-selector   ")}

          {/* profile */}

          <Menu
            animate={{
              mount: { y: 0 },
              unmount: { y: 25 },
            }}
          >
            <MenuHandler>
              <section className="border cursor-pointer border-gray-400 rounded-lg py-1 px-1 lg:flex justify-between items-center min-w-52 hidden">
                <nav className="flex">
                  <img src={user.image} className="object-cover  w-8 h-8 rounded me-1"></img>
                  <nav>
                    <h5 className="text-xs font-semibold text-gray-800 text-nowrap">
                      {$toTitleCase(user?.name)}
                    </h5>
                    <h4 className="text-xs text-primary shadow  w-min rounded font-sourGummy font-semibold px-1 ">
                      {$toTitleCase(user?.isAdmin ? "Admin" : user.role)}
                    </h4>
                  </nav>
                </nav>
                <span className="px-2">
                  <Chevron />
                </span>
              </section>
            </MenuHandler>
            <MenuList className="p-1">
              <MenuItem
                onClick={() => signOut()}
                className="flex items-center gap-2  text-danger hover:text-danger hover:bg-danger-light text-xs"
              >
                <OutIcon className="w-4 h-4" />
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>

          <Menu
            animate={{
              mount: { y: 0 },
              unmount: { y: 25 },
            }}
          >
            <MenuHandler>
              <section className="lg:hidden flex items-center">
                <img
                  src={user.image}
                  className="object-cover rounded-full aspect-square min-w-6 min-h-6 max-w-6 max-h-6 cursor-pointer"
                ></img>
              </section>
            </MenuHandler>
            <MenuList className="p-1">
              <MenuItem
                onClick={() => signOut()}
                className="flex items-center gap-2  text-danger hover:text-danger hover:bg-danger-light text-xs"
              >
                <OutIcon className="w-4 h-4" />
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>

          {/* end profile */}
        </article>
      </div>
      {/* Mobile */}
      <aside className="pt-2 lg:hidden flex justify-between px-3 pb-2 shadow-sm">
        {getSelectOutletMenu("store-selector items-center justify-center")}
        {pathname === "/" && ( // Only render on home page
          <section
            className="flex gap-2 items-center"
            onClick={() => {
              dispatch(SetGeneralField({ field: "cartDrawer", value: !$general.cartDrawer }));
            }}
          >
            <Badge
              content={$cart.items.length}
              className="max-w-[20px] min-w-[20px] max-h-[20px] min-h-[20px]"
            >
              <Bag />
            </Badge>
          </section>
        )}
      </aside>
      {/* End Mobile */}
    </article>
  );
}
