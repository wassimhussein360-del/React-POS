import { Item, Vendor } from "@/app/abstraction/types";
import { Plus } from "@/assets/icons";
import { useAppDispatch, useCart, useCartItems, useVendor } from "@/reduxStore/hooks";
import { algoliaSearch } from "@/servies/algoliaSearch";
import {
  Select,
  Option,
  Button,
  Textarea,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Spinner,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import React from "react";
import { formatProducts } from "../products/products";
import { $getColorFromString, $getImgAlter } from "@/app/helpers/helpers";
import ProductDetails from "../products/productDetails";
import { AddItem, SetCartField, UpdateQuantity } from "@/reduxStore/slices/cartSlice";
import NewCustomerDialog from "./dialogs/newCustomer";
import FirestoreService from "@/servies/firestoreService";
import AddressesDialog from "./dialogs/addressesDialo";

const CustomerAndProductSelection = () => {
  const [customerSearch, setCustomerSearch] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [newCustomer, setNewCustomer] = useState<any>();
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>("");
  const [customerLoading, setCustomerLoading] = useState<boolean>(false);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [addressesDialog, setAddressesDialog] = useState(true);
  const [addCustomerDialog, setAddCustomerDialog] = useState<boolean>(false);
  const [product, setProduct] = useState<Item>();

  const [openDetails, setOpenDetails] = useState(false);

  const [productSearch, setProductSearch] = useState<string>("");
  const [products, setProducts] = useState<Item[]>([]);

  const dispatch = useAppDispatch();
  const vendor = useVendor() as Vendor;
  const cartItems = useCartItems();
  const cart = useCart();

  function handleProductSelect(_product: Item) {
    setProduct(_product);
    if (_product.modifiers.length) setOpenDetails(true);
    else {
      const foundItem = cartItems.find((itm) => itm.id == _product.id);
      if (foundItem) {
        dispatch(UpdateQuantity({ id: _product.id, quantity: foundItem.quantity + 1 }));
      } else {
        dispatch(AddItem(_product));
      }
    }
  }

  useEffect(() => {
    if (!vendor || productSearch.length < 3) return;
    setProductLoading(true);

    algoliaSearch(vendor.id, "products", productSearch)
      .then((productRes) => {
        const formattedProducts = formatProducts(productRes, vendor.id);
        setProducts(formattedProducts);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setProductLoading(false);
      });
  }, [productSearch]);

  useEffect(() => {
    if (!vendor || customerSearch.length < 3) return;
    setCustomerLoading(true);

    algoliaSearch(vendor.id, "customers", customerSearch)
      .then((hits) => {
        console.log(hits);

        setCustomers(hits);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setCustomerLoading(false);
      });
  }, [customerSearch]);

  useEffect(() => {
    if (!selectedCustomer) return;
    const foundCustomer = customers.find((cus) => cus.id == selectedCustomer);
    if (foundCustomer) {
      dispatch(SetCartField({ fieldName: "customer", value: foundCustomer, vendorId: vendor.id }));
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (newCustomer) {
      setSelectedCustomerName(newCustomer.name);
      dispatch(SetCartField({ fieldName: "customer", value: newCustomer, vendorId: vendor.id }));
    }
  }, [newCustomer]);

  useEffect(() => {
    const cus = cart.customer;
    const name = cus ? cus.name : "";

    setSelectedCustomerName(name);
  }, [cart]);

  return (
    <section>
      <NewCustomerDialog
        open={addCustomerDialog}
        handleOpen={() => setAddCustomerDialog(!addCustomerDialog)}
        setCustomer={setNewCustomer}
      />
      {selectedCustomerName && (
        <AddressesDialog
          open={addressesDialog}
          handleOpen={() => setAddressesDialog(!addressesDialog)}
        />
      )}

      {product && (
        <ProductDetails
          open={openDetails}
          handleOpen={() => setOpenDetails(!openDetails)}
          product={product}
        />
      )}

      <h6 className="text-sm">Customers Information</h6>
      <div className="my-3 flex ">
        {/* Customer Selection */}
        <Menu>
          <MenuHandler>
            <Button
              className={`w-full text-start  normal-case bg-transparent hover:shadow-none flex justify-between items-center  border border-gray-500 shadow-none rounded-xl
                ${selectedCustomerName ? "text-primary" : "text-gray-400"}`}
            >
              {selectedCustomerName || "Walk in Customer"}
              {customerLoading && <Spinner className="w-4 h-4" />}
            </Button>
          </MenuHandler>
          <MenuList className="max-h-[20rem]">
            <MenuItem className="hover:bg-none p-0">
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 border border-gray-300 rounded hover:outline-none focus:border-gray-500"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomerSearch(value);
                }}
              />
            </MenuItem>
            <br />

            {customers.map((cus, i) => {
              return (
                <MenuItem
                  className={`${cus.id == selectedCustomer && "bg-gray-200"}`}
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCustomer(cus.id);
                    setSelectedCustomerName(cus.name);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {cus.image ? (
                      <img src={cus.image} alt={cus.name} className="w-8 h-8   rounded-full " />
                    ) : (
                      <div
                        className="w-8 h-8 flex-center font-sourGummy font-semibold text-secondary rounded-full "
                        style={{ backgroundColor: $getColorFromString(cus.id) }}
                      >
                        {$getImgAlter(cus.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-secondary"> {cus.name}</p>
                      <p className="text-xs text-gray-400"> {cus.phone}</p>
                    </div>
                  </div>
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
        {/* End Customer Selection */}

        <Button
          className="ms-2 bg-secondary flex-center rounded-full p-0 aspect-square min-w-10 min-h-10 "
          size="sm"
          placeholder={undefined}
          onClick={() => setAddressesDialog(true)}
        >
          <i className="bi bi-geo-alt-fill flex-center  text-primary text-lg"></i>
        </Button>

        <Button
          className="ms-2 bg-primary flex-center rounded-full p-0 aspect-square min-w-10 min-h-10 "
          size="sm"
          placeholder={undefined}
          onClick={() => setAddCustomerDialog(true)}
        >
          <Plus />
        </Button>
      </div>

      {/* Product Selection */}
      <Menu>
        <MenuHandler>
          <Button
            className={`w-full text-start shadow  normal-case bg-transparent hover:shadow-none flex justify-between items-center   border border-gray-500 shadow-none rounded-xl
                ${"text-gray-400"}`}
          >
            {"Search Products"}
            {productLoading && <Spinner className="w-4 h-4" />}
          </Button>
        </MenuHandler>
        <MenuList className="max-h-[20rem]">
          <MenuItem className="hover:bg-none p-0">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border border-gray-300 rounded hover:outline-none focus:border-gray-500"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                const value = e.target.value;
                setProductSearch(value);
              }}
            />
          </MenuItem>
          <br />

          {products.map((pr: Item, i: number) => {
            return (
              <MenuItem
                onClick={() => {
                  handleProductSelect(pr);
                }}
              >
                <div className="flex items-center gap-2">
                  <img src={pr.image} alt={pr.image} className="w-8 h-8   rounded-full " />
                  <div>
                    <p className="text-sm"> {pr.name}</p>
                    <p className="text-xs">
                      {" "}
                      <span className=" text-warning">KD {pr.price.toFixed(2)} </span>
                    </p>
                  </div>
                </div>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
      {/* End Product Selection */}
    </section>
  );
};

export default CustomerAndProductSelection;
