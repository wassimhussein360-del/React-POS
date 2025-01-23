"use client";

import { useVendor } from "@/reduxStore/hooks";
import FirestoreService from "@/servies/firestoreService";
import { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
  Badge,
} from "@material-tailwind/react";
import { SearchIcon } from "@/assets/icons";
import { get } from "http";

const TABLE_HEAD = ["Customer", "Amount", "Status", "Status", "Account", ""];

const OrdersTable = () => {
  const vendor = useVendor();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    console.log(vendor);

    if (!vendor) return;

    FirestoreService.getSubcollection("vendors", vendor.id, "orders").then((orders) => {
      console.log({ orders });

      const formattedOrders = formatOrders(orders);
      setOrders(formattedOrders);
      console.log({ formattedOrders });
    });
  }, [vendor]);

  return (
    <Card className="container shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Orders Table
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are details about the orders made in your store.
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input label="Search" icon={<SearchIcon className="h-5 w-5" />} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-auto px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders
              .slice(0, 1000)
              .map(
                (
                  { customerName, items, paymentType, createdAt, quantity, total, currency },
                  index
                ) => {
                  const isLast = index === orders.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {customerName}
                          </Typography>
                        </div>
                      </td>

                      <td className={classes}>
                        <div className="flex items-center gap-3 max-w-[350px]">
                          <div className="flex flex-wrap gap-2">
                            {items.map((item: any) => {
                              return (
                                <Badge
                                  content={item.quantity}
                                  key={item.id}
                                  withBorder
                                  className="text-[9px] !w-2 !h-2 bg-gray-200 text-secondary"
                                >
                                  <Avatar
                                    src={item.images[0].url}
                                    alt={item.name}
                                    size="md"
                                    className="border border-gray-400 bg-blue-gray-50/50 object-contain p-1"
                                  />
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      </td>

                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          X {quantity}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography variant="small" color="orange" className="font-normal">
                          {currency} <b>{total}</b>
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {createdAt}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <div className="w-min">
                          <Chip
                            size="sm"
                            className=" rounded-full"
                            variant="ghost"
                            value={paymentType}
                            color={getColor(paymentType)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button variant="outlined" size="sm">
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <IconButton variant="outlined" size="sm">
            1
          </IconButton>
          <IconButton variant="text" size="sm">
            2
          </IconButton>
          <IconButton variant="text" size="sm">
            3
          </IconButton>
          <IconButton variant="text" size="sm">
            ...
          </IconButton>
          <IconButton variant="text" size="sm">
            8
          </IconButton>
          <IconButton variant="text" size="sm">
            9
          </IconButton>
          <IconButton variant="text" size="sm">
            10
          </IconButton>
        </div>
        <Button variant="outlined" size="sm">
          Next
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrdersTable;

const formatOrders = (orders: any[]) => {
  return orders.map((order) => {
    const customerName = order.customer?.name;
    const items = order.cart?.cartItems;
    const paymentType = order.paymentMethod?.name;
    const currency = order.cart.currency;
    const quantity = order.cart.quantity;
    const total = (order.cart.total || 0).toFixed(2);
    const createdAt = new Date(order.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "2-digit",
    });

    return { customerName, items, paymentType, createdAt, quantity, total, currency };
  });
};

function getColor(status: string): any {
  if (!status) return "gray"; // Default color for undefined or empty statuses

  const lowerCase = status.toLowerCase();

  switch (lowerCase) {
    case "cash":
      return "green";
    case "credit card":
      return "amber";
    case "unset":
      return "red";
    case "apple pay":
      return "indigo";
    case "mastercard":
      return "orange";
    default:
      return "gray";
  }
}
