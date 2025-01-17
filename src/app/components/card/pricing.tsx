import { Select, Option, Input } from "@material-tailwind/react";
import "./cart.css";
import { useAppDispatch } from "@/reduxStore/hooks";
import { SetCartField } from "@/reduxStore/slices/cartSlice";

const PricingDetails = () => {
  const dispatch = useAppDispatch();

  return (
    <section>
      <section className="flex gap-2 w-full">
        <div className="pricing-select w-1/3">
          <Select label="Order Tax" className="rounded-xl " placeholder="Select Store">
            <Option className="text-xs">Option 1</Option>
          </Select>
        </div>
        <div className="pricing-select w-1/3">
          <Select
            label="Shipping"
            size="md"
            className=" rounded-xl placeholder:text-lg"
            placeholder="Select Store"
          >
            <Option className="text-xs">Option 1</Option>
          </Select>
        </div>
        <div className="pricing-select w-1/3">
          <Select
            label="Discount"
            size="md"
            className="rounded-xl text-xs placeholder:text-xs"
            placeholder="Select Store"
          >
            <Option className="text-xs">Option 1</Option>
          </Select>
        </div>
      </section>
      <section className="mt-4">
        <Input
          label="Coupon Code"
          size="md"
          className="rounded-xl text-xs"
          crossOrigin={undefined}
          onChange={(e) =>
            dispatch(SetCartField({ fieldName: "couponCode", value: e.target.value }))
          }
        />
      </section>
    </section>
  );
};

export default PricingDetails;
