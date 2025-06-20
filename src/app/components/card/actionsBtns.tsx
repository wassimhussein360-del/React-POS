import { HoldIcon, TrashIcon } from "@/assets/icons";
import { useAppDispatch, useCart, useCartItems, useGeneral } from "@/reduxStore/hooks";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import CartHolder from "./dialogs/cartHolder";
import { SetCartField, VoidCart } from "@/reduxStore/slices/cartSlice";
import toast from "react-hot-toast";
import { createOrder } from "@/servies/fire-functions";
import { $getFromLocal, $loader } from "@/app/helpers/helpers";
import QRCodePayment from "./dialogs/qrcodePayment";
import { SetGeneralField } from "@/reduxStore/slices/generalSlice";

const ActionsBtns = () => {
  const cartItems = useCartItems();
  const dispatch = useAppDispatch();
  const $general = useGeneral();
  const $cart = useCart();
  const [openCartHolder, setOpenCartHolder] = useState(false);

  const [openQrCode, setOpenQrCode] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<any>(null);

  useEffect(() => {
    dispatch(SetGeneralField({ field: "cartCreated", value: !!$cart.paymentUrl }));
  }, [$cart]);

  const validateCart = (): boolean =>
    ![
      [!$general.order.customer, "Please select a customer."],
      [!$general.order.cart.cartItems.length, "Your cart is empty. Add items to proceed."],
      [$general.order.paymentMethod.id === "Unset", "Please select a payment method."],
      [!$cart.selections?.orderType, "Please choose an order type."],
      [
        $cart.selections?.orderType === "delivery" &&
          (!$general.order.address?.deliveryZoneId || !$cart.address),
        "Please select an address.",
      ],
    ].some(([cond, msg]) => cond && (toast.error(msg), true));

  const makeOrder = () => {
    const o = $general.order;
    const payload = getOrderPayload(o);

    dispatch(SetGeneralField({ field: "cartSubmitted", value: true }));
    if (!validateCart()) return;

    $loader(true);

    createOrder(payload)
      .then((res: any) => {
        if (res.data.success) {
          toast.success(res.data.message);
          const url = res.data.order.paymentUrl;
          if (url) {
            setPaymentUrl(res.data.order);
            setOpenQrCode(true);
            dispatch(SetCartField({ fieldName: "id", value: res.data.order.id }));
            dispatch(SetCartField({ fieldName: "paymentUrl", value: res.data.order.paymentUrl }));
          } else {
            dispatch(VoidCart());
          }
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
      <QRCodePayment
        open={openQrCode}
        handleOpen={() => setOpenQrCode(!openQrCode)}
        createdOrder={paymentUrl}
      />
      <Button
        className="normal-case justify-center rounded flex gap-1 bg-secondary "
        onClick={() => ($cart.paymentUrl ? setOpenQrCode(true) : makeOrder())}
      >
        {$cart.paymentUrl ? "Scan To Pay" : "Make Order"}
      </Button>
      <aside className="flex gap-3">
        <Button
          className="normal-case flex justify-center items-center rounded gap-1 w-1/2 bg-danger "
          disabled={cartItems.length == 0}
          onClick={() => dispatch(VoidCart())}
        >
          <TrashIcon className="size-3" />
          Void
        </Button>

        <Button
          className="normal-case flex justify-center rounded items-center gap-1 w-1/2 bg-warning "
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

export const getOrderPayload = (o: any, address?: any) => {
  const vendor = $getFromLocal("vendor");
  return {
    id: o.id,
    orderRef: o.orderRef,
    source: "POS",
    customer: o.customer,
    vendorId: vendor.id,
    cartItems: o.cart.cartItems,
    save_card: false, // !
    selections: {
      orderType: o.orderType,
      selectedPeriod: o.selectedPeriod,
      selectedOrderTime: o.selectedOrderTime,
      couponCode: o.couponCode,
      shippingMethods: o.shipping,
      channel: "Other", //!
      outlet: o.outlet,
      origin: `https://${vendor.domains[vendor.domains.length - 1]}`,
      address: { ...o.address, ...address },
    },

    area: {}, //!

    paymentMethod: o.paymentMethod.id,
    orderNotes: o.specialInstructions, //!
  };
};
