import { useVendor } from "@/reduxStore/hooks";
import React, { useEffect, useState } from "react";
import moment from "moment";
import FirestoreService from "@/servies/firestoreService";
import { Dialog } from "@material-tailwind/react";
import { PrintOrderComponent } from "./printer";
import { $loader } from "@/app/helpers/helpers";

interface Order {
  id: string;
  orderRef: string;
  createdAt: string;
  paymentMethod: { name: string };
  customer: { name: string; phone?: string; email?: string };
  address: { street: string; area: string; city: string; country: string };
  cart: {
    cartItems: {
      name: { en: string; ar: string };
      description: { en?: string; ar?: string };
      price: number;
      quantity: number;
    }[];
    [key: string]: any;
  };
}

interface TotalsEntry {
  label: string;
  value?: number;
  field: string;
}

interface Props {
  orderId: string;
}

const PrintPopover: React.FC<Props> = ({ orderId }) => {
  const vendor = useVendor() as any;

  const [showPrintPopUp, setShowPrintPopUp] = useState(false);
  const [isThermal, setIsThermal] = useState(false);
  const [order, setOrder] = useState<Order>();
  const [totals, setTotals] = useState<TotalsEntry[]>([]);
  const [isEn, setIsEn] = useState(true);

  useEffect(() => {}, []);

  const printOrder = () => {
    _fetchOrder();
  };

  function _setTotals() {
    const constructTotals: TotalsEntry[] = [
      ...(order && (order.cart?.productsDiscount || order.cart?.cartDiscountAmount)
        ? [
            {
              label: !isEn ? "تخفيض" : "Discount",
              field: "discount",
              value: order.cart.productsDiscount + (order.cart.customDiscount || 0) + order.cart.cartDiscountAmount,
            },
          ]
        : []),
      {
        label: !isEn ? "المجموع الفرعي" : "Sub Total",
        field: "subTotal",
      },

      {
        label: !isEn ? "رسوم التوصيل" : "Delivery Charge",
        field: "deliveryFee",
      },
      { label: !isEn ? "المجموع الكلي" : "Total", field: "total" },
    ];

    setTotals(constructTotals);
  }
  function _fetchOrder() {
    $loader(true);
    FirestoreService.getSubDocument("vendors", vendor.id, "orders", orderId)
      .then((orderResponse) => {
        console.log(orderResponse);

        setOrder(orderResponse as Order);
        _setTotals();
      })
      .finally(() => {
        console.log(1);

        setTimeout(() => {
          console.log(2);

          if (order?.id) {
            console.log(3);
            setShowPrintPopUp(false);
            new PrintOrderComponent(order, isEn, isThermal);
          }
          $loader(false);
        }, 2_000);
      });
  }

  function _receipt_Body() {
    if (!order) return <></>;
    return (
      <div className="hidden flex-column p-3" id={`receipt_${order.id}`}>
        <div className="text-white d-flex justify-content-between">
          {/* Logo */}
          {!isThermal && (
            <section
              className="d-flex align-items-end position-relative overflow-hidden"
              style={{
                height: "5rem",
                background: "#012e3f",
                width: "30%",
                minWidth: "366px",
              }}
            >
              <aside
                className={`bg-white h-75 ${isEn ? "me-2" : "ms-2"}`}
                style={{
                  opacity: 0.1,
                  aspectRatio: "1/1",
                  borderTopRightRadius: isEn ? "100%" : "0",
                  borderTopLeftRadius: !isEn ? "100%" : "0",
                }}
              ></aside>
              <div className="h-100 d-flex align-items-center">
                <aside className="d-flex align-items-center gap-3">
                  <img src={loadInventoryImage(vendor.logo, vendor.id)} alt="Company Logo" className="img-fluid rounded" style={{ maxWidth: "50px" }} />
                  <h6 className="text-white fs-4 fw-bold">{vendor.name ?? vendor.name[isEn ? "en" : "ar"]}</h6>
                </aside>
              </div>
            </section>
          )}

          {/* Invoice Info */}
          <section>
            <h3 className={!isThermal ? "fs-4 mb-1" : ""} style={{ color: "#61e4a3" }}>
              {isEn ? "INVOICE" : "فاتورة"}
            </h3>
            <table className={`invoice-table ${isThermal ? "thermal-mode" : ""}`}>
              <tbody>
                <tr>
                  <td>{isEn ? "Invoice Nb:" : "رقم الفاتورة:"}</td>
                  <td>#{order.orderRef}</td>
                </tr>
                <tr>
                  <td>{isEn ? "Date Of Issue:" : "تاريخ الإصدار:"}</td>
                  <td>{customDateFormat(order.createdAt, "MMM, DD, YYYY - HH:MM A")}</td>
                </tr>
                <tr>
                  <td>{isEn ? "Date Due:" : "تاريخ الاستحقاق:"}</td>
                  <td>{customDateFormat(order.createdAt, "MMM, DD, YYYY")}</td>
                </tr>
                <tr>
                  <td>{isEn ? "Currency:" : "العملة:"}</td>
                  <td>{isEn ? "KWD" : "ك.د"}</td>
                </tr>
                <tr>
                  <td>{isEn ? "Payment Method:" : "طريقة الدفع:"}</td>
                  <td>{order.paymentMethod.name}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        {/* Cart */}
        <table className="table table border-collapse">
          <thead className="table-light">
            <tr>
              <th style={{ background: "#61e4a3" }}>{isEn ? "No." : "رقم"}</th>
              <th style={{ background: "#61e4a3", textAlign: "start" }}>{isEn ? "Product Description" : "وصف المنتج"}</th>
              <th style={{ background: "#012e3f" }}>{isEn ? "Price" : "السعر"}</th>
              <th style={{ background: "#012e3f" }} className="text-center">
                {isEn ? (isThermal ? "Qun" : "Quantity") : "الكمية"}
              </th>
              <th style={{ background: "#012e3f" }}>{isEn ? "Total" : "المجموع"}</th>
            </tr>
          </thead>
          <tbody>
            {order.cart.cartItems.map((item, i) => (
              <tr key={i}>
                <td className="text-center">{i > 9 ? i + 1 : `0${i + 1}`}</td>
                <td className="d-flex flex-column p-0 pb-2" style={{ textAlign: "start" }}>
                  {item.name[isEn ? "en" : "ar"]}
                  {!isThermal && item.description[isEn ? "en" : "ar"] && (
                    <small className="text-muted">
                      {item.description?.[isEn ? "en" : "ar"]?.slice(0, 120)}
                      {item.description?.[isEn ? "en" : "ar"]?.length ?? 0 > 120 ? " ..." : ""}
                    </small>
                  )}
                </td>
                <td>{item.price.toFixed(2)}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-center">{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <section className="float-end" style={{ width: isThermal ? "100%" : "400px" }}>
          {totals.map((entry, i) => (
            <aside
              key={i}
              className="p-2 fw-bold fs-6"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "5px",
                background: i === 3 ? "#012e3f" : undefined,
                color: i === 3 ? "white" : undefined,
              }}
            >
              <div>{entry.label}</div>
              <div>
                {entry.value?.toFixed(2) ?? order.cart[entry.field]} {isEn ? "KWD" : "ك.د"}
              </div>
            </aside>
          ))}
        </section>
      </div>
    );
  }

  return (
    <>
      <Dialog open={showPrintPopUp} handler={setShowPrintPopUp} className="flex justify-center  bg-transparent  !min-w-0 !w-[26rem] shadow-transparent  ">
        <article className="bg-white shadow-xl shadow-gray-800 rounded-xl py-8 px-12">
          {/* Popover */}
          <section className={`flex flex-col justify-between rounded gap-14   border-gray-200 bg-white min-w-64  w-auto ${!showPrintPopUp ? "hidden" : ""}`}>
            <aside className="w-full">
              <div className="flex border border-gray-200 rounded-lg w-full mb-3 overflow-hidden">
                <button type="button" className={`flex-1 py-1 px-3 text-sm border-r border-gray-200 ${!isThermal ? "bg-teal-900 text-white" : "bg-white"}`} onClick={() => setIsThermal(false)}>
                  A4
                </button>
                <button type="button" className={`flex-1 py-1 px-3 text-sm ${isThermal ? "bg-teal-900 text-white" : "bg-white"}`} onClick={() => setIsThermal(true)}>
                  Thermal
                </button>
              </div>

              <div className="flex border border-gray-200 rounded-lg w-full overflow-hidden">
                <button type="button" className={`flex-1 py-1 px-3 text-sm border-r border-gray-200 ${isEn ? "bg-teal-900 text-white" : "bg-white"}`} onClick={() => setIsEn(true)}>
                  English
                </button>
                <button type="button" className={`flex-1 py-1 px-3 text-sm ${!isEn ? "bg-teal-900 text-white" : "bg-white"}`} onClick={() => setIsEn(false)}>
                  عربي
                </button>
              </div>
            </aside>

            <button type="button" className="  py-1 px-3 text-sm hover:text-white  border border-gray-500 rounded-lg font-bold hover:bg-primary  w-15" onClick={printOrder}>
              Print
            </button>
          </section>
        </article>
      </Dialog>

      <section>
        <a onClick={() => setShowPrintPopUp(true)}>
          <button type="button" className=" p-2 text-primary hover:text-white hover:bg-primary/90 rounded-lg shadow">
            <i className="bi bi-printer text-lg"></i>
          </button>
        </a>

        {/* Receipt */}
        {order && order.id && _receipt_Body()}
      </section>
    </>
  );
};

export default PrintPopover;

function loadInventoryImage(imageName: any, vendId: string, xParams = "w=150") {
  if (imageName.includes("https")) return imageName;
  if (!imageName || imageName == "" || imageName == "store.png" || imageName == "default.png") {
    return "https://static.menasa.io/static/store.png";
  }
  const url = `https://static.menasa.io/${vendId}/${imageName}?${xParams}&auto=compress`;

  return url;
}

function customDateFormat(date: any, format: string) {
  if (!date) {
    return "-";
  }
  return moment.unix(new Date(date).getTime() / 1000).format(format);
}
