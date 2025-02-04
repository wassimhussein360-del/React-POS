import { $getFromLocal } from "@/app/helpers/helpers";
import { useAppDispatch, useCart, useGeneral, useVendor } from "@/reduxStore/hooks";
import { HoldCart } from "@/reduxStore/slices/cartSlice";
import { Button, Drawer, IconButton, Typography } from "@material-tailwind/react";
import React, { useEffect } from "react";

const HoldingCartsDrawer = () => {
  const dispatch = useAppDispatch();
  const [openRight, setOpenRight] = React.useState(false);
  const [holdenCarts, setHoldenCars] = React.useState([]);
  const cart = useCart();
  const vendor = useVendor();
  const $general = useGeneral();

  useEffect(() => {
    if (!vendor && !$general.branch?.id) return;

    const allVendorsCarts = $getFromLocal("carts");
    if (allVendorsCarts) {
      const cartKey = `${vendor?.id as string}_${$general.branch?.id}`;

      const currentVendorCarts = allVendorsCarts[cartKey] || [];
      const holdingCarts = currentVendorCarts.filter((cart: any) => cart.holdingName);
      if (holdingCarts.length) {
        setHoldenCars(holdingCarts);
      } else {
        setHoldenCars([]);
      }
    }
  }, [cart, vendor, $general.branch]);

  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);

  const handleCartSelection = (cartKey: string) => {
    // This will be the holding nam eof the existing cart
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

    dispatch(HoldCart({ holdingName: formattedDate, vendorId: vendor?.id as string, cartKey }));

    closeDrawerRight();
  };

  return (
    <React.Fragment>
      <div className={`flex flex-wrap gap-4 animate-pulse  ${holdenCarts.length || "hidden"}`}>
        <Button className="normal-case flex" onClick={openDrawerRight}>
          <span className="bg-white text-black flex-center p-0 w-5 rounded me-2">
            {holdenCarts.length}
          </span>
          Holden Carts
        </Button>
      </div>

      <Drawer
        placement="right"
        open={openRight}
        onClose={closeDrawerRight}
        className="p-4"
        overlayProps={{ className: "fixed z-[9999]" }}
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Holden Carts
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawerRight}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </IconButton>
        </div>

        <section className="flex flex-col gap-4">
          {holdenCarts.map((cart: any, index: number) => {
            return (
              <section
                className="border border-gray-200 p-4 rounded-lg shadow bg-light-primary cursor-pointer hover:border-primary  bg-gray-100 text-secondary hover:text-primary"
                onClick={() => handleCartSelection(cart.key)}
              >
                <Typography variant="h5" className="text-md mb-3 font-sourGummy">
                  {cart.holdingName}
                </Typography>
                <aside className="flex gap-2">
                  {cart.items.map((item: any, index: number) => {
                    return (
                      <img
                        src={item.image}
                        className="w-10 h-10 rounded shadow border-2 border-gray-400"
                      ></img>
                    );
                  })}
                </aside>
              </section>
            );
          })}
        </section>
      </Drawer>
    </React.Fragment>
  );
};

export default HoldingCartsDrawer;
