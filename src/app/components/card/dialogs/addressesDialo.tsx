import { Dialog } from "@material-tailwind/react";
import "./cartDialogs.css";
import { useEffect, useState } from "react";
import { useAddress, useAppDispatch, useCustomer, useVendor } from "@/reduxStore/hooks";
import FirestoreService from "@/servies/firestoreService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import AddressForm from "../forms/address";
import { SetCartField } from "@/reduxStore/slices/cartSlice";

interface CashPayProps {
  open: boolean;
  handleOpen: () => void;
}

const AddressesDialog: React.FC<CashPayProps> = ({ open, handleOpen }) => {
  const dispatch = useAppDispatch();
  const customer = useCustomer();
  const address = useAddress();
  const vendor = useVendor();
  const [addresses, setAddresses] = useState<any[]>([]);
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
    if (!Object.keys(selectedAddress).length) return;
    setAddNew(false);

    const tryFind = addresses.find((add) => add.id == selectedAddress.id);
    if (!tryFind) {
      addresses.unshift(selectedAddress);
    }

    dispatch(
      SetCartField({ fieldName: "address", value: selectedAddress, vendorId: vendor?.id as string })
    );
  }, [selectedAddress]);

  const getBody = () => {
    return (
      <Swiper
        spaceBetween={30}
        slidesPerView={addresses.length > 1 ? 1.2 : 1}
        pagination={{
          type: "fraction",
          currentClass: "text-primary ",
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className=" max-w-[400px] min-w-[350px] "
      >
        {addresses.map((address, index) => (
          <SwiperSlide
            key={index}
            className={` shadow-lg min-h-[300px]  rounded-lg p-6 border   text-xs border-gray-200 mt-5 mb-10 ${
              selectedAddress.id == address.id
                ? "bg-secondary text-white"
                : " text-secondary cursor-pointer"
            } `}
            onClick={() => setSelectedAddress(address)}
          >
            <h2 className="font-semibold text-xl text-primary">{address.area}</h2>

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
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="flex justify-center  bg-transparent shadow-transparent  "
      placeholder={undefined}
    >
      <article className=" bg-white shadow-xl shadow-gray-800 rounded-xl pt-6 px-8">
        <div className="flex-center gap-3 text-2xl ">
          <p className="text-center text-secondary font-medium">Choose Address</p>
          <i className="bi bi-geo text-primary font-semibold "></i>
        </div>
        {!!addresses.length && (
          <p
            className="text-center text-xs underline cursor-pointer hover:font-semibold hover:scale-105 transition-transform"
            onClick={() => setAddNew(!addNew)}
          >
            {addNew ? "Select An Existing Address ?" : " Add New Address ?"}
          </p>
        )}
        {addNew ? <AddressForm setSelectedAddress={setSelectedAddress} /> : getBody()}
      </article>
    </Dialog>
  );
};

export default AddressesDialog;
