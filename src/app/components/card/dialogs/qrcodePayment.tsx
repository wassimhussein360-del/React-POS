import { $getFromLocal } from "@/app/helpers/helpers";
import { useAppDispatch } from "@/reduxStore/hooks";
import { VoidCart } from "@/reduxStore/slices/cartSlice";
import FirestoreService from "@/servies/firestoreService";
import { Dialog } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";

interface QRCodePaymentProps {
  open: boolean;
  handleOpen: () => void;
  createdOrder: any;
}

const QRCodePayment: React.FC<QRCodePaymentProps> = ({ open, handleOpen, createdOrder }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!createdOrder?.id) return;

    FirestoreService.getObserveSubDocument(
      "vendors",
      $getFromLocal("vendor").id,
      "orders",
      createdOrder.id
    ).subscribe({
      next: (order) => {
        if (!order?.id) return;
        if (order.onlinePayment.status != "awaiting_payment") {
          if (order.onlinePayment.status == "payment_failed")
            toast.error("Payment failed, please try again.", { duration: 5000 });
          else {
            toast.success("Payment Success.", { duration: 5000 });
            handleOpen();
            dispatch(VoidCart());
          }
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });
  }, [createdOrder]);
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="flex justify-center  bg-transparent shadow-transparent"
    >
      <article className="flex flex-col justify-center text-center gap-2 bg-white shadow-xl shadow-gray-800 rounded-xl  ">
        <h1 className="font-semibold text-2xl text-gray-900 bg-primary w-full py-4 px-24 rounded-t-xl">
          Scan To Pay
        </h1>
        <div className="flex justify-center py-7">
          <QRCode
            value={createdOrder?.paymentUrl || ""}
            level="M"
            className="w-[150px] h-[150px] md:w-[200px] md:h-[200px]"
          />
        </div>
      </article>
    </Dialog>
  );
};

export default QRCodePayment;
