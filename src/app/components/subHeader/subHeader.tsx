import { OppositeArrows, OrdersCards, Return } from "@/assets/icons";
import { Button } from "@material-tailwind/react";

const SubHeader = () => {
  return (
    <article className="flex gap-2 px-3 my-5">
      <Button className="normal-case flex gap-1 bg-secondary" placeholder={undefined}>
        <OrdersCards />
        View Orders
      </Button>
      <Button className="normal-case flex gap-1 bg-primary text-black" placeholder={undefined}>
        <Return />
        Rest
      </Button>
      <Button className="normal-case flex gap-2 bg-warning" placeholder={undefined}>
        <OppositeArrows />
        Transaction
      </Button>
    </article>
  );
};

export default SubHeader;
