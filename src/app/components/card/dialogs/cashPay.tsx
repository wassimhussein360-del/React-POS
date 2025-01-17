import { Dialog } from "@material-tailwind/react";
import "./cartDialogs.css";
import {
  Button,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";

interface CashPayProps {
  open: boolean;
  handleOpen: () => void;
  totalBill: number;
}

const CashPayDialog: React.FC<CashPayProps> = ({ open, handleOpen, totalBill }) => {
  const [paidCurrency, setPaidCurrency] = useState("KWD");
  const [refundCurrency, setRefundCurrency] = useState("KWD");

  const [paidAmount, setPaidAmount] = useState("");
  const [refundAmount, setRefundAmount] = useState<any>("");

  const currencies = ["USD", "KWD"];

  const handleCurrencyChange = (type: "paid" | "refund", currency: string) => {
    if (type === "paid") {
      setPaidCurrency(currency);
    } else {
      setRefundCurrency(currency);
    }
  };

  useEffect(() => {
    setRefundAmount((parseFloat(paidAmount) ?? 0) - (totalBill ?? 0));
  }, [paidAmount]);

  const getBody = () => {
    return (
      <div className="mx-auto  w-full max-w-xs">
        <Typography className="mb-4 font-normal text-blue-gray-500" placeholder={undefined}>
          Enter the amount the customer paid to calculate the refund amount.
        </Typography>
        <div className="flex flex-col items-center justify-between">
          <div className="mt-4 w-full max-w-sm">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-1 font-medium"
              placeholder={undefined}
            >
              Customer Paid
            </Typography>
            <div className="relative flex w-full max-w-sm">
              <Input
                type="number"
                placeholder="Enter Amount Paid"
                className="appearance-none rounded-r-none !border-t-blue-gray-200 placeholder:text-blue-gray-300  placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-0",
                }}
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                crossOrigin={undefined}
              />
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Button
                    ripple={false}
                    variant="text"
                    color="blue-gray"
                    className="h-10 w-14 shrink-0 rounded-l-none border border-l-0 border-blue-gray-200 bg-transparent px-3"
                    placeholder={undefined}
                    disabled={true}
                  >
                    {paidCurrency}
                  </Button>
                </MenuHandler>
                <MenuList className="max-h-[20rem] max-w-[18rem] z-[99999]" placeholder={undefined}>
                  {currencies.map((currency, index) => {
                    return (
                      <MenuItem
                        key={currency}
                        value={currency}
                        onClick={() => handleCurrencyChange("paid", currency)}
                        placeholder={undefined}
                      >
                        {currency}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </div>
          </div>

          <br />
          <br />

          <div className="w-full max-w-sm">
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-1 font-medium"
              placeholder={undefined}
            >
              Refunded Amount
            </Typography>
            <div className=" flex w-full">
              <Input
                type="number"
                placeholder="Refunded Amount"
                className={`appearance-none rounded-r-none  placeholder:text-blue-gray-300  placeholder:opacity-100  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                   disabled:bg-${
                     !refundAmount ? "" : refundAmount < 0 ? "danger" : "success"
                   }-light`}
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-0",
                }}
                value={refundAmount || ""}
                crossOrigin={undefined}
                disabled={true}
              />
              <Menu placement="bottom-start">
                <MenuHandler>
                  <Button
                    ripple={false}
                    variant="text"
                    color="blue-gray"
                    className="h-10 w-14 shrink-0 rounded-l-none border border-l-0 border-blue-gray-200 bg-transparent px-3"
                    placeholder={undefined}
                    disabled={true}
                  >
                    {paidCurrency}
                  </Button>
                </MenuHandler>
                <MenuList
                  className="max-h-[20rem] max-w-[12rem]  z-[99999]"
                  placeholder={undefined}
                >
                  {currencies.map((currency, index) => {
                    return (
                      <MenuItem
                        key={currency}
                        value={refundCurrency}
                        onClick={() => handleCurrencyChange("refund", currency)}
                        placeholder={undefined}
                      >
                        {currency}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="flex justify-center  bg-transparent shadow-transparent"
      placeholder={undefined}
    >
      <article className="flex flex-col justify-center text-center gap-2 bg-white shadow-xl shadow-gray-800 rounded-xl py-12 px-20">
        {getBody()}
      </article>
    </Dialog>
  );
};

export default CashPayDialog;
