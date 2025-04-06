import { $currency, $toTitleCase } from "@/app/helpers/helpers";
import { useGeneral } from "@/reduxStore/hooks";
import { useEffect, useState } from "react";
import { Indexable } from "@/app/abstraction/types";

interface CartTotalsType {}

const CardTotals: React.FC<CartTotalsType> = ({}) => {
  const [cart, setCart] = useState<Indexable>({});

  const $general = useGeneral();

  useEffect(() => {
    if ($general.order.cart) setCart($general.order.cart);
  }, [$general.order]);

  return (
    <article className="text-sm flex flex-col gap-2">
      {[
        "cartDiscountAmount",
        "customDiscount",
        "deliveryFee",
        "productsDiscount",
        "subTotal",
        "total",
      ].map((value, index) => {
        return value && cart[value] ? (
          <section
            key={index}
            className={`flex justify-between text-gray-${
              cart[value] || 0 ? "800 font-semibold" : "400"
            }`}
          >
            <p>{$toTitleCase(value)}</p>
            <div className="flex justify-between w-20">
              {$currency()} <div>{(cart[value] || 0).toFixed(2)}</div>
            </div>
          </section>
        ) : null;
      })}
    </article>
  );
};

export default CardTotals;
