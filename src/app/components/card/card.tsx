import { CancelIcon, Plus } from "@/assets/icons";
import { Select, Option, Button, Textarea } from "@material-tailwind/react";
import SingleItem from "./SingleItem";
import PricingDetails from "./pricing";
import CardTotals from "./cardTotals";
import ActionsBtns from "./actionsBtns";
import PaymentMethods from "./paymentMethods";
import CartItems from "./cartItems";
import { useState } from "react";
import { useAppDispatch, useVendor } from "@/reduxStore/hooks";
import { SetCartField } from "@/reduxStore/slices/cartSlice";
import React from "react";
import CustomerAndProductSelection from "./customerSelection";

interface CartItemsProps {
  subtotal: number;
}
const CartInfo = ({ className }: { className: string }) => {
  const dispatch = useAppDispatch();
  const vendor = useVendor();

  return (
    <section
      className={`p-5  shadow-2xl rounded-lg  overflow-auto w-full min-w-[350px] md:max-w-[350px] ${className}`}
    >
      {/* category info */}
      <section>
        <h6 className="text-sm">Categories</h6>
        <p className="text-gray-700 text-xs">Transaction ID: #569985</p>
      </section>
      {/* end category info */}

      <br />

      {/* customer info */}
      <CustomerAndProductSelection />
      {/* end customer info */}

      <br />

      {/* Products added  */}

      <section className="flex flex-col gap-2 my-3">
        <CartItems />

        <Textarea
          label="Message"
          onChange={(e) =>
            dispatch(
              SetCartField({
                fieldName: "message",
                value: e.target.value,
                vendorId: vendor?.id as string,
              })
            )
          }
          className="rounded-xl  max-h-[100px] bg-[#F6F6F6]"
        />
        <hr />
      </section>
      {/* end Products added  */}

      {/* pricing details */}
      <section className="pb-5">
        <PricingDetails />
      </section>
      {/* end pricing details */}

      {/* Totals added */}
      <section className="bg-[#F6F6F6] rounded-xl p-5 text-gray-600 flex flex-col gap-2">
        <CardTotals />
      </section>
      {/* end totals added */}

      {/* payment methods */}
      <section>
        <PaymentMethods />
      </section>
      {/* end totals added */}

      {/* actions */}
      <section>
        <ActionsBtns />
      </section>
      {/* end actions */}
    </section>
  );
};

export default CartInfo;
