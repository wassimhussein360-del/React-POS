import { AppleIcon, BellIcon, CreditCardPay, MoneyIcon } from "@/assets/icons";
import QRCodePayment from "./dialogs/qrcodePayment";
import { useEffect, useState } from "react";
import CashPayDialog from "./dialogs/cashPay";
import {
  Button,
  ButtonGroup,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { useAppDispatch, useCart, useVendor } from "@/reduxStore/hooks";
import { Vendor } from "@/app/abstraction/types";
import { SetCartField } from "@/reduxStore/slices/cartSlice";

const PaymentMethods = ({ totalBill }: any) => {
  const dispatch = useAppDispatch();
  const [openQrCode, setOpenQrCode] = useState(false);
  const handleQrCodeDialog = () => {
    setOpenQrCode(!openQrCode);
  };
  const $vendor = useVendor() as Vendor;
  const $cart = useCart();

  // cash dialog
  const [openCashDialog, setOpenCashDialog] = useState(false);
  const handleCashPayDialog = () => {
    setOpenCashDialog(!openCashDialog);
  };

  const setPaymentMethod = (paymentId: string) => {
    dispatch(
      SetCartField({
        fieldName: "selections",
        value: {
          ...$cart.selections,
          paymentMethod: paymentId,
        },
        vendorId: $vendor.id,
      })
    );
  };
  const getIcon = (payment: string, addClass?: string) => {
    const className =
      "font-semibold text-xs bg-primary text-secondary p-1 rounded-lg border border-secondary ";
    return payment == "Credit Card" ? (
      <p className={`${className}`}>Credit</p>
    ) : payment == "Apple Pay" ? (
      <p className={`${className}`}>Apple</p>
    ) : payment == "Knet" ? (
      <p className={`${className}`}>Knet</p>
    ) : (
      <i className={`bi bi-qr-code-scan`}></i>
    );
  };

  return (
    <section className="py-6">
      <QRCodePayment
        open={openQrCode}
        handleOpen={handleQrCodeDialog}
        url="https://www.youtube.com/watch?v=nvr4lPoKqzI"
      />
      <CashPayDialog open={openCashDialog} handleOpen={handleCashPayDialog} totalBill={totalBill} />
      <h6 className="mb-5 text-sm">Payment method</h6>

      <aside className="flex gap-3 justify-center">
        {Object.entries($vendor?.payments || {}).map(([key, value], index) =>
          key != "onlinePaymentMethod" ? (
            <div
              key={index}
              className={`rounded border border-gray-400 flex items-center justify-center flex-col h-20 w-20 
              ${
                $cart.selections?.paymentMethod == paymentsMap[key].cartValue
                  ? "bg-secondary text-primary"
                  : "cursor-pointer font-thin"
              }`}
              onClick={() => setPaymentMethod(paymentsMap[key].cartValue)}
            >
              <h6 className="font-sourGummy ">{paymentsMap[key].name}</h6>
              <i className={`bi bi-${paymentsMap[key].icon}`}></i>
            </div>
          ) : (
            <Menu key={index}>
              <MenuHandler>
                <div
                  className={`rounded border border-gray-400 flex items-center justify-center flex-col h-20 w-20 cursor-pointer 
            ${
              value.methods.map((m) => m.id).includes($cart.selections?.paymentMethod)
                ? "bg-secondary text-primary"
                : " font-thin"
            }`}
                >
                  <h6 className="font-sourGummy ">{paymentsMap[key].name}</h6>
                  {getIcon($cart.selections?.paymentMethod || "", " fill-primary")}
                </div>
              </MenuHandler>
              <MenuList placeholder="" className="z-[9999]">
                {value.methods.map((m: any) => (
                  <MenuItem
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`${
                      $cart.selections?.paymentMethod == m.id
                        ? "bg-primary text-secondary hover:bg-primary hover:cursor-default"
                        : ""
                    }`}
                    placeholder=""
                  >
                    <div className="flex gap-2 items-center">{getIcon(m.id)}</div>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )
        )}
      </aside>
    </section>
  );
};

export default PaymentMethods;

const paymentsMap: any = {
  cash: { name: "Cash", cartValue: "Cash", icon: "wallet2" },
  onlinePaymentMethod: { name: "Scan", icon: "qr-code-scan" },
  payByLink: { name: "Link", cartValue: "Pay by link", icon: "link-45deg" },
  posCard: { name: "Card", cartValue: "POS Card", icon: "credit-card-2-front" },
};
