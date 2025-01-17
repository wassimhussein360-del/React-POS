import { CardIcon, HoldIcon, TrashIcon } from "@/assets/icons";
import { Button } from "@material-tailwind/react";

const ActionsBtns = () => {
  return (
    <section className="flex gap-3 flex-col">
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
        >
          <HoldIcon />
          Hold
        </Button>
      </aside>
    </section>
  );
};

export default ActionsBtns;
