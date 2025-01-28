import { useCustomer, useVendor } from "@/reduxStore/hooks";
import FirestoreService from "@/servies/firestoreService";
import {
  Select,
  Option,
  Stepper,
  Step,
  Button,
  Input,
  Textarea,
  Spinner,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "../cart.css";
import { createCustomerAddress } from "@/servies/fire-functions";
import toast from "react-hot-toast";

interface AddressFormInputs {
  street: string;
  building: string;
  floor: string;
  specialInstruction: string;
}

const AddressForm: React.FC<any> = ({ setSelectedAddress }: { setSelectedAddress: Function }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormInputs>();

  const vendor = useVendor();
  const customer = useCustomer();

  const [outlets, setOutlets] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Stepper
  const [activeStep, setActiveStep] = React.useState(0);
  // End Stepper

  useEffect(() => {
    if (!vendor) return;

    FirestoreService.getSubcollection("vendors", vendor.id, "outlets").then((res) => {
      setCountries(() => {
        return Array.from(new Set(res.flatMap(({ zones }) => zones.map((zone) => zone.country))));
      });

      setOutlets(res);
    });
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;

    setActiveStep(1);
    setSelectedProvince("");
    setSelectedArea("");

    setProvinces(() => {
      return Array.from(
        new Set(
          outlets
            .flatMap(({ zones }) =>
              zones
                .filter((zone) => zone.country === selectedCountry) // Filter zones by selectedCountry
                .flatMap((zone) =>
                  zone.areas.map((area) => {
                    try {
                      return JSON.parse(area).province; // Parse area and extract province
                    } catch {
                      console.error(`Failed to parse area: ${area}`);
                      return null; // Handle invalid JSON
                    }
                  })
                )
            )
            .filter((province) => province !== null) // Remove null values
        )
      );
    });
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedProvince) return;

    setActiveStep(2);
    setSelectedArea("");

    setAreas(() => {
      return Array.from(
        new Set(
          outlets.flatMap(({ zones }) =>
            zones
              .filter((zone) => zone.country === selectedCountry) // Filter by selectedCountry
              .flatMap(
                (zone) =>
                  zone.areas
                    .map((area) => {
                      try {
                        const parsedArea = JSON.parse(area); // Parse area
                        if (parsedArea.province === selectedProvince) {
                          return parsedArea.area.en; // Extract area.area.en if province matches
                        }
                        return null; // Skip areas not matching the selectedProvince
                      } catch {
                        console.error(`Failed to parse area: ${area}`);
                        return null; // Handle invalid JSON
                      }
                    })
                    .filter((areaEn) => areaEn !== null) // Remove null values
              )
          )
        )
      );
    });
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedArea) return;
    setActiveStep(3);
  }, [selectedArea]);

  const onSubmit = (data: AddressFormInputs) => {
    const newAddress = {
      address: {
        location: {
          lat: 0,
          lng: 0,
        },
        ...data,
        country: selectedCountry,
        province: selectedProvince,
        area: selectedArea,
      },
      customerId: customer.id,
      vendorId: vendor?.id,
    };
    setIsLoading(true);
    createCustomerAddress(newAddress)
      .then((addedAddress) => {
        setSelectedAddress(addedAddress.data);
        toast.success("New Address Has Been Added! 👌");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex justify-between  flex-col ">
      <div className="w-full py-4 ">
        <Stepper activeStep={activeStep}>
          {[1, 2, 3, 4].map((step, index) => {
            return (
              <Step
                key={index}
                onClick={() =>
                  !selectedCountry
                    ? {}
                    : !selectedProvince && step > 2
                    ? {}
                    : !selectedArea && step > 3
                    ? {}
                    : setActiveStep(index)
                }
                className="w-5 h-5 text-xs font-medium"
              >
                {step}
              </Step>
            );
          })}
        </Stepper>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" max-w-[350px]  min-w-[350px] shadow-lg min-h-[300px]  rounded-lg p-4 border   text-xs border-gray-200 mt-5 mb-10 text-secondary"
      >
        <section className={`${activeStep >= 3 ? "hidden" : ""}`}>
          <div className="flex items-center  gap-2 mb-4">
            <hr className="w-full border-gray-200" />
            <p className="text-nowrap text-gray-400">Step 1</p>
            <hr className="w-full border-gray-200" />
          </div>

          {/* Country */}
          <Select label="Country" onChange={(country) => setSelectedCountry(country as string)}>
            {countries.map((co) => {
              return (
                <Option key={co} value={co}>
                  {co}
                </Option>
              );
            })}
          </Select>
          {/* end Country */}

          <div className="flex items-center  gap-2 my-4">
            <hr className="w-full border-gray-200" />
            <p className="text-nowrap text-gray-400">Step 2</p>
            <hr className="w-full border-gray-200" />
          </div>

          {/* Province */}
          <Select
            label="Province"
            disabled={activeStep < 1}
            onChange={(province) => {
              setSelectedProvince(province as string);
            }}
          >
            {provinces.map((pro, index) => {
              return (
                <Option key={pro} value={pro}>
                  {pro}
                </Option>
              );
            })}
          </Select>
          {/* end Province */}

          <div className="flex items-center  gap-2 my-4">
            <hr className="w-full border-gray-200" />
            <p className="text-nowrap text-gray-400">Step 3</p>
            <hr className="w-full border-gray-200" />
          </div>

          {/* Area */}
          <Select
            label="Area"
            disabled={activeStep < 2}
            onChange={(area) => setSelectedArea(area as string)}
          >
            {areas.map((ar) => {
              return (
                <Option key={ar} value={ar}>
                  {ar}
                </Option>
              );
            })}
          </Select>
          {/* end Area */}
        </section>

        <section
          className={`${
            activeStep >= 3 ? "flex flex-col justify-between min-h-[270px] " : "hidden"
          }`}
        >
          <aside>
            <div className="flex items-center  gap-2 mb-4">
              <hr className="w-full border-gray-200" />
              <p className="text-nowrap text-gray-400">Step 4</p>
              <hr className="w-full border-gray-200" />
            </div>

            <aside className="flex gap-2 flex-col min-0">
              <div className="flex gap-2 ">
                <Input label="Street" {...register("street", { required: false })} />

                <Input label="Building" {...register("building", { required: false })} />

                <Input label="Floor" {...register("floor", { required: false })} />
              </div>

              <Textarea label="Special Instruction" {...register("specialInstruction")} />
            </aside>
          </aside>

          <aside className="flex-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="normal-case flex justify-center  min-w-40 rounded-full items-center shadow-none border border-primary bg-transparent hover:text-white text-primary  gap-3 hover:bg-primary hover:shadow-none"
            >
              {isLoading ? (
                <>
                  Adding Address ...
                  <Spinner className="w-4 stroke-primary text-primary animate-spin " />
                </>
              ) : (
                "Add"
              )}
            </Button>
          </aside>
        </section>
      </form>
    </div>
  );
};

export default AddressForm;
