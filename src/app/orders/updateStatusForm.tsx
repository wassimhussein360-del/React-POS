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
  onStatusUpdated?: () => void;
}

const UpdateStatusForm: React.FC<UpdateStatusProps> = ({ open, handleOpen, orders, onStatusUpdated }) => {
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
      paid: status == "completed",
      userId: orders[index].customer.id,
    };

    updateOrderStatus(payload)
      .then((res: any) => {
        if (res.data.success) {
          toast.success(`Order with ref #${orders[index].orderRef} has been updated to ${status}`);
          if (onStatusUpdated) onStatusUpdated();
        } else toast.error(`Failed updating order status with ref #${orders[index].orderRef} to ${status}`);
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
        <Typography variant="h4" color="blue-gray" className="mb-1  text-center font-sourGummy text-secondary   rounded-full">
          Status Form
        </Typography>

        <hr className="my-6" />

        <section className="grid md:grid-cols-2 gap-4">
          {["pending", "preparing", "delivering", "completed"].map((stu, index) => (
            <Button
              key={index}
              size="lg"
              className={`normal-case outline outline-transparent border w-[150px] ${severityClasses[stu]} ${stu === status ? `shadow-lg border-white outline-${severityClasses[stu]}` : ""}`}
              disabled={isLoading}
              onClick={() => setStatus(stu)}
            >
              {$toTitleCase(stu)}
            </Button>
          ))}
        </section>

        <hr className="my-6" />

        <Button className="normal-case  bg-secondary w-full flex-center gap-3" size="lg" disabled={isLoading || !status} onClick={() => handleSubmit(0)}>
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
    <Dialog open={open} handler={handleOpen} className="flex justify-center  bg-transparent  !min-w-0 !w-[26rem] shadow-transparent  ">
      <article className=" bg-white shadow-xl shadow-gray-800 rounded-xl py-8 px-12">{getBody()}</article>
    </Dialog>
  );
};

export default UpdateStatusForm;

const severityClasses: any = {
  pending: "bg-warning-light text-warning",
  preparing: "bg-secondary-light text-secondary",
  delivering: "bg-info-light text-info",
  completed: "bg-success-light text-success",
  default: "bg-black text-black",
};
