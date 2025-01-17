import { Dialog } from "@material-tailwind/react";
import QRCode from "react-qr-code";

interface QRCodePaymentProps {
  open: boolean;
  handleOpen: () => void;
  url: string;
}

const QRCodePayment: React.FC<QRCodePaymentProps> = ({ open, handleOpen, url }) => {
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
          <QRCode value={url} level="M" className="w-[150px] h-[150px] md:w-[200px] md:h-[200px]" />
        </div>
      </article>
    </Dialog>
  );
};

export default QRCodePayment;
