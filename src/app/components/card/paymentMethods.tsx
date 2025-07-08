import { useState } from "react";
import CashPayDialog from "./dialogs/cashPay";
import { Menu, MenuHandler, MenuList, Radio, Typography } from "@material-tailwind/react";
import { useAppDispatch, useCart, useGeneral, useVendor } from "@/reduxStore/hooks";
import { Vendor } from "@/app/abstraction/types";
import { SetCartField } from "@/reduxStore/slices/cartSlice";
import toast from "react-hot-toast";

const PaymentMethods = ({ totalBill }: any) => {
  const dispatch = useAppDispatch();

  const $vendor = useVendor() as Vendor;
  const $cart = useCart();
  const $general = useGeneral();

  // cash dialog
  const [openCashDialog, setOpenCashDialog] = useState(false);
  const handleCashPayDialog = () => {
    setOpenCashDialog(!openCashDialog);
  };

  const setPaymentMethod = (paymentId: string) => {
    if (isCartCreatedToastMassage($general.cartCreated, "unable to change payment method")) return;

    dispatch(
      SetCartField({
        fieldName: "selections",
        value: {
          ...$cart.selections,
          paymentMethod: paymentId,
        },
      })
    );
  };
  const getIcon = (payment: string, addClass?: string) => {
    const className =
      "font-semibold text-xs bg-primary text-secondary p-1 rounded-lg border border-secondary ";
    return payment == "Credit Card" ? (
      <p className={`${className}`}>Credit</p>
    ) : payment == "Apple Pay" ? (
      <p className={`${className}`}>Credit</p>
    ) : payment == "Knet" ? (
      <p className={`${className}`}>Knet</p>
    ) : (
      <i className={`bi bi-qr-code-scan`}></i>
    );
  };

  function Icon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-full w-full scale-105"
      >
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <section className="py-6">
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
              value.methods.some((m: any) => m.id == $cart.selections?.paymentMethod)
                ? "bg-secondary text-primary"
                : " font-thin"
            }`}
                >
                  <h6 className="font-sourGummy ">{paymentsMap[key].name}</h6>
                  {getIcon($cart.selections?.paymentMethod || "", " fill-primary")}
                </div>
              </MenuHandler>
              <MenuList className="z-[9999]">
                {value.methods.map((m: any, j: number) => (
                  <div className="flex justify-between gap-5" key={j}>
                    <Radio
                      onClick={() => setPaymentMethod(m.id)}
                      name="type"
                      ripple={false}
                      icon={<Icon />}
                      className="border-gray-900/10 bg-gray-900/5 p-0 transition-all hover:before:opacity-0"
                      checked={$cart.selections?.paymentMethod == m.id}
                      label={
                        <Typography color="blue-gray" className="font-normal text-blue-gray-400">
                          {m.id}
                        </Typography>
                      }
                    />
                    {/* {getIcon(m.id)} */}
                  </div>
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

export function isCartCreatedToastMassage(isCreated: boolean, massage: string) {
  if (isCreated) toast.error(`Cart already created, ${massage}`);
  return isCreated;
}
