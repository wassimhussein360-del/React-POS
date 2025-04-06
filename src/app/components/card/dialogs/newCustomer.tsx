import {
  Button,
  Dialog,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import "./cartDialogs.css";
import { useEffect, useState } from "react";
import { useCart, useVendor } from "@/reduxStore/hooks";
import { nanoid } from "nanoid";
import { createCustomer } from "@/servies/fire-functions";
import toast from "react-hot-toast";
import { allCountries } from "country-telephone-data";

interface CashPayProps {
  open: boolean;
  handleOpen: () => void;
  setCustomer: Function;
}

const NewCustomerDialog: React.FC<CashPayProps> = ({ open, handleOpen, setCustomer }) => {
  const $vendor = useVendor();

  const [selectedCountryCode, setselectedCountryCode] = useState("+965");
  const COUNTRIES = allCountries.map((country) => {
    return {
      name: country.name,
      code: `+${country.dialCode}`,
    };
  });

  const [form, setForm] = useState<{ name: string; number: string }>({
    name: "",
    number: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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

  function setPhoneNumber(value: string) {
    setFormValue("number", value);
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setIsLoading(true);
      const id = nanoid(30);
      const created = new Date().getTime();
      setCustomer({ ...form });
      const payload = {
        createdAt: created,
        providerId: "",
        updatedAt: created,
        image: "",
        email: "",
        id: id,
        name: form.name,
        vendorId: $vendor?.id,
        phone: `${selectedCountryCode}${form.number}`,
        uid: id,
      };
      createCustomer(payload)
        .then((res: any) => {
          if (res.data.success) {
            setCustomer(res.data.customerData);
            toast.success("New Customer Has Been Added! 👍");
            handleOpen();
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
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
                  {selectedCountryCode}
                </Button>
              </MenuHandler>
              <MenuList className="max-h-[20rem] max-w-[18rem] z-[9999]">
                {COUNTRIES.map((country, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => setselectedCountryCode(country.code)}
                    className={`${
                      selectedCountryCode == country.code ? "bg-gray-300 text-secondary" : ""
                    }`}
                  >
                    {country.name} ({country.code})
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Input
              type="tel"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={12}
              value={form.number}
              placeholder="phone number"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
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
          className="normal-case  bg-secondary w-full flex-center gap-3"
          placeholder={undefined}
          disabled={isLoading}
          onClick={() => handleSubmit()}
        >
          {isLoading ? (
            <>
              Adding Customer ... <Spinner className="w-4" />
            </>
          ) : (
            "Save Customer"
          )}
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

export default NewCustomerDialog;
