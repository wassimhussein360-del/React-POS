import {
  Button,
  Dialog,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import "./cartDialogs.css";
import { useEffect, useState } from "react";
import { useCart } from "@/reduxStore/hooks";

interface CashPayProps {
  open: boolean;
  handleOpen: () => void;
  setCustomer: Function;
}

const NewCustomerDialog: React.FC<CashPayProps> = ({ open, handleOpen, setCustomer }) => {
  const [form, setForm] = useState<{ name: string; number: string }>({
    name: "",
    number: "",
  });

  const cart = useCart();
  useEffect(() => {
    const cus = cart?.customer;

    if (cus && !cus.id) {
      setForm({ name: cus.name, number: cus.number });
    } else {
      setForm({
        name: "",
        number: "",
      });
    }
  }, [cart]);

  const setFormValue = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const validateForm = () => {
    return form.name && form.number;
  };
  const [country, setCountry] = useState(0);

  const handleSubmit = () => {
    if (validateForm()) {
      setCustomer({ ...form });
      handleOpen();
    }
  };
  const getBody = () => {
    return (
      <div>
        <Typography
          variant="h4"
          color="blue-gray"
          className="mb-1  text-center font-sourGummy text-secondary   rounded-full"
        >
          New Customer
        </Typography>

        <br />

        {/* Name */}
        <div className="w-full max-w-[24rem]">
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-1 ms-2 text-xs font-medium text-gray-500"
          >
            Enter Customer Name
          </Typography>
          <div className="relative flex w-full">
            <Input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="customer name"
              value={form.name}
              onChange={(e) => setFormValue("name", e.target.value)}
              className="appearance-none  !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none  focus:border"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              containerProps={{
                className: "min-w-0",
              }}
            />
          </div>
        </div>

        {/* End Name */}

        <br />

        {/* Input Number */}
        <div className="w-full max-w-[24rem]">
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-1 ms-2 text-xs font-medium text-gray-500"
          >
            Enter Phone Number
          </Typography>
          <div className="relative flex w-full">
            <Menu placement="bottom-start">
              <MenuHandler>
                <Button
                  ripple={false}
                  variant="text"
                  color="blue-gray"
                  className="h-10 w-14 shrink-0 rounded-r-none border border-r-0 border-blue-gray-200 bg-transparent px-3"
                >
                  {CODES[country]}
                </Button>
              </MenuHandler>
              <MenuList className="max-h-[20rem] max-w-[18rem] z-[9999]">
                {COUNTRIES.map((country, index) => {
                  return (
                    <MenuItem key={country} value={country} onClick={() => setCountry(index)}>
                      {country}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
            <Input
              type="tel"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={12}
              value={form.number}
              placeholder="phone number"
              onChange={(e) => setFormValue("number", e.target.value)}
              className="appearance-none rounded-l-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              containerProps={{
                className: "min-w-0",
              }}
            />
          </div>
        </div>
        {/* End Input Number */}
        <br />
        <br />
        <Button
          className="normal-case  bg-secondary w-full"
          placeholder={undefined}
          onClick={() => handleSubmit()}
        >
          Save Customer
        </Button>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="flex justify-center  bg-transparent shadow-transparent  "
      placeholder={undefined}
    >
      <article className=" bg-white shadow-xl shadow-gray-800 rounded-xl py-8 px-12">
        {getBody()}
      </article>
    </Dialog>
  );
};

const COUNTRIES = ["Kuwait (+965)"];
const CODES = ["+965"];

export default NewCustomerDialog;
