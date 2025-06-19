import { useEffect } from "react";
import SingleItem from "./SingleItem";
import { CancelIcon } from "@/assets/icons";
import { useCartItems, useAppDispatch, useGeneral } from "@/reduxStore/hooks";
import { RemoveItem } from "@/reduxStore/slices/cartSlice";

interface CartItemsProps {}

const CartItems: React.FC<CartItemsProps> = ({}) => {
  const items = useCartItems();
  const dispatch = useAppDispatch();
  const $general = useGeneral();

  const clearAllItems = () => {
    items.forEach((item) => dispatch(RemoveItem({ id: item.id })));
  };

  return (
    <article className="flex gap-2 flex-col ">
      {items.length > 0 && (
        <section className="flex justify-between">
          <span className="flex items-center p-0">
            <h6 className="text-sm">Products Added</h6>
            <p className="bg-primary text-white ms-1 rounded flex items-center justify-center w-4 h-4 text-xs">
              {items.length}
            </p>
          </span>
          {!$general.cartCreated && (
            <nav
              className="flex items-center text-xs text-danger cursor-pointer"
              onClick={clearAllItems}
            >
              <CancelIcon />
              Clear All
            </nav>
          )}
        </section>
      )}
      {items.map((itm, i) => (
        <SingleItem key={i} item={itm} index={i} />
      ))}
    </article>
  );
};

export default CartItems;
