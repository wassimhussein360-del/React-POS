import { $calculateDiscountAmount } from "@/app/helpers/helpers";
import { useCart, useCartItems } from "@/reduxStore/hooks";
import { useEffect, useState } from "react";
import { applyDiscount } from "./SingleItem";

interface CartTotalsType {}

const CardTotals: React.FC<CartTotalsType> = ({}) => {
  const [pricing, setPricing] = useState<{ subtotal: number }>({ subtotal: 0 });
  const items = useCartItems();
  const cart = useCart();

  useEffect(() => {
    setPricing({
      subtotal: items.reduce(
        (acc, item) => acc + applyDiscount(item.price, item.discount) * item.quantity,
        0
      ),
    });
  }, [items, cart]);

  return (
    <article className="text-sm flex flex-col gap-2">
      <section className="flex justify-between">
        <p>Subtotal</p>
        <div className="flex justify-between w-20">
          KD <div>{pricing.subtotal.toFixed(2)}</div>
        </div>
      </section>
      <section className="flex justify-between">
        <p>Tax</p>
        <div className="flex justify-between w-20">
          KD<div>{0}</div>
        </div>
      </section>
      <section className="flex justify-between">
        <p>Shipping</p>
        <div className="flex justify-between w-20">
          KD <div>{0}</div>
        </div>
      </section>
      <section className="flex justify-between text-danger">
        <p>Discount({0}%)</p>
        <div className="flex justify-between w-20">
          KD <div>{$calculateDiscountAmount(0, 0)}</div>
        </div>
      </section>

      <section className="text-danger"></section>

      <section className="flex justify-between text-sm font-semibold text-gray-800">
        <p>Total</p>
        <p>KD {0}</p>
      </section>
    </article>
  );
};

export default CardTotals;
