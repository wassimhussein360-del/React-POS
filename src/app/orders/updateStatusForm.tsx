import { Button, Dialog, Spinner, Switch, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { useVendor } from "@/reduxStore/hooks";
import { updateOrderStatus } from "@/servies/fire-functions";
import toast from "react-hot-toast";
import { Vendor } from "../abstraction/types";
import { $getSeverity, $pluralToSingular, $toTitleCase } from "../helpers/helpers";

interface UpdateStatusProps {
  open: boolean;
  handleOpen: () => void;
  orders: any[];
}

const UpdateStatusForm: React.FC<UpdateStatusProps> = ({ open, handleOpen, orders }) => {
  const $vendor = useVendor() as Vendor;

  const [status, setStatus] = useState("");
  const [paid, setPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (index: number) => {
    if (index >= orders.length) return;

    setIsLoading(true);

    const payload = {
      status: status,
      vendorId: $vendor.id,
      orderId: orders[index].id,
      paid: paid,
      userId: orders[index].customer.id,
    };

    updateOrderStatus(payload)
      .then((res: any) => {
        if (res.data.success)
          toast.success(`Order with ref #${orders[index].orderRef} has been updated to ${status}`);
        else
          toast.error(
            `Failed updating order status with ref #${orders[index].orderRef} to ${status}`
          );
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        handleSubmit(index + 1);
        setIsLoading(false);
      });
  };
  const getBody = () => {
    return (
      <div>
        <Typography
          variant="h4"
          color="blue-gray"
          className="mb-1  text-center font-sourGummy text-secondary   rounded-full"
        >
          Status Form
        </Typography>

        <hr className="my-6" />

        <section className="grid md:grid-cols-2 gap-4">
          {["pending", "preparing", "delivering", "completed"].map((stu) => (
            <Button
              size="lg"
              className={`normal-case outline outline-transparent border  bg-${$getSeverity(
                stu
              )}-light w-[150px] ${
                stu == status
                  ? `bg-${$getSeverity(stu)} shadow-lg  border-white outline-${$getSeverity(stu)}  `
                  : `text-${$getSeverity(stu)}`
              }`}
              placeholder={undefined}
              disabled={isLoading}
              onClick={() => setStatus(stu)}
            >
              {$toTitleCase(stu)}
            </Button>
          ))}
        </section>

        <hr className="my-6" />

        <section className="flex gap-5 items-center">
          <Typography
            variant="h4"
            color="blue-gray"
            className="mb-1  text-center font-sourGummy text-secondary   rounded-full"
          >
            Paid
          </Typography>
          <Switch
            ripple={false}
            onChange={(e) => setPaid(e.target.checked)}
            className="h-full w-full checked:bg-[#2ec946]"
            containerProps={{
              className: "w-11 h-6",
            }}
            circleProps={{
              className: "before:hidden left-0.5 border-none",
            }}
          />
        </section>

        <hr className="my-6" />

        <Button
          className="normal-case  bg-secondary w-full flex-center gap-3"
          placeholder={undefined}
          size="lg"
          disabled={isLoading || !status}
          onClick={() => handleSubmit(0)}
        >
          {isLoading ? (
            <>
              Updating Status ... <Spinner className="w-4" />
            </>
          ) : (
            "Confirm Update"
          )}
        </Button>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="flex justify-center  bg-transparent  !min-w-0 !w-[26rem] shadow-transparent  "
      placeholder={undefined}
    >
      <article className=" bg-white shadow-xl shadow-gray-800 rounded-xl py-8 px-12">
        {getBody()}
      </article>
    </Dialog>
  );
};

export default UpdateStatusForm;
