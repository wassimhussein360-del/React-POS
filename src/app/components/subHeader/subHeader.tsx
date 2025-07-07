import { OrdersCards } from "@/assets/icons";
import { Button } from "@material-tailwind/react";
import HoldingCartsDrawer from "../drawers/holdedCarts";
import { useRouter } from "next/navigation";
import { useUser } from "@/reduxStore/hooks";
import Link from "next/link";

const SubHeader = () => {
  const navigator = useRouter();
  const $user = useUser();

  return (
    <article className="flex justify-between px-3 my-5 flex-wrap gap-2">
      <section className="flex gap-2 ">
        {($user?.isAdmin || $user?.permissions?.Orders.view) && (
          <Link href={"/orders"}>
            <Button className="normal-case flex gap-1 bg-secondary">
              <OrdersCards />
              View Orders
            </Button>
          </Link>
        )}
      </section>
      <section>
        <HoldingCartsDrawer />
      </section>
    </article>
  );
};

export default SubHeader;
