import { Select, Option } from "@material-tailwind/react";
import "./cart.css";
import { useAppDispatch, useCart, useGeneral, useVendor } from "@/reduxStore/hooks";
import { SetCartField } from "@/reduxStore/slices/cartSlice";
import { useEffect } from "react";
import FirestoreService from "@/servies/firestoreService";
import { Vendor } from "@/app/abstraction/types";
import { SetGeneralField } from "@/reduxStore/slices/generalSlice";

const PricingDetails = () => {
  const dispatch = useAppDispatch();
  const vendor = useVendor() as Vendor;
  const $cart = useCart();
  const $general = useGeneral();

  useEffect(() => {
    if (!vendor) return;

    FirestoreService.getSubcollection("vendors", vendor.id, "discounts", {
      whereConditions: [{ field: "active", operator: "==", value: true }],
    }).then((res) => {
      dispatch(SetGeneralField({ field: "discounts", value: res }));
    });
  }, [vendor]);

  return (
    <section className="flex gap-2 w-full">
      <div className="pricing-select w-1/2">
        <Select
          label="Discount"
          size="md"
          className="  placeholder:text-lg"
          value={$cart.selections?.couponCode || ""}
        >
          {$general.discounts
            .filter((dis) => dis.useType == "code" && dis.code)
            .map((dis) => {
              return (
                <Option
                  className="text-xs"
                  value={dis.code}
                  key={dis.code}
                  onClick={() => {
                    dispatch(
                      SetCartField({
                        fieldName: "selections",
                        value: {
                          ...$cart.selections,
                          couponCode: dis.code,
                        },
                        vendorId: vendor.id,
                      })
                    );
                  }}
                >
                  {dis.code}{" "}
                </Option>
              );
            })}
        </Select>
      </div>
      <div className="pricing-select w-1/2">
        <Select
          label="Shipping"
          size="md"
          className=" text-xs placeholder:text-xs"
          placeholder="Select Store"
        >
          <Option className="text-xs">Option 1</Option>
        </Select>
      </div>
    </section>
  );
};

export default PricingDetails;
