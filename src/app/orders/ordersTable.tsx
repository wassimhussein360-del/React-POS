"use client";

import { useVendor } from "@/reduxStore/hooks";
import FirestoreService from "@/servies/firestoreService";
import { useEffect, useRef, useState } from "react";

import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  Input,
  Badge,
  Spinner,
  Button,
} from "@material-tailwind/react";
import { SearchIcon } from "@/assets/icons";
import { _getProducts } from "@/servies/analyticsServise";
import Paginator from "../components/table/paginator";
import { $currency, $formatDate, $loader, $toTitleCase } from "../helpers/helpers";
import { algoliaSearch } from "@/servies/algoliaSearch";
import { AnalyticsVariables, Indexable } from "../abstraction/types";
import UpdateStatusForm from "./updateStatusForm";

const TABLE_HEAD = [
  { name: "Ordered", sortable: true, sortBy: "createdAt" },
  { name: "Customer", sortable: false },
  { name: "Cart Items", sortable: false },
  { name: "Type & Payment", sortable: true, sortBy: "paymentMethod" },
  { name: "Total", sortable: true, sortBy: "totalAmount" },
  { name: "Status", sortable: true, sortBy: "status" },
];

const OrdersTable = () => {
  const vendor = useVendor();
  const [orders, setOrders] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);

  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({});
  const [sorSetting, setSortSetting] = useState({ by: "createdAt", dir: "desc" });

  const [selectedOrders, setSelectedOrders] = useState<any[]>([]);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = (clickedOrder: any) => {
    if (!selectedOrders.some((ord) => ord.id == clickedOrder.id) && selectedOrders.length === 0) {
      pressTimerRef.current = setTimeout(() => {
        setSelectedOrders([...selectedOrders, clickedOrder]);
        console.log("Long press detected!"); // Perform your action here
      }, 600); // Adjust time for long press (600ms)
    } else {
      selectedOrders.some((ord) => ord.id == clickedOrder.id)
        ? setSelectedOrders(selectedOrders.filter((ord) => ord.id !== clickedOrder.id))
        : setSelectedOrders([...selectedOrders, clickedOrder]);
    }
  };

  const handleMouseLeave = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const fetchData = () => {
    if (!vendor) return;

    $loader(true);
    _getProducts({
      limit: itemsPerPage,
      page: currentPage,
      interval: "allTime",
      query: filters,
      sortBy: [`${sorSetting.by.toUpperCase()}_${sorSetting.dir.toUpperCase()}`],
    })
      .then((ordersRep) => {
        console.log(ordersRep.orders.docs);

        setOrders(ordersRep.orders.docs);
        setTotalItems(ordersRep.orders.totalDocs);
      })
      .finally(() => {
        $loader(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [vendor, currentPage, filters, sorSetting]);

  useEffect(() => {
    if (search.length < 3 && search) return;
    setIsSearching(true);

    algoliaSearch(vendor.id, "orders", search)
      .then((hits) => {
        const ids = hits.map((hit) => hit.id);
        if (ids.length) addFilter("id", ids);
        else removeFilter("id");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsSearching(false);
      });
  }, [search]);

  const addFilter = (filed: string, value: any) => {
    setFilters((prev) => ({ ...prev, [filed]: value }));
  };
  const removeFilter = (filed: string) => {
    const updatedFilters: Indexable = { ...filters };
    delete updatedFilters[filed];
    setFilters(updatedFilters);
  };

  return (
    <>
      <UpdateStatusForm
        open={openForm}
        handleOpen={() => setOpenForm(!openForm)}
        orders={selectedOrders}
      />
      <Card className="container shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Orders Table
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                These are details about the orders made in your POS.
              </Typography>
            </div>
            <div className="flex items-center w-full shrink-0 gap-2 md:w-max ">
              {/* Actions */}
              {!!selectedOrders.length && (
                <Button className=" bg-secondary flex gap-1 text-primary ps-4 pe-3">
                  <span className="flex gap-2" onClick={() => setOpenForm(true)}>
                    <nav className="rounded bg-primary px-1 text-secondary">
                      {selectedOrders.length}
                    </nav>{" "}
                    Status
                  </span>
                  <i
                    className="bi bi-x-lg text-danger ms-2"
                    onClick={() => {
                      setSelectedOrders([]);
                    }}
                  ></i>
                </Button>
              )}
              {/* End Actions */}

              {/* Search */}
              <div className="w-auto md:w-72">
                <Input
                  label="Search"
                  icon={
                    isSearching ? (
                      <Spinner className="h-5 w-5" />
                    ) : (
                      <SearchIcon className="h-5 w-5" />
                    )
                  }
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* End Search */}
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head.name}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-normal leading-none opacity-70 ${
                        head.sortable ? "cursor-pointer" : ""
                      } ${head.sortBy == sorSetting.by ? "text-primary font-semibold" : ""}`}
                      onClick={() =>
                        head.sortable
                          ? setSortSetting({
                              by: head.sortBy,
                              dir:
                                sorSetting.by == head.sortBy && sorSetting.dir == "asc"
                                  ? "desc"
                                  : "asc",
                            })
                          : {}
                      }
                    >
                      {head.name}
                      {head.sortable && (
                        <i
                          className={`bi ms-1 ${
                            head.sortBy == sorSetting.by && sorSetting.dir == "asc"
                              ? "bi-sort-down-alt"
                              : "bi-sort-up"
                          }`}
                        ></i>
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(
                (
                  {
                    customer,
                    address,
                    cart,
                    paymentMethod,
                    status,
                    orderType,
                    createdAt,
                    orderRef,
                    id,
                  },
                  index
                ) => {
                  const classes = "p-4 border-b border-blue-gray-50 ";

                  return (
                    <tr
                      key={index}
                      onPointerDown={(e) => handleMouseDown(orders[index])}
                      onMouseLeave={handleMouseLeave}
                      onTouchEnd={handleMouseLeave}
                      onMouseUp={handleMouseLeave}
                      className={`${
                        selectedOrders.some((ord) => ord.id == id) ? "bg-primary-light   " : ""
                      }`}
                    >
                      {/* Ordered Date */}
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {createdAt ? $formatDate(createdAt, "DD, MMM, YY - HH:MM") : ""}
                        </Typography>
                        <Typography variant="small" className="text-gray-600">
                          #{orderRef}
                        </Typography>
                      </td>
                      {/* End Ordered Date */}

                      {/* Customer Details */}
                      <td className={classes}>
                        <div className={"flex items-center gap-2"}>
                          <img
                            className="rounded-full w-12 h-12"
                            src={
                              customer.image ||
                              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYFhNLjRKHgrAPc6QcPbyLKcqHWmrMS6ZOqg&s"
                            }
                          ></img>
                          <div className="">
                            <Typography variant="small" className="font-bold">
                              {customer.name}
                            </Typography>
                            <Typography variant="small" className="text-gray-600">
                              {[address.country || "", address.area || ""]
                                .filter((a) => a)
                                .join(", ")}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      {/* End Customer Details */}

                      {/* Cart Items */}
                      <td className={classes}>
                        <div className="flex items-center flex-wrap gap-2 ">
                          {cart.cartItems.map((item: any, itemIndex: number) => {
                            return (
                              <Badge
                                content={item.quantity}
                                invisible
                                key={itemIndex}
                                withBorder
                                className="text-[9px] !w-2  bg-gray-200 text-secondary"
                              >
                                <Avatar
                                  src={item.image}
                                  alt={item.name}
                                  size="md"
                                  className="border border-gray-400 w-12 h-12 min-w-12 bg-blue-gray-50/50 object-contain p-1"
                                />
                              </Badge>
                            );
                          })}
                        </div>
                      </td>
                      {/* End Cart Items */}

                      {/* Order Type*/}
                      <td className={classes}>
                        <div className={`w-full flex flex-col  rounded-full gap-1`}>
                          <Chip
                            size="sm"
                            className="w-min normal-case rounded-full"
                            variant="ghost"
                            value={$toTitleCase(orderType)}
                            color={getColor(paymentMethod)}
                          />
                          {paymentMethod != "Unset" && (
                            <Chip
                              size="sm"
                              className="w-min rounded-full "
                              variant="gradient"
                              value={paymentMethod}
                              color={getColor(paymentMethod)}
                            />
                          )}
                        </div>
                      </td>
                      {/* End Order Type */}

                      {/* Quantity & Price */}
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          X {cart.quantity}
                        </Typography>
                        <Typography variant="small" color="orange" className="font-normal">
                          {$currency()} <b>{cart.total}</b>
                        </Typography>
                      </td>
                      {/* End Quantity & Price */}

                      <td className={classes}>
                        <div className="w-min">
                          <Chip
                            size="sm"
                            className=" rounded-full "
                            variant="ghost"
                            value={statusesMap[status.toLowerCase()]}
                            color={getColor(status.toLowerCase())}
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
          <Paginator
            itemsPerPage={itemsPerPage}
            dataSize={totalItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </CardFooter>
      </Card>
    </>
  );
};

export default OrdersTable;

function getColor(status: string): string {
  if (!status) return "gray"; // Default color for undefined or empty statuses

  const lowerCase = status.toLowerCase();

  if (["cash", "completed"].includes(lowerCase)) return "green";
  if (["credit card", "cart"].includes(lowerCase)) return "amber";
  if (["unset", "failed"].includes(lowerCase)) return "red";
  if (["apple pay", "pickup", "processing"].includes(lowerCase)) return "indigo";
  if (["mastercard", "delivery"].includes(lowerCase)) return "orange";

  return "gray"; // Default color
}

// TODO Make the correct match
const statusesMap: any = {
  cart: "pending",
  processing: "paid", // The last key wins if multiple keys have the same value.
  completed: "completed",
  failed: "cancelled",
};
