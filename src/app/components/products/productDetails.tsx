import { Indexable, Item, Modifier, ModifierOption } from "@/app/abstraction/types";
import { $currency, $translate } from "@/app/helpers/helpers";
import { useAppDispatch, useCartItems } from "@/reduxStore/hooks";
import { AddItem, UpdateItem, UpdateQuantity } from "@/reduxStore/slices/cartSlice";
import { Button, Dialog, Input, Textarea } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ProductDialogProps {
  open: boolean;
  handleOpen: () => void;

  product: Item;
}

const ProductDetails: React.FC<ProductDialogProps> = ({ open, handleOpen, product }) => {
  const dispatch = useAppDispatch();
  const items = useCartItems();
  const [temporaryItem, setTemporaryItem] = useState<Item>();

  const [validators, setValidators] = useState<{ [key: number]: { invalid: boolean } }>({});

  const [itemsTotals, setItemsTotals] = useState<{ quantity: number; stock: number }>({
    quantity: 0,
    stock: 0,
  });

  useEffect(() => {
    const parsedItem = JSON.parse(JSON.stringify(product));
    setTemporaryItem({ ...parsedItem, quantity: parsedItem.quantity || 1 });

    if (open && items.length) {
      setItemDetails();
    }
  }, [open, product, items]);

  const setItemDetails = () => {
    const matchings = items.filter((item) => item.id === product.id);

    if (matchings.length) {
      const totals = {
        quantity: matchings.reduce((sum, prd) => sum + prd.quantity, 0),
        stock: matchings[0].stockQuantity,
      };

      setItemsTotals(totals);
    } else {
      setItemsTotals({
        quantity: 0,
        stock: 0,
      });
    }
  };

  const addToCart = () => {
    if (validateItem()) {
      dispatch(AddItem({ ...temporaryItem, key: new Date().getTime() }));
      handleOpen();
      toast.success("Successfully Added New Item");
    } else {
      toast.error("Choose Required Modifiers.");
    }
  };

  const handleOptionQuantityChange = (
    modifierIndex: number,
    optionIndex: number,
    value: number
  ) => {
    setTemporaryItem((prev) => {
      const newItem = JSON.parse(JSON.stringify(prev)); // Ensure deep clone works
      const quantity = Math.min(10, Math.max(0, value));
      newItem.assignedModifiers[modifierIndex].list[optionIndex].selected = !!quantity;
      newItem.assignedModifiers[modifierIndex].list[optionIndex].quantity = quantity;
      return newItem;
    });
  };

  const saveToCart = () => {
    if (!temporaryItem) return;

    if (temporaryItem?.assignedModifiers.length) {
      if (validateItem()) {
        dispatch(UpdateItem(temporaryItem));
        handleOpen();
        toast.success("Item has been updated successfully.");
      } else {
        toast.error("Choose Required Modifiers.");
      }
    } else {
      dispatch(UpdateItem(temporaryItem));

      toast.success("Item has been updated successfully.");
      handleOpen();
    }
  };

  const validateItem = (): boolean => {
    let isValid = true;

    const newValidators = temporaryItem?.assignedModifiers.reduce(
      (acc, md: Modifier, index: number) => {
        if (!md.required) return acc;

        const selectionCount = md.list.filter((op) => op.selected).length;
        const { minSelection = 0, maxSelection = 0 } = md;

        const hasError = md.multiple ? selectionCount < minSelection : selectionCount === 0;

        if (hasError) isValid = false;

        return { ...acc, [index]: { invalid: hasError } };
      },
      {}
    );

    setValidators(newValidators);
    return isValid;
  };

  const updateQuantity = (quantity: number) => {
    setTemporaryItem((prev: any) => ({ ...prev, quantity }));
  };

  const handleOptionSelection = (modifierIndex: number, optionIndex: number) => {
    const newValue = !temporaryItem?.assignedModifiers[modifierIndex]?.list[optionIndex].selected;

    if (temporaryItem?.assignedModifiers[modifierIndex].multiple) {
      const countSelections = temporaryItem.assignedModifiers[modifierIndex]?.list.filter(
        (opt: ModifierOption) => opt.selected
      ).length;
      const max = temporaryItem.assignedModifiers[modifierIndex].maxSelection as number;
      if (max && countSelections >= max && newValue) return;
    }

    setTemporaryItem((prev: any) => {
      let updatedMod = prev.assignedModifiers as Modifier[];

      if (!updatedMod[modifierIndex].multiple) {
        updatedMod[modifierIndex].list = updatedMod[modifierIndex].list.map((opt) => ({
          ...opt,
          selected: false,
        }));
      }

      updatedMod[modifierIndex].list[optionIndex].selected = newValue;

      return {
        ...prev,
        modifiers: updatedMod,
      };
    });
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="flex justify-center  bg-transparent w-[90vw]  shadow-transparent"
      placeholder={undefined}
    >
      <article
        className={`flex  justify-center text-center gap-2 md:max-w-[650px] md:min-w-[650px] bg-white shadow-xl 
           shadow-gray-800 w-full rounded-xl py-8 px-12 flex-col md:flex-row max-h-[83vh]  overflow-y-auto `}
      >
        <section className="flex flex-col items-center mt-[145px] md:m-0">
          <img
            src={product.images[0].url}
            className="min-w-60  max-w-60 aspect-square object-cover rounded-xl"
          />
          <section className="flex justify-between  mt-2 w-56">
            {product.isStockManagement ? (
              <p className="text-xs text-primary font-semibold">
                {itemsTotals.quantity
                  ? itemsTotals.stock + (product.quantity || 0) - (temporaryItem?.quantity || 0)
                  : product.stockQuantity - (temporaryItem?.quantity || 0)}{" "}
                Pcs
              </p>
            ) : (
              <p></p>
            )}

            <p className="text-xs text-gray-800">
              {$currency()} {product.price.toFixed(2)}
            </p>
          </section>
          <hr className="w-56 my-2 border-gray-300" />
          <aside className="  w-full text-justify">
            <p className="text-xs text-gray-800">
              {product.categories.map((cat: Indexable) => $translate(cat.name)).join(", ")}
            </p>
            <h4 className="text-gray-900 font-semibold  text-xs    max-w-60">
              {$translate(product.name)}
            </h4>
          </aside>
          <hr className="w-56 my-2 border-gray-300" />
          <aside className="  flex gap-5 items-center">
            <button
              onClick={() =>
                (temporaryItem?.quantity || 0) > 1
                  ? updateQuantity(temporaryItem?.quantity - 1)
                  : {}
              }
              className="bg-secondary text-white rounded-full border-l border-gray-400 w-7 h-7  p-0 "
            >
              -
            </button>
            <button className="bg-white text-gray-900 w-5 h-5 p-0" disabled={true}>
              {temporaryItem?.quantity}
            </button>
            <button
              onClick={() =>
                (itemsTotals.stock || product.stockQuantity) +
                  (product.quantity || 0) -
                  temporaryItem?.quantity >=
                  1 || !product.isStockManagement
                  ? updateQuantity((temporaryItem?.quantity || 0) + 1)
                  : null
              }
              className="bg-secondary text-white rounded-full border-l border-gray-400 w-7 h-7  p-0"
            >
              +
            </button>
          </aside>
        </section>

        <div className="border border-gray-400 mx-7"></div>

        <div className=" min-w-60 flex flex-col justify-between">
          <div>
            {!!product?.assignedModifiers.length && (
              <aside>
                {product?.assignedModifiers.length &&
                  (product?.assignedModifiers || []).map(
                    (modifier: Modifier, modifierIndex: number) => {
                      return (
                        <article key={modifierIndex} className="">
                          <section className="flex justify-between items-center flex-wrap  mb-2 text-sm font-semibold text-secondary w-fill">
                            <p className="flex items-center gap-1">
                              {$translate(modifier.name) + " "}
                              <span
                                className={`text-[0.6rem] p-0 ${
                                  validators[modifierIndex]?.invalid
                                    ? "text-danger  "
                                    : "text-gray-400 "
                                }`}
                              >
                                &#9679; {modifier.required ? "Required" : "Optional"}
                              </span>
                            </p>
                            <p className=" text-xs">
                              {modifier.multiple && modifier.maxSelection
                                ? `Max  ${modifier.maxSelection}`
                                : ""}
                            </p>
                          </section>
                          <section className="w-full">
                            {(modifier?.list || []).map(
                              (option: ModifierOption, optionIndex: number) => {
                                return (
                                  <section
                                    key={optionIndex}
                                    className={`flex justify-between ${
                                      temporaryItem?.assignedModifiers[modifierIndex]?.list[
                                        optionIndex
                                      ]?.selected
                                        ? "text-gray-900 font-semibold"
                                        : "text-gray-500"
                                    }`}
                                    onClick={() =>
                                      option.withQuantity
                                        ? {}
                                        : handleOptionSelection(modifierIndex, optionIndex)
                                    }
                                  >
                                    <div
                                      onClick={() =>
                                        !option.withQuantity
                                          ? {}
                                          : handleOptionSelection(modifierIndex, optionIndex)
                                      }
                                    >
                                      <div className="inline-flex items-center">
                                        {/* Check Box */}
                                        {modifier.type == "normal" ? (
                                          <input
                                            type={modifier.multiple ? "checkbox" : "radio"}
                                            onChange={() => {}}
                                            checked={
                                              !!temporaryItem?.assignedModifiers[modifierIndex]
                                                ?.list[optionIndex]?.selected
                                            }
                                            className="accent-secondary  cursor-pointer me-2 h-4 w-4"
                                          />
                                        ) : (
                                          <span
                                            className={` border-2  me-2 ${
                                              temporaryItem?.assignedModifiers[modifierIndex]?.list[
                                                optionIndex
                                              ].selected
                                                ? "border-secondary shadow-xl  animate-bounce"
                                                : "border-gray-400"
                                            }   rounded min-w-5 min-h-5 cursor-pointer`}
                                            style={{ backgroundColor: option.color }}
                                            onClick={() =>
                                              handleOptionSelection(modifierIndex, optionIndex)
                                            }
                                          ></span>
                                        )}
                                        {/* End Check Box */}

                                        <p className={`text-xs  `}>
                                          {$translate({
                                            en: option?.nameEn || option.name?.en,
                                            ar: option?.nameAr || option.name?.ar,
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                    <aside className="flex gap-2">
                                      {option.withQuantity && (
                                        <input
                                          type="number"
                                          className="w-[40px] h-[20px] text-sm  ps-2 rounded border"
                                          value={
                                            temporaryItem?.assignedModifiers[modifierIndex]?.list[
                                              optionIndex
                                            ].quantity || 1
                                          }
                                          onChange={(e) =>
                                            handleOptionQuantityChange(
                                              modifierIndex,
                                              optionIndex,
                                              Number(e.target.value)
                                            )
                                          }
                                        ></input>
                                      )}
                                      <div className={`text-xs flex  `}>
                                        {option.price ? (
                                          <>
                                            +
                                            <nav className="w-7 text-end">
                                              {(
                                                option.price *
                                                (temporaryItem?.assignedModifiers[modifierIndex]
                                                  ?.list[optionIndex].quantity || 1)
                                              ).toFixed(2)}
                                            </nav>
                                          </>
                                        ) : (
                                          "Free"
                                        )}
                                      </div>
                                    </aside>
                                  </section>
                                );
                              }
                            )}
                          </section>
                          <hr className="w-56 my-4 border-gray-300" />
                        </article>
                      );
                    }
                  )}
              </aside>
            )}
            <Textarea
              label="Special Instructions"
              value={temporaryItem?.productSpecialInstruction}
              onChange={(e) =>
                setTemporaryItem((prev) => ({ ...prev, productSpecialInstruction: e.target.value }))
              }
              className=" max-h-[70px]  bg-[#F6F6F6] min-h-0 "
            />
          </div>

          <aside className="flex justify-center gap-2">
            {(!product.assignedModifiers.length || product.key) && (
              <Button
                size="sm"
                className={`normal-case flex  bg-secondary ${
                  !temporaryItem?.assignedModifiers.length ? "min-w-40" : "w-1/2"
                } justify-center`}
                placeholder={undefined}
                onClick={() => saveToCart()}
              >
                Save
              </Button>
            )}
            {!!product.assignedModifiers.length && !product.key && (
              <Button
                size="sm"
                className={`normal-case flex  bg-secondary ${
                  !temporaryItem?.assignedModifiers.length ? "min-w-40" : "w-1/2"
                } justify-center`}
                placeholder={undefined}
                onClick={() => addToCart()}
              >
                Add
              </Button>
            )}
          </aside>
        </div>
      </article>
    </Dialog>
  );
};

export default ProductDetails;
