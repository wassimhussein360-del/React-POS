import { CancelIcon } from "@/assets/icons";
import { useEffect, useState } from "react";
import DiscountDialog from "./dialogs/discountDialog";
import { Discount, Item } from "@/app/abstraction/types";
import { AddDiscount, RemoveItem, UpdateQuantity } from "@/reduxStore/slices/cartSlice";
import { useAppDispatch } from "@/reduxStore/hooks";
import ProductDetails from "../products/productDetails";

interface SingleItemProps {
  item: Item;

  index: number;
}

const SingleItem: React.FC<SingleItemProps> = ({ item, index }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [isVisible, setIsVisible] = useState(false);
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [openDetails, setOpenDetails] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [item]);

  const updateQuantity = (quantity: number) => {
    dispatch(UpdateQuantity({ id: item.id, quantity, key: item.key }));
  };

  const removeItemFromCart = () => {
    dispatch(RemoveItem({ id: item.id, key: item.key }));
  };

  const addDiscount = (id: string, discount: Discount) => {
    dispatch(AddDiscount({ id, discount }));
  };

  useEffect(() => {
    if (discount) {
      addDiscount(item.id, discount);
    }
    setOpen(false);
  }, [discount]);

  return (
    <div
      className={` border border-gray-400 rounded-xl p-2 flex justify-between items-center
          duration-500 
        ${isVisible ? "translate-x-0 opacity-100 delay-0" : "translate-x-10 opacity-0"} `}
    >
      <DiscountDialog
        open={open}
        handleOpen={handleOpen}
        setDiscount={setDiscount}
        discount={discount}
        originalPrice={item.price}
      />
      <ProductDetails
        open={openDetails}
        handleOpen={() => setOpenDetails(!openDetails)}
        product={item}
      />
      <aside className="flex">
        <img
          onClick={() => setOpenDetails(!openDetails)}
          src={item.image}
          className="w-[50px] h-[50px] rounded-xl object-cover me-2 cursor-pointer"
          alt={item.name}
        />

        <section className="text-xs flex flex-col justify-between">
          <aside>
            <p className="text-xs font-semibold truncate max-w-32">{item.name}</p>
          </aside>
          <aside className="flex items-center">
            <p className=" me-1 text-gray-800">KD</p>

            <p
              className={` me-1  ${
                discount?.value ? "line-through text-gray-600" : "text-gray-800"
              }`}
            >
              {item.price}
            </p>
            {discount && discount.value > 0 && (
              <p className="me-1 font-semibold text-primary">
                {" "}
                {applyDiscount(item.price, item.discount)?.toFixed(2)}
              </p>
            )}
            <p className={`text-xs underline text-danger cursor-pointer`} onClick={handleOpen}>
              {item.discount?.value
                ? `${item.discount.value} ${item.discount.unit}`
                : "+ Add Discount"}
            </p>
          </aside>
        </section>
      </aside>

      <section className="border border-gray-400 rounded flex text-xs">
        <button
          onClick={() =>
            item.quantity > 1 ? updateQuantity(item.quantity - 1) : removeItemFromCart()
          }
          className="bg-white text-gray-900 font-bold rounded-s border-r border-gray-400 w-5 h-5 p-0 "
        >
          -
        </button>
        <button className="bg-white text-gray-900 w-5 h-5 p-0" disabled={true}>
          {item.quantity}
        </button>
        <button
          onClick={() => (item.stock <= 0 ? null : updateQuantity(item.quantity + 1))}
          className="bg-white text-gray-900 rounded-e border-l border-gray-400 w-5 h-5 p-0"
        >
          +
        </button>
      </section>

      <button onClick={() => removeItemFromCart()} className="p-0">
        <CancelIcon />
      </button>
    </div>
  );
};

export default SingleItem;

export const applyDiscount = (price: number, discount: Discount | null | undefined): number => {
  if (discount)
    if (discount?.unit === "%") {
      return price * (1 - discount.value / 100);
    } else {
      return price - discount.value;
    }
  return price;
};
