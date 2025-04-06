import { $getFromLocal } from "@/app/helpers/helpers";
import FirestoreService from "@/servies/firestoreService";
import { Dialog } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

interface QRCodePaymentProps {
  open: boolean;
  handleOpen: () => void;
  orderId: string;
}

const QRCodePayment: React.FC<QRCodePaymentProps> = ({ open, handleOpen, orderId }) => {
  const [order, setOrder] = useState<{ id: string; url: string }>({
    id: orderId || "ord_998256056802693-207",
    url: "",
  });
  useEffect(() => {
    const sub$ = FirestoreService.getObserveSubDocument(
      "vendors",
      $getFromLocal("vendor").id,
      "orders",
      order.id
    );

    const subscription = sub$.subscribe({
      next: (order) => {
        console.log("Live order:", order);
      },
      error: (err) => {
        console.error(err);
      },
    });

    // later, to stop listening:
    subscription.unsubscribe();
  }, []);
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="flex justify-center  bg-transparent shadow-transparent"
      placeholder={undefined}
    >
      <article className="flex flex-col justify-center text-center gap-2 bg-white shadow-xl shadow-gray-800 rounded-xl  ">
        <h1 className="font-semibold text-2xl text-gray-900 bg-primary w-full py-4 px-24 rounded-t-xl">
          Scan To Pay
        </h1>
        <div className="flex justify-center py-7">
          <QRCode
            value={order.url}
            level="M"
            className="w-[150px] h-[150px] md:w-[200px] md:h-[200px]"
          />
        </div>
      </article>
    </Dialog>
  );
};

export default QRCodePayment;
