import { Dialog } from "@material-tailwind/react";
import "./cartDialogs.css";
import { useEffect, useState } from "react";
import { useCustomer } from "@/reduxStore/hooks";
import FirestoreService from "@/servies/firestoreService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import AddressForm from "../forms/address";

interface CashPayProps {
  open: boolean;
  handleOpen: () => void;
}

const AddressesDialog: React.FC<CashPayProps> = ({ open, handleOpen }) => {
  const customer = useCustomer();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<{ [key: string]: any }>({});
  const [addNew, setAddNew] = useState<boolean>(true);

  useEffect(() => {
    if (!customer) return;

    FirestoreService.getSubcollection("customers", customer.id, "addresses").then((res: any[]) => {
      console.log({ res });
      setAddresses(res);
    });
  }, [customer]);

  if (!addresses.length) return;

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  };

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
        {addNew && (
          <SwiperSlide
            className="shadow-lg min-h-[300px]  rounded-lg p-4 border   text-xs border-gray-200 mt-5 mb-10 text-secondary
         "
          >
            <AddressForm discard={() => setAddNew(false)} />
          </SwiperSlide>
        )}
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
        <p
          className="text-center text-xs underline cursor-pointer hover:font-semibold hover:scale-105 transition-transform"
          onClick={() => setAddNew(true)}
        >
          Add New Address ?
        </p>
        {getBody()}
      </article>
    </Dialog>
  );
};

export default AddressesDialog;
