import { $generateRandomNumber } from "@/app/helpers/helpers";
import { HoldIcon } from "@/assets/icons";
import { useAppDispatch, useVendor } from "@/reduxStore/hooks";
import { HoldCart } from "@/reduxStore/slices/cartSlice";
import { Button, Dialog, Input, Typography } from "@material-tailwind/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface DiscountDialogProps {
  open: boolean;
  handleOpen: () => void;
}

const CartHolder: React.FC<DiscountDialogProps> = ({ open, handleOpen }) => {
  const [holdingName, setHoldingName] = useState("");

  const vendor = useVendor();
  const dispatch = useAppDispatch();

  const holdCart = () => {
    const holdTheCart = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          dispatch(HoldCart({ holdingName, vendorId: vendor?.id as string }));
          setHoldingName("");
          handleOpen();
          resolve(true);
        }, $generateRandomNumber(100, 1000)); // Simulate a 5-second delay
      });
    };

    toast.promise(holdTheCart(), {
      loading: "Holding The Cart...",
      success: <b>{holdingName + " Has Successfully Hold 👌"}</b>,
    });
  };

  const getBody = () => {
    return (
      <div className="mx-auto  w-full max-w-xs">
        <Typography className="mb-4 font-normal text-blue-gray-500 text-sm">
          Please enter a holding name to hold the cart.
        </Typography>

        <div className="mt-4 w-full max-w-sm">
          <div className="relative flex w-full max-w-sm">
            <Input
              label="Holding Name"
              size="md"
              className=" text-xs"
              value={holdingName}
              onChange={(e) => setHoldingName(e.target.value)}
            />
          </div>
        </div>
        <br />
        <Button
          className="normal-case flex justify-center rounded items-center gap-1 w-full bg-warning "
          disabled={holdingName == ""}
          onClick={() => holdCart()}
        >
          <HoldIcon />
          Hold
        </Button>
      </div>
    );
  };
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="flex justify-center  bg-primary shadow-transparent !min-w-0 !w-[350px]"
    >
      <article className="flex flex-col justify-center text-center gap-2 bg-white shadow-xl shadow-gray-800 rounded-xl py-10 px-12">
        {getBody()}
      </article>
    </Dialog>
  );
};

export default CartHolder;
