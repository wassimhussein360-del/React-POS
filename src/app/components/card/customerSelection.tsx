import { Item, Vendor } from "@/app/abstraction/types";
import { BarcodeIcon, Plus, SearchIcon } from "@/assets/icons";
import {
  useAddress,
  useAppDispatch,
  useCart,
  useCartItems,
  useGeneral,
  useVendor,
} from "@/reduxStore/hooks";
import { algoliaSearch } from "@/servies/algoliaSearch";
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Spinner,
  Input,
} from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { formatProducts } from "../products/products";
import { $currency, $getColorFromString, $getImgAlter, $translate } from "@/app/helpers/helpers";
import ProductDetails from "../products/productDetails";
import { AddItem, SetCartField, UpdateQuantity } from "@/reduxStore/slices/cartSlice";
import NewCustomerDialog from "./dialogs/newCustomer";
import AddressesDialog from "./dialogs/addressesDialo";
import toast from "react-hot-toast";

const CustomerAndProductSelection = () => {
  const [customerSearch, setCustomerSearch] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [newCustomer, setNewCustomer] = useState<any>();
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>("");
  const [customerLoading, setCustomerLoading] = useState<boolean>(false);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [addressesDialog, setAddressesDialog] = useState(false);
  const [addCustomerDialog, setAddCustomerDialog] = useState<boolean>(false);
  const [product, setProduct] = useState<Item>();

  const [openDetails, setOpenDetails] = useState(false);

  const [states, setStates] = useState({
    isScanner: false,
    showProducts: false,
  });
  const getValue = (field: keyof typeof states) => {
    return states[field];
  };
  const setValue = (field: keyof typeof states, newValue: any) => {
    setStates((prev) => ({ ...prev, [field]: newValue }));
  };

  const [productSearch, setProductSearch] = useState<string>("");
  const [products, setProducts] = useState<Item[]>([]);

  const dispatch = useAppDispatch();
  const vendor = useVendor() as Vendor;
  const cartItems = useCartItems();
  const cart = useCart();
  const address = useAddress();
  const $general = useGeneral();

  function handleProductSelect(_product: Item) {
    setProduct(_product);

    setTimeout(() => {
      setValue("showProducts", false); // ✅ Ensure menu closes after selection
    }, 0);

    if (_product.assignedModifiers.length) {
      setOpenDetails(true);
    } else {
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
        const formattedProducts = formatProducts(productRes, $general.branch.id);
        setProducts(formattedProducts);
        setValue("showProducts", formattedProducts.length > 0);

        if (getValue("isScanner")) {
          if (formattedProducts.length > 0) {
            handleProductSelect(formattedProducts[0]);
          } else {
            toast.error("Item Not Found !!");
          }

          focusInput();
          setProductSearch("");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setProductLoading(false);
      });
  }, [productSearch]);

  useEffect(() => {
    if (!vendor || customerSearch.length < 1) return;
    setCustomerLoading(true);

    algoliaSearch(vendor.id, "customers", customerSearch)
      .then((hits) => {
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
      dispatch(SetCartField({ fieldName: "customer", value: foundCustomer }));
      dispatch(SetCartField({ fieldName: "address", value: undefined }));
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (newCustomer) {
      setSelectedCustomerName(newCustomer.name);
      dispatch(SetCartField({ fieldName: "customer", value: newCustomer }));
    }
  }, [newCustomer, states]);

  useEffect(() => {
    const cus = cart.customer;
    const name = cus ? cus.name : "";

    setSelectedCustomerName(name);
  }, [cart]);

  const sectionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to focus on the input
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
        setValue("showProducts", false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <h6 className="text-sm">Customers </h6>
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
          <MenuList className="max-h-[20rem] z-[9999]">
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
                      <p className="text-sm text-secondary">
                        {" "}
                        {$translate({
                          en: cus.name || cus.displayName || cus.an?.displayName,
                          ar: cus.ar?.displayName,
                        })}
                      </p>
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
          className={`ms-2  flex-center rounded-full p-0 shadow aspect-square min-w-10 min-h-10
            ${cart.customer && cart.selections?.orderType == "delivery" ? "" : " !hidden "}  ${
            address ? "bg-secondary" : "bg-transparent"
          }`}
          size="sm"
          onClick={() => setAddressesDialog(true)}
        >
          <i
            className={`bi  flex-center   text-lg ${
              address ? "text-primary bi-geo-alt-fill" : "bi-geo-alt text-secondary"
            }`}
          ></i>
        </Button>

        <Button
          className="ms-2 bg-primary flex-center rounded-full p-0 aspect-square min-w-10 min-h-10 "
          size="sm"
          onClick={() => setAddCustomerDialog(true)}
        >
          <Plus />
        </Button>
      </div>

      {/* Product Selection */}

      <div className="flex">
        <section
          ref={sectionRef}
          className="relative w-full"
          onClick={() => setValue("showProducts", products.length > 0)}
        >
          <aside
            className="flex justify-between w-full bg-transparent ps-6 pe-3 text-xs items-center 
      border border-gray-500 shadow-none rounded-xl hover:border-gray-900 h-full"
          >
            <input
              type="text"
              ref={inputRef}
              value={productSearch}
              placeholder={getValue("isScanner") ? "Scan Products" : "Search Products"}
              className="w-fit focus:border-0 focus:outline-none"
              onChange={(e) => setProductSearch(e.target.value)}
            />
            {productLoading && <Spinner className="w-4 h-4" />}
          </aside>

          <aside
            className={`${
              getValue("showProducts") && !getValue("isScanner")
                ? "absolute bg-white z-10 p-3 mt-1 w-full border border-gray-500 shadow-lg rounded-xl"
                : "hidden"
            }`}
          >
            {products.map((pr: Item, i: number) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  handleProductSelect(pr);
                }}
              >
                <img src={pr.images[0].url} alt={pr.name.en} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-sm">{$translate(pr.name)}</p>
                  <p className="text-xs">
                    <span className="text-warning">
                      {$currency()} {pr.price.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </aside>
        </section>

        <Button
          className="ms-2 bg-transparent border border-gray-400 flex-center rounded-full p-0 aspect-square min-w-10 min-h-10 "
          size="sm"
          onClick={() => {
            setValue("isScanner", !getValue("isScanner"));
            setProductSearch("");
          }}
        >
          {getValue("isScanner") ? (
            <SearchIcon color="black"></SearchIcon>
          ) : (
            <BarcodeIcon className="w-5 h-5"></BarcodeIcon>
          )}
        </Button>
      </div>

      {/* End Product Selection */}
    </section>
  );
};

export default CustomerAndProductSelection;
