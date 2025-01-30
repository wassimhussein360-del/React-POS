import { CancelIcon } from "@/assets/icons";
import { useEffect, useState } from "react";
import { Item } from "@/app/abstraction/types";
import { AddDiscount, RemoveItem, UpdateQuantity } from "@/reduxStore/slices/cartSlice";
import { useAppDispatch } from "@/reduxStore/hooks";
import ProductDetails from "../products/productDetails";

interface SingleItemProps {
  item: Item;

  index: number;
}

const SingleItem: React.FC<SingleItemProps> = ({ item, index }) => {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <div
      className={` border border-gray-400 rounded-xl p-2 flex justify-between items-center
          duration-500 
        ${isVisible ? "translate-x-0 opacity-100 delay-0" : "translate-x-10 opacity-0"} `}
    >
      <ProductDetails
        open={openDetails}
        handleOpen={() => setOpenDetails(!openDetails)}
        product={item}
      />
      <aside className="flex">
        <img
          onClick={() => setOpenDetails(!openDetails)}
          src={item.images[0].url}
          className="w-[50px] h-[50px] rounded-xl object-cover me-2 cursor-pointer"
          alt={item.name.en}
        />

        <section className="text-xs flex flex-col justify-between">
          <aside>
            <p className="text-xs font-semibold truncate max-w-32">{item.name.en}</p>
          </aside>
          <aside className="flex items-center">
            <p className=" me-1 text-gray-800">KD</p>

            <p
              className={` me-1 
                text-gray-800
              `}
            >
              {item.price}
            </p>
          </aside>
        </section>
      </aside>

      <aside className="flex-center gap-2">
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
            onClick={() => (item.stockQuantity <= 0 ? null : updateQuantity(item.quantity + 1))}
            className="bg-white text-gray-900 rounded-e border-l border-gray-400 w-5 h-5 p-0"
          >
            +
          </button>
        </section>

        <button onClick={() => removeItemFromCart()} className="p-0">
          <CancelIcon />
        </button>
      </aside>
    </div>
  );
};

export default SingleItem;
