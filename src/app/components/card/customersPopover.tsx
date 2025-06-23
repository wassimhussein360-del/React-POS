import { useState, useRef, useEffect } from "react";
import { Button, Spinner } from "@material-tailwind/react";
import toast from "react-hot-toast";

export default function CustomerPopover({
  $general,
  selectedCustomer,
  setSelectedCustomer,
  selectedCustomerName,
  setSelectedCustomerName,
  customerLoading,
  customers,
  setCustomerSearch,
  $getColorFromString,
  $getImgAlter,
  $translate,
}: any) {
  const [open, setOpen] = useState(false);

  // Close when clicking outside
  // at top:
  // at top:
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    toast.success("Click on the customer to select them");
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={popoverRef}>
      <Button
        disabled={$general.cartCreated}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full text-start normal-case bg-transparent hover:shadow-none flex justify-between items-center border border-gray-500 shadow-none rounded-xl ${
          selectedCustomerName ? "text-primary" : "text-gray-400"
        }`}
      >
        {selectedCustomerName || "Walk in Customer"}
        {customerLoading && <Spinner className="w-4 h-4" />}
      </Button>

      {open && (
        <div className="absolute z-[9999] mt-2 w-full bg-white border border-gray-200 rounded-xl p-2 max-h-[20rem] overflow-y-auto shadow-lg">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-2 py-1 mb-2 text-sm border border-gray-300 rounded-lg hover:outline-none focus:border-gray-500"
            autoFocus
            onChange={(e) => {
              const value = e.target.value;
              setCustomerSearch(value);
            }}
          />

          {customers.map((cus: any, i: number) => (
            <div
              key={i}
              className={`p-2 rounded cursor-pointer ${
                cus.id === selectedCustomer ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setSelectedCustomer(cus.id);
                setSelectedCustomerName(cus.name);
                setOpen(false); // ✅ close manually
              }}
            >
              <div className="flex items-center gap-2">
                {cus.image ? (
                  <img src={cus.image} alt={cus.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <div
                    className="w-8 h-8 flex items-center justify-center font-sourGummy font-semibold text-secondary rounded-full"
                    style={{ backgroundColor: $getColorFromString(cus.id) }}
                  >
                    {$getImgAlter(cus.name)}
                  </div>
                )}
                <div>
                  <p className="text-sm text-secondary">
                    {$translate({
                      en: cus.name || cus.displayName || cus.an?.displayName,
                      ar: cus.ar?.displayName,
                    })}
                  </p>
                  <p className="text-xs text-gray-400">{cus.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
