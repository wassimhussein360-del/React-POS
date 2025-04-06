import { CardIcon, HoldIcon, TrashIcon } from "@/assets/icons";
import { useAppDispatch, useCart, useCartItems, useGeneral, useVendor } from "@/reduxStore/hooks";
import { Button } from "@material-tailwind/react";
import { useState } from "react";
import CartHolder from "./dialogs/cartHolder";
import { VoidCart } from "@/reduxStore/slices/cartSlice";
import toast from "react-hot-toast";
import { createOrder } from "@/servies/fire-functions";
import { $getFromLocal, $loader } from "@/app/helpers/helpers";
import QRCodePayment from "./dialogs/qrcodePayment";
import { get } from "http";

const ActionsBtns = () => {
  const cartItems = useCartItems();
  const dispatch = useAppDispatch();
  const $general = useGeneral();
  const $cart = useCart();
  const [openCartHolder, setOpenCartHolder] = useState(false);

  const [openQrCode, setOpenQrCode] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState<any>(null);

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
    const o = $general.order;
    const payload = getOrderPayload(o);
    $loader(true);
    console.log(payload);

    createOrder(payload)
      .then((res: any) => {
        if (res.data.success) {
          toast.success(res.data.message);
          const url = res.data.order.paymentUrl;
          if (url) {
            setPaymentUrl(res.data.order);
            setOpenQrCode(true);
          }
          dispatch(VoidCart());
        } else {
          throw new Error(res.data.message || "Error while creating order");
        }
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      })
      .finally(() => {
        $loader(false);
      });
  };

  return (
    <section className="flex gap-3 flex-col">
      <CartHolder open={openCartHolder} handleOpen={() => setOpenCartHolder(!openCartHolder)} />
      {paymentUrl?.id || (
        <QRCodePayment
          open={openQrCode}
          handleOpen={() => setOpenQrCode(!openQrCode)}
          orderId={paymentUrl?.id}
        />
      )}
      <Button
        className="normal-case justify-center rounded flex gap-1 bg-secondary "
        placeholder={undefined}
        onClick={() => makeOrder()}
      >
        Make Order
      </Button>
      <aside className="flex gap-3">
        <Button
          className="normal-case flex justify-center items-center rounded gap-1 w-1/2 bg-danger "
          placeholder={undefined}
          disabled={cartItems.length == 0}
          onClick={() => dispatch(VoidCart())}
        >
          <TrashIcon className="size-3" />
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

export const getOrderPayload = (o: any) => {
  return {
    id: o.id,
    orderRef: o.orderRef,
    source: "POS",
    customer: o.customer,
    vendorId: $getFromLocal("vendor").id,
    cartItems: o.cart.cartItems,
    save_card: false, // !
    selections: {
      orderType: o.orderType,
      selectedPeriod: o.selectedPeriod,
      selectedOrderTime: o.selectedOrderTime,
      couponCode: o.couponCode,

      channel: "Other", //!
      outlet: o.outlet,
      origin: window.location.href,
      address: o.address,
    },

    area: {}, //!

    paymentMethod: o.paymentMethod.id,
    orderNotes: o.specialInstructions, //!
  };
};
