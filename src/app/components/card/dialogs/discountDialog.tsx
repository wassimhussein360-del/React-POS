import { MinusIcon, PercentIcon, PlusIcon } from "@/assets/icons";
import { Button, Dialog, DialogBody, DialogHeader, Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import "./cartDialogs.css";
import { Discount } from "@/app/abstraction/types";

interface DiscountDialogProps {
  open: boolean;
  setDiscount: (discount: Discount) => void;
  handleOpen: () => void;
  discount: Discount | null;
  originalPrice: number;
}

const DiscountDialog: React.FC<DiscountDialogProps> = ({
  open,
  handleOpen,
  setDiscount,
  discount,
  originalPrice,
}) => {
  const [isPercent, setIsPercent] = useState(true);
  const [amount, setAmount] = useState(0);

  const addDiscount = () => {
    setDiscount({ value: amount, unit: isPercent ? "%" : "kwd" });
  };

  const trySetDiscount = (value: number) => {
    if (value < 0 || (isPercent ? value > 100 : value > originalPrice)) return;
    setAmount(value);
  };

  useEffect(() => {
    setAmount(discount?.value ?? 0);
    setIsPercent(discount?.unit == "%");
  }, [discount]);

  useEffect(() => {
    setAmount(0);
  }, [isPercent]);

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="flex justify-center  bg-transparent shadow-transparent"
      placeholder={undefined}
    >
      <article className="flex flex-col justify-center text-center gap-2 bg-white shadow-xl shadow-gray-800 rounded-xl py-8 px-24">
        <p className="text-gray-800 font-semibold">Add Discount</p>

        <div className="flex gap-3 items-center justify-center ">
          <p
            className={`${
              !isPercent ? "text-gray-900  font-semibold" : "text-gray-500 cursor-pointer"
            }`}
            onClick={() => setIsPercent(false)}
          >
            KWD
          </p>
          <p className="text-gray-500">/</p>
          <p
            className={`${
              isPercent ? "text-gray-900  font-semibold" : "text-gray-500 cursor-pointer"
            }`}
            onClick={() => setIsPercent(true)}
          >
            %
          </p>
        </div>

        <section className="flex items-center justify-center gap-4 my-6">
          <span onClick={() => trySetDiscount(amount - 1)} className="cursor-pointer p-0">
            <MinusIcon />
          </span>
          <div className="rounded-xl px-2 border border-gray-500 flex items-center ">
            <p className="w-9 text-gray-900 font-semibold">{isPercent ? "%" : "KD"}</p>
            <Input
              type="number"
              value={amount}
              onChange={(e: any) => trySetDiscount(Number(e.target.value))}
              className="!border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100    focus:!border-t-gray-900 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-0 focus:border-none bg-primary focus:outline-0 max-w-[60px] p-1 min-w-0"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              containerProps={{
                className: "  min-w-1",
              }}
              crossOrigin={undefined}
            />
          </div>
          <span onClick={() => trySetDiscount(amount + 1)} className="cursor-pointer p-0">
            <PlusIcon />
          </span>
        </section>

        <span className="flex justify-center">
          <Button
            className="normal-case text-center bg-secondary w-48"
            onClick={addDiscount}
            placeholder={undefined}
          >
            Save
          </Button>
        </span>
      </article>
    </Dialog>
  );
};

export default DiscountDialog;
