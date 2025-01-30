import { Indexable, Item } from "@/app/abstraction/types";
import { useAppDispatch, useCartItems } from "@/reduxStore/hooks";
import { AddItem, UpdateQuantity } from "@/reduxStore/slices/cartSlice";
import { Badge } from "@material-tailwind/react";
import React, { use, useEffect, useState } from "react";
import ProductDetails from "./productDetails";

interface SingleProductProps {
  product: Item;
  className?: string;
}

const SingleProduct: React.FC<SingleProductProps> = ({ product, className }) => {
  const dispatch = useAppDispatch();

  const [openDetails, setOpenDetails] = useState(false);
  const [itemsTotals, setItemsTotals] = useState<{ quantity: number; stock: number }>({
    quantity: 0,
    stock: 0,
  });
  const items = useCartItems();

  useEffect(() => {
    const matchings = items.filter((item) => item.id === product.id);

    if (matchings.length) {
      const totals = {
        quantity: matchings.reduce((sum, prd) => sum + prd.quantity, 0),
        stock: matchings[0].stockQuantity,
      };

      setItemsTotals(totals);
    } else {
      setItemsTotals({
        quantity: 0,
        stock: 0,
      });
    }
  }, [items, product]);

  return (
    <Badge
      content={itemsTotals.quantity}
      className={`bg-primary rounded-md top-0 ${itemsTotals.quantity || "hidden"}`}
    >
      <ProductDetails
        open={openDetails}
        handleOpen={() => setOpenDetails(!openDetails)}
        product={product}
      />
      <figure
        className={`flex flex-col justify-between border  p-2 w-full   rounded ${
          itemsTotals.quantity
            ? "rounded-xl border-secondary shadow-xl border-2"
            : "border-gray-300"
        } ${
          itemsTotals.quantity && itemsTotals.stock <= 0 ? "opacity-50" : "cursor-pointer"
        } ${className}`}
        onClick={() =>
          !(itemsTotals.quantity && itemsTotals.stock <= 0)
            ? !product.assignedModifiers.length
              ? dispatch(
                  itemsTotals.quantity > 0
                    ? UpdateQuantity({ id: product.id, quantity: itemsTotals.quantity + 1 })
                    : AddItem({ ...product, quantity: 1 })
                )
              : setOpenDetails(true)
            : undefined
        }
      >
        <section className="flex flex-col items-center">
          <img
            src={product.images[0].url}
            className=" w-[90%] aspect-square object-cover rounded-xl"
          />
          <aside className="pt-4  w-full">
            <p className="text-xs text-gray-800">
              {product.categories.map((cat: Indexable) => cat.name.en).join(", ")}
            </p>
            <h4 className="text-gray-900 font-semibold  text-xs truncate">{product.name.en}</h4>
          </aside>
        </section>
        <section className="flex justify-between">
          <p className="text-xs text-primary font-semibold">
            {itemsTotals.quantity ? itemsTotals.stock : product.stockQuantity} Pcs
          </p>
          <p className="text-xs text-gray-800">KD {product.price.toFixed(2)}</p>
        </section>
      </figure>
    </Badge>
  );
};

export default SingleProduct;
