import { Dialog } from "@material-tailwind/react";
import "./cartDialogs.css";
import { useEffect, useState } from "react";
import {
  useAddress,
  useAppDispatch,
  useCart,
  useCustomer,
  useGeneral,
  useVendor,
} from "@/reduxStore/hooks";
import FirestoreService from "@/servies/firestoreService";
import "swiper/css";
import "swiper/css/pagination";
import AddressForm from "../forms/address";
import { SetCartField } from "@/reduxStore/slices/cartSlice";
import { Indexable } from "@/app/abstraction/types";
import { $getFromLocal, $toTitleCase, $writeOnLocal } from "@/app/helpers/helpers";
import { SetGeneralField } from "@/reduxStore/slices/generalSlice";
import toast from "react-hot-toast";
import { Chevron } from "@/assets/icons";
import { getShippingRates } from "@/servies/fire-functions";
import { getOrderPayload } from "../actionsBtns";

interface CashPayProps {
  open: boolean;
  handleOpen: () => void;
}

const AddressesDialog: React.FC<CashPayProps> = ({ open, handleOpen }) => {
  const dispatch = useAppDispatch();
  const customer = useCustomer();
  const address = useAddress();
  const $cart = useCart();
  const vendor = useVendor();
  const $general = useGeneral();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [openedAddress, setOpenedAddress] = useState<number>(-1);
  const [selectedAddress, setSelectedAddress] = useState<{ [key: string]: any }>({});
  const [addNew, setAddNew] = useState<boolean>(false);

  useEffect(() => {
    if (!customer) return;

    FirestoreService.getSubcollection("customers", customer.id, "addresses").then((res: any[]) => {
      if (address) {
        const foundAddress = res.find((add) => add.id == address.id);
        if (foundAddress) {
          setSelectedAddress(foundAddress);
        }
      }

      if (!res.length) setAddNew(true);
      else setAddresses(res);
    });
  }, [customer]);

  useEffect(() => {
    const updateAddress = async () => {
      let { _outlet, _zone }: Indexable = { _outlet: null, _zone: null };
      const outlets = $general.outlets;

      _outlet =
        outlets.find(
          (olt) =>
            (_zone = olt.zones.find((zone: Indexable) =>
              zone.areas.some((area: string) => JSON.parse(area).area.en === selectedAddress.area)
            ))
        ) || null;

      if (!Object.keys(selectedAddress).length || !(await switchBranch(_outlet, _zone))) return;
      setAddNew(false);

      const tryFind = addresses.find((add) => add.id === selectedAddress.id);
      if (!tryFind) {
        addresses.unshift(selectedAddress);
      }

      dispatch(
        SetCartField({
          fieldName: "address",
          value: selectedAddress,
        })
      );
    };

    updateAddress();
  }, [selectedAddress]);

  useEffect(() => {
    if (!$cart.address) {
      setSelectedAddress({});
    } else {
      getShippings();
    }
  }, [$cart.address, $general.zone]);

  const switchBranch = async (_outlet: any, _zone: any): Promise<boolean> => {
    // if the selected address has'nt found in any branch
    if (!_outlet || !_zone) {
      toast.error("The Provided Address Does not belong to any branch !!", { duration: 10_000 });
      setSelectedAddress({});
      return false;
    }

    if ($general.branch.id !== _outlet?.id) {
      // check if the selected products belong to the selected branch
      const newBranchProductsIds = await fetchBranchProductsIds(_outlet?.id);
      const items = $cart.items.map((item) => item.id);

      // Check if at least one item does NOT belong to newBranchProductsIds
      const hasInvalidItem = items.some((productId) => !newBranchProductsIds.includes(productId));

      if (hasInvalidItem) {
        toast.error(
          "Unable to switch branch: some products aren't available at the selected address's branch.",
          { duration: 10_000 }
        );
        setSelectedAddress({});
        return false;
      }
      // End

      const { oldKey, newKey } = {
        oldKey: `${vendor?.id}_${$general.branch.id}`,
        newKey: `${vendor?.id}_${_outlet.id}`,
      };

      // remove cart from local on current branch
      const localCart = $getFromLocal("carts");
      localCart[oldKey] = localCart[oldKey].filter(
        (cart: { key: string }) => cart.key != $cart.key
      );

      // Add the current cart to new outlet
      if (!localCart[newKey]) localCart[newKey] = [];
      localCart[newKey] = localCart[newKey].map((cart: { key: string }) => ({
        ...cart,
        active: false,
      }));
      localCart[newKey].push($cart);

      //save changes to local storage
      $writeOnLocal("carts", localCart);
      $writeOnLocal("branch", _outlet);

      // change cart from global state
      dispatch(SetGeneralField({ field: "branch", value: _outlet }));

      toast.success("Switched to address belonging branch 👌");
      handleOpen();
    }
    dispatch(SetGeneralField({ field: "zone", value: _zone }));

    return true;
  };
  const getShippings = () => {
    const order = getOrderPayload($general.order, $cart.address);
    const snapshot = JSON.parse(JSON.stringify(order.selections));

    const ord: any = { ...order, ...snapshot };
    delete ord.selections;

    const payload = { order: ord, vendorId: vendor?.id };

    if (!payload.order.address.deliveryZoneId) return;

    getShippingRates(payload)
      .then((shippingRatesResponse) => {
        dispatch(
          SetGeneralField({
            field: "shippingMethods",
            value: shippingRatesResponse.data,
          })
        );
      })
      .catch((err) => console.error(err));
  };

  const fetchBranchProductsIds = (branchId: string): Promise<string[]> => {
    return FirestoreService.getSubcollection("vendors", vendor?.id as string, "products")
      .then((fetchedProducts) =>
        fetchedProducts
          .filter((product: any) => product.branchesIds.includes(branchId))
          .map((product: any) => product.id)
      )
      .catch((error) => {
        console.error("Error fetching products:", error);
        return []; // Return an empty array on error
      });
  };

  const getBody = () => {
    return (
      <section className=" max-w-[400px] min-w-[400px] overflow-auto   mt-4 pb-5 max-h-[300px] px-8">
        {addresses.map((address, index) => (
          <aside
            key={index}
            className={` shadow-sm  rounded-lg px-5 py-2 border   text-xs   mb-2 ${
              selectedAddress.id == address.id ? "border-gray-900 " : " border-gray-400"
            } `}
            onClick={() => setOpenedAddress(index == openedAddress ? -1 : index)}
          >
            <div
              className={`text-lg font-semibold   flex justify-between items-center
              ${selectedAddress.id == address.id ? "text-primary" : " "}
              `}
            >
              <h2 className="">
                {address.area}
                {address.label && <span className=""> • {$toTitleCase(address.label)}</span>}
              </h2>
              <Chevron className="w-4 h-4 fill-white"></Chevron>
            </div>
            <figure
              className={openedAddress == index ? "address-opened" : "address-closed"}
              onClick={() => setSelectedAddress(address)}
            >
              <hr
                className={`my-2 border ${
                  selectedAddress.id == address.id ? "border-white opacity-10" : "gray-100"
                }`}
              />
              <section className="flex justify-between">
                <div className="text-center">
                  <p>Street</p>
                  <p className="text-lg font-medium">{address.street || "--"}</p>
                </div>

                <div className="text-center">
                  <p>Building</p>
                  <p className="text-lg font-medium">{address.building || "--"}</p>
                </div>

                <div className="text-end">
                  <p>Floor</p>
                  <p className="text-lg font-medium ">{address.floor || "--"}</p>
                </div>
              </section>
              <hr
                className={`my-2 border ${
                  selectedAddress.id == address.id ? "border-white opacity-10" : "gray-100"
                }`}
              />

              <section className="flex justify-between">
                <div className="">
                  <p>Country</p>
                  <p className="text-lg font-medium"> {address.country || "--"}</p>
                </div>

                <div>
                  <p>Province</p>
                  <p className="text-lg font-medium">{address.province || "--"}</p>
                </div>
              </section>

              <hr
                className={`my-2 border ${
                  selectedAddress.id == address.id ? "border-white opacity-10" : "gray-100"
                }`}
              />
              <div>
                <p className="text-xs ">Special Instructions</p>
                <p className=" text-lg  font-medium">{address.specialInstruction || "--"}</p>
              </div>
            </figure>
          </aside>
        ))}
      </section>
    );
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="flex justify-center  bg-transparent shadow-transparent  "
    >
      <article className=" bg-white shadow-xl shadow-gray-800 rounded-xl py-6 ">
        <div className="flex-center gap-3 text-2xl ">
          <p className="text-center text-secondary font-medium">Choose Address</p>
          <i className="bi bi-geo text-primary font-semibold "></i>
        </div>
        {!!addresses.length && (
          <p
            className="text-center text-xs underline cursor-pointer hover:font-semibold hover:scale-105 transition-transform"
            onClick={() => setAddNew(!addNew)}
          >
            {addNew ? "Select An Existing Address" : " Add New Address"}
          </p>
        )}
        {addNew ? <AddressForm setSelectedAddress={setSelectedAddress} /> : getBody()}
      </article>
    </Dialog>
  );
};

export default AddressesDialog;
