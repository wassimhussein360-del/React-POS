import { OppositeArrows, OrdersCards, Return } from "@/assets/icons";
import { Button } from "@material-tailwind/react";
import HoldingCartsDrawer from "../drawers/holdedCarts";
import { useRouter } from "next/navigation";

const SubHeader = () => {
  const navigator = useRouter();
  return (
    <article className="flex justify-between px-3 my-5">
      <section className="flex gap-2 ">
        <Button
          className="normal-case flex gap-1 bg-secondary"
          placeholder={undefined}
          onClick={() => navigator.push("/orders")}
        >
          <OrdersCards />
          View Orders
        </Button>
        <Button className="normal-case flex gap-1 bg-primary text-black" placeholder={undefined}>
          <Return />
          Rest
        </Button>
        <Button className="normal-case flex gap-1 bg-warning" placeholder={undefined}>
          <OppositeArrows />
          Transaction
        </Button>
      </section>
      <section>
        <HoldingCartsDrawer />
      </section>
    </article>
  );
};

export default SubHeader;
