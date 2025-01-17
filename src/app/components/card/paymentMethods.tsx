import { MoneyIcon } from "@/assets/icons";
import QRCodePayment from "./dialogs/qrcodePayment";
import { useState } from "react";
import CashPayDialog from "./dialogs/cashPay";

const PaymentMethods = ({ totalBill }: any) => {
  const [openQrCode, setOpenQrCode] = useState(false);
  const handleQrCodeDialog = () => {
    setOpenQrCode(!openQrCode);
  };

  // cash dialog
  const [openCashDialog, setOpenCashDialog] = useState(false);
  const handleCashPayDialog = () => {
    setOpenCashDialog(!openCashDialog);
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
        <div
          className="rounded-xl border border-gray-400 flex items-center justify-center flex-col h-20 w-20 cursor-pointer"
          onClick={handleCashPayDialog}
        >
          <MoneyIcon />
          <h6 className="">Cash</h6>
        </div>
        <div className="rounded-xl border border-gray-400 flex items-center justify-center flex-col h-20 w-20 ">
          <MoneyIcon />
          <h6>Card</h6>
        </div>
        <div
          className="rounded-xl border border-gray-400 flex items-center justify-center flex-col h-20 w-20 cursor-pointer"
          onClick={handleQrCodeDialog}
        >
          <MoneyIcon />
          <h6>Scan</h6>
        </div>
      </aside>
    </section>
  );
};

export default PaymentMethods;
