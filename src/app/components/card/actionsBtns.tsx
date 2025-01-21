import { CardIcon, HoldIcon, TrashIcon } from "@/assets/icons";
import { useCartItems } from "@/reduxStore/hooks";
import { Button } from "@material-tailwind/react";
import { useState } from "react";
import CartHolder from "./dialogs/cartHolder";

const ActionsBtns = () => {
  const cartItems = useCartItems();
  const [openCartHolder, setOpenCartHolder] = useState(false);

  return (
    <section className="flex gap-3 flex-col">
      <CartHolder open={openCartHolder} handleOpen={() => setOpenCartHolder(!openCartHolder)} />
      <Button
        className="normal-case justify-center rounded flex gap-1 bg-secondary "
        placeholder={undefined}
      >
        Grand Total: KD 32.00
      </Button>
      <aside className="flex gap-3">
        <Button
          className="normal-case flex justify-center rounded gap-1 w-1/3 bg-danger "
          placeholder={undefined}
          disabled={cartItems.length == 0}
        >
          <TrashIcon />
          Void
        </Button>
        <Button
          className="normal-case flex justify-center rounded gap-1 w-1/3 bg-primary "
          placeholder={undefined}
        >
          <CardIcon />
          Payment
        </Button>
        <Button
          className="normal-case flex justify-center rounded items-center gap-1 w-1/3 bg-warning "
          placeholder={undefined}
          disabled={cartItems.length == 0}
          onClick={() => setOpenCartHolder(true)}
        >
          <HoldIcon />
          Hold
        </Button>
      </aside>
    </section>
  );
};

export default ActionsBtns;
