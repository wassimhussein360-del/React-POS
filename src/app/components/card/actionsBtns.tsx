import { CardIcon, HoldIcon, TrashIcon } from "@/assets/icons";
import { useAppDispatch, useCart, useCartItems, useGeneral, useVendor } from "@/reduxStore/hooks";
import { Button } from "@material-tailwind/react";
import { useState } from "react";
import CartHolder from "./dialogs/cartHolder";
import { VoidCart } from "@/reduxStore/slices/cartSlice";
import toast from "react-hot-toast";

const ActionsBtns = () => {
  const cartItems = useCartItems();
  const vendor = useVendor();
  const dispatch = useAppDispatch();
  const $general = useGeneral();
  const $cart = useCart();
  const [openCartHolder, setOpenCartHolder] = useState(false);

  const validateCart = (): boolean =>
    ![
      [!$general.order.customer, "Please select a customer."],
      [!$general.order.cart.cartItems.length, "Your cart is empty. Add items to proceed."],
      [$general.order.paymentMethod.id === "Unset", "Please select a payment method."],
      [!$cart.selections?.orderType, "Please choose an order type."],
      [
        $cart.selections?.orderType === "delivery" && !$general.order.address.deliveryZoneId,
        "Please select an address.",
      ],
    ].some(([cond, msg]) => cond && (toast.error(msg), true));

  const makeOrder = () => {
    if (!validateCart()) return;
  };

  return (
    <section className="flex gap-3 flex-col">
      <CartHolder open={openCartHolder} handleOpen={() => setOpenCartHolder(!openCartHolder)} />
      <Button
        className="normal-case justify-center rounded flex gap-1 bg-secondary "
        placeholder={undefined}
        onClick={() => makeOrder()}
      >
        Make Order
      </Button>
      <aside className="flex gap-3">
        <Button
          className="normal-case flex justify-center rounded gap-1 w-1/2 bg-danger "
          placeholder={undefined}
          disabled={cartItems.length == 0}
          onClick={() => dispatch(VoidCart({ vendorId: vendor?.id as string }))}
        >
          <TrashIcon />
          Void
        </Button>

        <Button
          className="normal-case flex justify-center rounded items-center gap-1 w-1/2 bg-warning "
          placeholder={undefined}
          disabled={cartItems.length == 0}
          onClick={() => setOpenCartHolder(true)}
        >
          <HoldIcon />
          Hold
        </Button>
      </aside>
    </section>
  );
};

export default ActionsBtns;
