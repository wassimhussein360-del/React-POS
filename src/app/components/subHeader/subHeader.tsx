import { OrdersCards } from "@/assets/icons";
import { Button } from "@material-tailwind/react";
import HoldingCartsDrawer from "../drawers/holdedCarts";
import { useUser } from "@/reduxStore/hooks";

const SubHeader = () => {
  const $user = useUser();

  function toOrders() {
    window.location.href = "/orders";
  }
  return (
    <article className="flex justify-between px-3 my-5 flex-wrap gap-2">
      <section className="flex gap-2 ">
        {($user?.isAdmin || $user?.permissions?.Orders.view) && (
          <span onClick={() => toOrders()}>
            <Button className="normal-case flex gap-1 bg-secondary">
              <OrdersCards />
              View Orders
            </Button>
            <Button className="normal-case flex gap-1 bg-secondary">
              <OrdersCards />
              View Orders
            </Button>
            <Button className="normal-case flex gap-1 bg-secondary">
              <OrdersCards />
              View Orders
            </Button>
          </span>
        )}
      </section>
      <section>
        <HoldingCartsDrawer />
      </section>
    </article>
  );
};

export default SubHeader;
