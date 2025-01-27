import React from "react";
import { useForm } from "react-hook-form";

interface AddressFormInputs {
  area: string;
  street: string;
  building: string;
  floor: string;
  country: string;
  province: string;
  specialInstruction: string;
}

const AddressForm: React.FC<any> = ({ discard }: { discard: Function }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormInputs>();

  const onSubmit = (data: AddressFormInputs) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="area">Area</label>
        <input
          id="area"
          {...register("area", { required: "Area is required" })}
          className="border p-1 rounded w-full focus:outline-none focus:border-secondary"
        />
      </div>

      <hr className={`my-1 border-none`} />
      <section className="flex justify-between gap-1">
        <div className="text-start w-1/3">
          <label htmlFor="street">Street</label>
          <input
            id="street"
            {...register("street", { required: "Street is required" })}
            className="border p-1 rounded w-full focus:outline-none focus:border-secondary"
          />
        </div>

        <div className="text-center w-1/3">
          <label htmlFor="building">Building</label>
          <input
            id="building"
            {...register("building")}
            className="border p-1 rounded w-full focus:outline-none focus:border-secondary"
          />
        </div>

        <div className="text-end w-1/3">
          <label htmlFor="floor">Floor</label>
          <input
            id="floor"
            {...register("floor")}
            className="border p-1 rounded w-full focus:outline-none focus:border-secondary"
          />
        </div>
      </section>

      <hr className={`my-1 border-none`} />
      <section className="flex justify-between gap-1">
        <div>
          <label htmlFor="country">Country</label>
          <input
            id="country"
            {...register("country", { required: "Country is required" })}
            className="border p-1 rounded w-full focus:outline-none focus:border-secondary"
          />
          {errors.country && <p className="text-red-500">{errors.country.message}</p>}
        </div>

        <div className="text-end">
          <label htmlFor="province">Province</label>
          <input
            id="province"
            {...register("province")}
            className="border p-1 rounded w-full focus:outline-none focus:border-secondary"
          />
        </div>
      </section>

      <hr className={`my-1 border-none`} />

      <div>
        <label htmlFor="specialInstruction">Special Instructions</label>
        <textarea
          id="specialInstruction"
          {...register("specialInstruction")}
          className="border p-1 rounded w-full focus:outline-none focus:border-secondary"
        />
      </div>

      <div className="flex  gap-4">
        <button
          type="submit"
          onClick={() => discard()}
          className="mt-4   hover:scale-105 transition-transform border border-danger  text-danger px-4 py-2 rounded w-1/2"
        >
          Discard
        </button>
        <button
          type="submit"
          className="mt-4 bg-primary hover:scale-105 transition-transform text-secondary font-semibold px-4 py-2 rounded w-1/2"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
