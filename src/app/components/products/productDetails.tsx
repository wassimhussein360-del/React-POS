import { Item, Modifier, ModifierOption } from "@/app/abstraction/types";
import { useAppDispatch, useCartItems } from "@/reduxStore/hooks";
import { AddItem, UpdateItem, UpdateQuantity } from "@/reduxStore/slices/cartSlice";
import { Button, Dialog, Input } from "@material-tailwind/react";
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
  const [alreadyAdded, setAlreadyAdded] = useState<boolean>(false);

  const [validators, setValidators] = useState<{ [key: number]: { invalid: boolean } }>({});

  const [itemsTotals, setItemsTotals] = useState<{ quantity: number; stock: number }>({
    quantity: 0,
    stock: 0,
  });

  useEffect(() => {
    setTemporaryItem(JSON.parse(JSON.stringify(product)));

    if (open && items.length) {
      setItemDetails();

      const [inCartItem] = items.filter((itm) => itm.id === product?.id);

      setAlreadyAdded(!!inCartItem);
    }
  }, [open, product, items]);

  const setItemDetails = () => {
    const matchings = items.filter((item) => item.id === product.id);

    if (matchings.length) {
      const totals = {
        quantity: matchings.reduce((sum, prd) => sum + prd.quantity, 0),
        stock: matchings[0].stock,
      };
      if (matchings.length) setItemsTotals(totals);
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

  const saveToCart = () => {
    if (temporaryItem?.modifiers.length) {
      if (validateItem()) {
        dispatch(UpdateItem(temporaryItem));
        handleOpen();
        toast.success("Item has been updated successfully.");
      } else {
        toast.error("Choose Required Modifiers.");
      }
    } else {
      dispatch(
        UpdateQuantity({ id: product.id, quantity: temporaryItem?.quantity || 1, key: product.key })
      );
      toast.success("Item has been updated successfully.");
      handleOpen();
    }
  };

  const validateItem = (): boolean => {
    let isValid = true;

    const newValidators = temporaryItem?.modifiers.reduce((acc, md: Modifier, index: number) => {
      if (!md.required) return acc;

      const selectionCount = md.options.filter((op) => op.isSelected).length;
      const { min = 0, max = 0 } = md;

      const hasError = md.multiple ? selectionCount < min : selectionCount === 0;

      if (hasError) isValid = false;

      return { ...acc, [index]: { invalid: hasError } };
    }, {});

    setValidators(newValidators);
    return isValid;
  };

  const updateQuantity = (quantity: number) => {
    setTemporaryItem((prev: any) => ({ ...prev, quantity }));
  };

  const handleOptionSelection = (modifierIndex: number, optionIndex: number) => {
    const newValue = !temporaryItem?.modifiers[modifierIndex]?.options[optionIndex].isSelected;

    if (temporaryItem?.modifiers[modifierIndex].multiple) {
      const countSelections = temporaryItem.modifiers[modifierIndex]?.options.filter(
        (opt: ModifierOption) => opt.isSelected
      ).length;
      const max = temporaryItem.modifiers[modifierIndex].max as number;
      if (max && countSelections >= max && newValue) return;
    }

    setTemporaryItem((prev: any) => {
      let updatedMod = prev.modifiers as Modifier[];

      if (!updatedMod[modifierIndex].multiple) {
        updatedMod[modifierIndex].options = updatedMod[modifierIndex].options.map((opt) => ({
          ...opt,
          isSelected: false,
        }));
      }

      updatedMod[modifierIndex].options[optionIndex].isSelected = newValue;

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
      className="flex justify-center  bg-transparent shadow-transparent"
      placeholder={undefined}
    >
      <article
        className={`flex  justify-center text-center gap-2 bg-white shadow-xl shadow-gray-800 rounded-xl py-8 px-12 ${
          product.modifiers.length ? "" : "flex-col"
        }`}
      >
        <section className="flex flex-col items-center">
          <img
            src={product.image}
            className="min-w-60  max-w-60 aspect-square object-cover rounded-xl"
          />
          <section className="flex justify-between  mt-2 w-56">
            <p className="text-xs text-primary font-semibold">
              {itemsTotals.quantity
                ? itemsTotals.stock - (temporaryItem?.quantity || 0)
                : product.stock - (temporaryItem?.quantity || 0)}{" "}
              Pcs
            </p>
            <p className="text-xs text-gray-800">KD {product.price.toFixed(2)}</p>
          </section>
          <hr className="w-56 my-2 border-gray-300" />
          <aside className="  w-full text-justify">
            <p className="text-xs text-gray-800">{product.category}</p>
            <h4 className="text-gray-900 font-semibold  text-xs    max-w-60">{product.name}</h4>
          </aside>
          <hr className="w-56 my-2 border-gray-300" />
          <aside className="  flex gap-5 items-center">
            <button
              onClick={() =>
                (temporaryItem?.quantity || 0) > 1
                  ? updateQuantity((temporaryItem?.quantity || 2) - 1)
                  : {}
              }
              className="bg-secondary text-white rounded-full border-l border-gray-400 w-7 h-7  p-0 "
            >
              -
            </button>
            <button className="bg-white text-gray-900 w-5 h-5 p-0" disabled={true}>
              {temporaryItem?.quantity || product.quantity}
            </button>
            <button
              onClick={() =>
                (itemsTotals.stock || product.stock) +
                  product.quantity -
                  (temporaryItem?.quantity || 0) >=
                1
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
          {!!product?.modifiers.length && (
            <aside>
              {product?.modifiers.length &&
                (product?.modifiers || []).map((modifier: Modifier, modifierIndex) => {
                  return (
                    <article key={modifierIndex} className="">
                      <section className="flex justify-between items-center  mb-2 text-sm font-semibold text-secondary w-fill">
                        <p className="flex items-center gap-1">
                          {modifier.name + " "}
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
                          {modifier.multiple ? `Max  ${modifier.max}` : ""}
                        </p>
                      </section>
                      <section className="w-full">
                        {modifier.type == "normal" ? (
                          (modifier?.options || []).map(
                            (option: ModifierOption, optionIndex: number) => {
                              return (
                                <section
                                  key={optionIndex}
                                  className="flex justify-between "
                                  onClick={() => handleOptionSelection(modifierIndex, optionIndex)}
                                >
                                  <div>
                                    <div className="inline-flex items-center">
                                      {/* Check Box */}
                                      <input
                                        type={modifier.multiple ? "checkbox" : "radio"}
                                        onChange={() => {}}
                                        checked={
                                          !!temporaryItem?.modifiers[modifierIndex]?.options[
                                            optionIndex
                                          ]?.isSelected
                                        }
                                        className="accent-secondary  cursor-pointer me-2 h-4 w-4"
                                      />
                                      {/* End Check Box */}

                                      <p
                                        className={`text-xs ${
                                          temporaryItem?.modifiers[modifierIndex]?.options[
                                            optionIndex
                                          ]?.isSelected
                                            ? "text-gray-900 font-semibold"
                                            : "text-gray-500"
                                        } `}
                                      >
                                        {option.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div
                                    className={`text-xs flex ${
                                      temporaryItem?.modifiers[modifierIndex]?.options[optionIndex]
                                        ?.isSelected
                                        ? "text-gray-900 font-semibold"
                                        : "text-gray-500"
                                    } `}
                                  >
                                    +KD{" "}
                                    <nav className="w-10 text-end">{option.price.toFixed(2)}</nav>
                                  </div>
                                </section>
                              );
                            }
                          )
                        ) : (
                          <section className="flex gap-4">
                            {modifier.options.map((option: ModifierOption, colorOptionIndex) => {
                              return (
                                <span
                                  key={colorOptionIndex}
                                  className={` border-2 ${
                                    temporaryItem?.modifiers[modifierIndex]?.options[
                                      colorOptionIndex
                                    ].isSelected
                                      ? "border-secondary shadow-xl  animate-bounce"
                                      : "border-gray-400"
                                  }   rounded min-w-6 min-h-6 cursor-pointer`}
                                  style={{ backgroundColor: option.value }}
                                  onClick={() =>
                                    handleOptionSelection(modifierIndex, colorOptionIndex)
                                  }
                                ></span>
                              );
                            })}
                          </section>
                        )}
                      </section>
                      <hr className="w-56 my-4 border-gray-300" />
                    </article>
                  );
                })}
            </aside>
          )}

          <aside className="flex justify-center gap-2">
            {(!product.modifiers.length || product.key) && (
              <Button
                size="sm"
                className={`normal-case flex  bg-secondary ${
                  !temporaryItem?.modifiers.length ? "min-w-40" : "w-1/2"
                } justify-center`}
                placeholder={undefined}
                onClick={() => saveToCart()}
              >
                Save
              </Button>
            )}
            {!!product.modifiers.length && !product.key && (
              <Button
                size="sm"
                className={`normal-case flex  bg-secondary ${
                  !temporaryItem?.modifiers.length ? "min-w-40" : "w-1/2"
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
