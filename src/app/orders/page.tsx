"use client";

import { useLoader } from "@/reduxStore/hooks";
import OrdersTable from "./ordersTable";

const Orders = () => {
  const isLoading = useLoader();
  if (isLoading) return;

  return (
    <article className="w-full mt-10 flex justify-center">
      <OrdersTable />
    </article>
  );
};

export default Orders;
