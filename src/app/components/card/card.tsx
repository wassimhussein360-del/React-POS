import { Button, Textarea, ButtonGroup } from "@material-tailwind/react";
import PricingDetails from "./pricing";
import CardTotals from "./cardTotals";
import ActionsBtns from "./actionsBtns";
import PaymentMethods from "./paymentMethods";
import CartItems from "./cartItems";
import { useAppDispatch, useCart, useGeneral, useVendor } from "@/reduxStore/hooks";
import { SetCartField } from "@/reduxStore/slices/cartSlice";
import React, { useEffect } from "react";
import CustomerAndProductSelection from "./customerSelection";
import { Vendor } from "@/app/abstraction/types";
import { SetGeneralField } from "@/reduxStore/slices/generalSlice";

const CartInfo = ({ className }: { className: string }) => {
  const dispatch = useAppDispatch();
  const cart = useCart();
  const $general = useGeneral();

  useEffect(() => {
    if (cart.selections?.orderType != "pickup") return;

    dispatch(
      SetCartField({
        fieldName: "address",
        value: undefined,
      })
    );

    dispatch(
      SetGeneralField({
        field: "zone",
        value: {},
      })
    );
  }, [cart.selections?.orderType]);

  return (
    <section
      className={`p-5  shadow-2xl rounded-lg  overflow-auto w-full min-w-[350px] md:max-w-[350px] ${className}`}
    >
      {/* category info */}
      <section>
        <aside className="flex justify-between ">
          <h6 className="text-sm">Cart</h6>
          <ButtonGroup size="sm">
            {["Delivery", "Pickup"].map((orderType) => {
              const isSelected = cart.selections?.orderType == orderType.toLowerCase();
              if ($general.cartCreated && !isSelected) return null;
              return (
                <Button
                  key={orderType}
                  className={`p-0 px-2 normal-case  border-none shadow ${
                    isSelected ? "bg-primary" : "bg-transparent text-primary"
                  }`}
                  onClick={() => {
                    dispatch(
                      SetCartField({
                        fieldName: "selections",
                        value: {
                          ...cart.selections,
                          orderType: orderType.toLowerCase(),
                        },
                      })
                    );
                  }}
                >
                  {orderType}
                </Button>
              );
            })}
          </ButtonGroup>
        </aside>
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
          label="Special Instructions"
          value={cart.selections?.specialInstructions}
          disabled={$general.cartCreated}
          onChange={(e) =>
            dispatch(
              SetCartField({
                fieldName: "selections",
                value: {
                  ...cart.selections,
                  specialInstructions: e.target.value,
                },
              })
            )
          }
          className=" max-h-[70px]  bg-[#F6F6F6] min-h-0 "
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
