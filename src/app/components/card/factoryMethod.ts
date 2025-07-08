import { Indexable, Item } from "@/app/abstraction/types";
import { $getFromLocal } from "@/app/helpers/helpers";
import { CartState } from "@/reduxStore/slices/cartSlice";
import { GeneralState } from "@/reduxStore/slices/generalSlice";
import toast from "react-hot-toast";

export const refactorOrder = ($cart: CartState, $general: GeneralState) => {
  // Cart Slice

  const selections: Indexable = { ...($cart.selections || {}) };
  const customer = $cart.customer;
  const cartItems = formatCartItems($cart.items);

  // General Slice
  const allProducts = $general.products;
  const outlet = $general.branch;
  const availableDiscounts = $general.discounts;

  //   Vendor Slice
  const vendor = $getFromLocal("vendor");

  const orderData: Indexable = {};

  // selections.areas = outlet.areas;
  selections.outlet = outlet;
  selections.address = $cart.address;

  let id = "";
  let formattedOrder: any = {
    ...orderData,
    id,
    cartItems,
    selections,
    specialInstructions: selections.specialInstructions,
    vendorId: vendor.id,
    outlet,
  };
  let productsDiscountedPrice = 0;
  let subTotal = 0;
  let totalQuantity = 0;
  let formattedCartItems: any = [];
  let couponsUsed: Array<any> = [];
  let discounts = availableDiscounts.filter((disc: any) => disc.useType != "code");

  if (selections.couponCode) {
    discounts.push(availableDiscounts.find((disc) => disc.code == selections.couponCode));
  }

  const checkProductDiscountedPrice = (product: any, order: any, discounts: any = []) => {
    // check if order has discounted Price
    let availableDiscounts: any = [];

    if (discounts && discounts.length > 0) {
      for (let discount of discounts) {
        if (discount && discount.id && discount.activeDiscountType == "product-discount") {
          let productsOnDiscount = discount.products || [];

          // Directly check if the product's categories match the discount categories
          if (
            !(productsOnDiscount && productsOnDiscount.length > 0) &&
            discount.categories &&
            discount.categories.length > 0
          ) {
            const productCategories = product.categories || [];

            // Check if any of the product's categories match the discount's categories
            const isCategoryMatch = discount.categories.some((cat: any) =>
              productCategories.includes(cat)
            );

            if (isCategoryMatch) {
              productsOnDiscount.push(product.id);
            }
          }

          // Clone the discount object to make it modifiable
          let updatedDiscount = { ...discount }; // Create a shallow copy
          updatedDiscount.products = productsOnDiscount;

          // Check if the product is eligible for the discount
          if (updatedDiscount.products.includes(product.id)) {
            if (!updatedDiscount.hasEndDate || updatedDiscount.endDate > new Date().getTime()) {
              if (
                updatedDiscount.customerEligibility == "allCustomers" ||
                updatedDiscount.customers.includes(order?.customer?.id)
              ) {
                if (
                  updatedDiscount.usePerUser == "multiplePerUser" ||
                  !updatedDiscount?.usedBy?.includes(order?.customer?.id)
                ) {
                  if (
                    updatedDiscount.usePerUser == "oncePerUser" ||
                    parseInt(updatedDiscount.totalUseNumber) > parseInt(updatedDiscount.applied)
                  ) {
                    availableDiscounts.push(updatedDiscount);
                  }
                }
              }
            }
          }
        }
      }
    }

    let price = parseFloat(product.price);
    let finalPrice = price;
    let discountedPrice = parseFloat(product.discountedPrice) || 0;
    let activeDiscount = null;

    // Check if product has an already set discounted price
    if (discountedPrice) {
      activeDiscount = {
        name: "DiscountedPrice",
        deductedAmount: discountedPrice,
        code: "",
        description: "Product has discounted price",
        id: "",
        value: discountedPrice,
        discType: "fixed",
        source: "product",
      };
      finalPrice = Math.min(discountedPrice, price);
    }

    // Apply available discounts
    availableDiscounts.forEach((disc: any) => {
      if (disc?.products?.includes(product.id)) {
        couponsUsed.push({ ...disc, customer: order?.customer?.id || "" });
        const discountAmount =
          disc.amountType === "percentage"
            ? price * (parseFloat(disc.percentage) / 100)
            : parseFloat(disc.fixed);

        const priceAfterDiscount =
          disc.amountType === "percentage" ? price - discountAmount : discountAmount;

        if (priceAfterDiscount > 0 && priceAfterDiscount < discountedPrice && discountedPrice > 0) {
          discountedPrice = priceAfterDiscount;
        }

        if (finalPrice > priceAfterDiscount) {
          activeDiscount = {
            name: disc.activeDiscountType,
            deductedAmount: priceAfterDiscount,
            code: disc.useType == "code" ? disc.code : disc.title,
            description: "Product Discount",
            id: disc.id,
            value:
              disc.amountType == "percentage"
                ? parseFloat(disc.percentage || "0")
                : parseFloat(disc.fixed || "0"),
            discType: disc.amountType,
            source: disc.useType == "code" ? "Coupon Code" : "Automatic",
          };
        }

        finalPrice = Math.min(finalPrice, priceAfterDiscount);
      }
    });

    if (finalPrice < 0) {
      finalPrice = 0;
    }

    const priceObject = {
      price: parseFloat(finalPrice.toFixed(3)),
      discountedPrice: parseFloat(discountedPrice.toFixed(3)),
      activeDiscount,
    };

    return priceObject;
  };

  const checkDeliveryDiscount = (order: any, deliveryFee = 0, discounts: Array<any> = []) => {
    // check if order has discounted Price
    let availableDiscounts: any = [];
    if (discounts && discounts.length > 0) {
      discounts.map((discount: any) => {
        if (discount && discount.id && discount.activeDiscountType == "shipping-discount") {
          if (!discount.hasEndDate || discount.endDate > new Date().getTime()) {
            if (
              discount.customerEligibility == "allCustomers" ||
              discount.customers.includes(order.userId)
            ) {
              if (
                discount.usePerUser == "multiplePerUser" ||
                !discount?.usedBy?.includes(order?.customer?.id)
              ) {
                if (
                  discount.usePerUser == "oncePerUser" ||
                  (parseInt(discount.totalUseNumber) > parseInt(discount.applied) &&
                    parseFloat(discount.cartAmount || "0") < order.cart.subTotal)
                ) {
                  availableDiscounts.push(discount);
                }
              }
            }
          }
        }
      });
    }
    const deliveryDiscount: any = {
      deliveryFee,
      shippingCouponCode: null,
    };

    if (availableDiscounts.length > 0) {
      const availableDiscount: any = availableDiscounts[availableDiscounts.length - 1];
      couponsUsed.push({
        ...availableDiscount,
        customer: order?.customer?.id || "",
      });
      const deductedFee = deliveryFee;
      deliveryDiscount.shippingCouponCode = {
        name: availableDiscount.activeDiscountType,
        deductedAmount: deductedFee,
        code:
          availableDiscount.useType == "code" ? availableDiscount.code : availableDiscount.title,
        description: "Shipping Discount",
        id: availableDiscount.id,
        value: 100,
        discType: "percentage",
        source: availableDiscount.useType == "code" ? "Coupon Code" : "Automatic",
      };
      deliveryDiscount.deliveryFee = 0;
    }

    return deliveryDiscount;
  };

  const checkOrderDiscount = (order: any, subTotal = 0, discounts: any = []) => {
    // check if order has discounted Price
    let availableDiscounts: any = [];
    if (discounts && discounts.length > 0) {
      discounts.map((discount: any) => {
        if (discount && discount.id && discount.activeDiscountType == "order-discount") {
          if (!discount.hasEndDate || discount.endDate > new Date().getTime()) {
            if (
              discount.customerEligibility == "allCustomers" ||
              discount.customers.includes(order.userId)
            ) {
              if (
                discount.usePerUser == "multiplePerUser" ||
                !discount?.usedBy?.includes(order?.customer?.id)
              ) {
                if (
                  discount.usePerUser == "oncePerUser" ||
                  (parseInt(discount.totalUseNumber) > parseInt(discount.applied) &&
                    parseFloat(discount.cartAmount || "0") < subTotal)
                ) {
                  availableDiscounts.push(discount);
                }
              }
            }
          }
        }
      });
    }

    const discountCheck: any = {
      finalPriceAfterCartDiscount: subTotal,
      cartActiveDiscount: null,
    };
    if (availableDiscounts.length > 0) {
      const availableDiscount = availableDiscounts[availableDiscounts.length - 1];
      couponsUsed.push({
        ...availableDiscount,
        customer: order?.customer?.id || "",
      });
      discountCheck.finalPriceAfterCartDiscount =
        availableDiscount.amountType == "percentage"
          ? subTotal * (1 - parseFloat(availableDiscount.percentage) / 100)
          : subTotal - parseFloat(availableDiscount.fixed);
      const cartActiveDiscount = {
        name: availableDiscount.activeDiscountType,
        deductedAmount: 0,
        code:
          availableDiscount.useType == "code" ? availableDiscount.code : availableDiscount.title,
        description: "Product Discount",
        id: availableDiscount.id,
        value:
          availableDiscount.amountType == "percentage"
            ? parseFloat(availableDiscount.percentage || "0")
            : parseFloat(availableDiscount.fixed || "0"),
        discType: availableDiscount.amountType,
        source: availableDiscount.useType == "code" ? "Coupon Code" : "Automatic",
      };
      discountCheck.cartActiveDiscount = cartActiveDiscount;
    }
    return discountCheck;
  };

  // Generate a numeric hash from a string ID
  const hashId = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash); // Ensure positive hash
  };

  // Method to create a unique order reference
  const createOrderRef = (id: string): string => {
    // Generate a numeric hash from the ID
    const idNumber = hashId(id);

    // Add some randomness to the hash
    const randomValue = Math.floor(Math.random() * 10000); // Random value between 0 and 9999
    const combinedNumber = idNumber + randomValue;

    // Encode the combined number into a Base62 string
    let shortRef = base62Encode(combinedNumber);

    // Ensure the reference is between 4 and 6 characters long
    while (shortRef.length < 4) {
      shortRef = "0" + shortRef; // Pad with leading zeros to ensure at least 4 characters
    }

    if (shortRef.length > 6) {
      shortRef = shortRef.slice(0, 6); // Truncate to 6 characters if necessary
    }

    // Convert to uppercase to match your example
    const ref = shortRef.toUpperCase();

    return ref;
  };

  // Base62 encoding method
  const base62Encode = (num: number): string => {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let encoded = "";
    while (num > 0) {
      encoded = characters[num % 62] + encoded;
      num = Math.floor(num / 62);
    }
    return encoded || "0";
  };

  const getCartChanges = (dbProducts: any, oldItems: any) => {
    let changesDetected = false;
    let changes: any = [];
    oldItems &&
      oldItems?.forEach((bItem: any) => {
        const fItem = dbProducts[bItem.id];
        if (!fItem && dbProducts.length > 0) {
          changes.push(` Item ${bItem.name?.en || bItem.name?.ar} is not available.`);
          changesDetected = true;
        }
        if (
          fItem &&
          fItem.stockHandle != "allowBackfill" &&
          fItem.isStockManagement &&
          fItem.stockQuantity < bItem.quantity
        ) {
          if (fItem.stockQuantity == 0) {
            changes.push(` Item ${bItem.name?.en || bItem.name?.ar} is out of stock.`);
          } else {
            changes.push(
              `Item ${bItem.name?.en || bItem.name?.ar} has a stock limited to ${
                fItem.stockQuantity
              }.`
            );
          }

          changesDetected = true;
        }
        if (fItem && fItem.price !== bItem.originalPrice - bItem.assignedModifiersPrice) {
          changes.push(
            `Item ${bItem.name?.en || bItem.name?.ar} price has changed from ${fItem.price} to ${
              bItem.price
            }.`
          );
          changesDetected = true;
        }
      });

    let cartChanges = null;
    if (changesDetected) {
      cartChanges = {
        message: "Cart has been updated due to changes.",
        changes: changes,
      };
      changes.forEach((change: any) => {
        toast(changes, {
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      });
    }
    return cartChanges;
  };

  const dbProducts: any = {};

  allProducts.forEach((product: Item) => {
    dbProducts[product.id] = product;
  });

  if (formattedOrder.cartItems.length > 0) {
    // Create a map of fetched products for easy lookup

    // Now map through the cartItems and combine them with the fetched products
    formattedCartItems = formattedOrder.cartItems.map((pr: Item) => {
      let product: Item = JSON.parse(JSON.stringify({ ...pr }));

      // Find the corresponding product in the fetched products map
      const dbProduct: Item = dbProducts[product.id];

      const stockHandle = dbProduct?.handleStock || "showOutOfStock";

      if (dbProduct && dbProduct.id) {
        let combinedProduct: Item = {
          ...product,
          ...dbProduct,
          assignedModifiers: dbProduct.assignedModifiers,
        };

        // Handle stock management logic
        if (
          combinedProduct.isStockManagement &&
          stockHandle !== "allowBackfill" &&
          combinedProduct.stockQuantity < combinedProduct.quantity
        ) {
          combinedProduct.quantity = combinedProduct.stockQuantity;
        }
        if (combinedProduct.quantity == 0) {
          return null;
        }
        let formattedProduct: any = {
          id: combinedProduct.id,
          quantity: parseFloat(combinedProduct.quantity),
          preparationTime: combinedProduct.preparationTime || 0,
          originalPrice: parseFloat(`${dbProduct.price}`),
          branchesIds: combinedProduct.branchesIds,
          price: checkProductDiscountedPrice(combinedProduct, orderData, discounts)?.price || 0,
          discountedAmount:
            checkProductDiscountedPrice(combinedProduct, orderData, discounts)?.discountedPrice ||
            0,
          images: combinedProduct.images,
          name: {
            en: combinedProduct.name?.en || "",
            ar: combinedProduct.name?.ar || "",
          },
          description: {
            en: combinedProduct.description?.en || "",
            ar: combinedProduct.description?.ar || "",
          },
          tags: combinedProduct.tags || [],
          specialInstructions: combinedProduct.specialInstructions || "",
          category: {
            name: combinedProduct.category?.name || "",
            id: combinedProduct.category?.id || "",
          },
          categories: combinedProduct.categories || [combinedProduct.category] || [],
          isStockManagement: combinedProduct.isStockManagement,
          assignedModifiers: combinedProduct.assignedModifiers,
          selectedModifiers: combinedProduct.selectedModifiers,
          stockQuantity: parseFloat(combinedProduct.stockQuantity || 0) || 0,
          activeDiscount: checkProductDiscountedPrice(combinedProduct, orderData)?.activeDiscount,
          weight: combinedProduct.weight || 0,
          length: combinedProduct.length || 0,
          height: combinedProduct.height || 0,
          width: combinedProduct.width || 0,
          sku: combinedProduct.sku || null,
          productSpecialInstruction: combinedProduct.productSpecialInstruction || "",
          stockHandle: combinedProduct.stockHandle || "showOutOfStock",
        };

        totalQuantity += formattedProduct.quantity || 1;
        formattedProduct.assignedModifiersPrice = 0;

        const selectedModifiers = formattedProduct.selectedModifiers;
        let assignedModifiers = JSON.parse(JSON.stringify([...formattedProduct.assignedModifiers]));
        let productModifiers: any = [];
        // Handle assigned modifiers
        if (assignedModifiers && assignedModifiers.length > 0) {
          assignedModifiers = assignedModifiers.map((modifier: any) => {
            if (selectedModifiers[modifier.id] && modifier.active) {
              modifier.list = modifier.list.map((mod: any) => {
                if (
                  selectedModifiers[modifier.id][mod.name?.en || mod.nameEn || mod.name?.ar] &&
                  mod.active
                ) {
                  const selectedModifierItem = {
                    ...mod,
                    quantity:
                      selectedModifiers[modifier.id][mod.name?.en || mod.nameEn || mod.name?.ar],
                    selected: true,
                  };
                  const md = {
                    name: mod.name?.en || mod.nameEn || mod.name?.ar || "Selection",
                    price: parseFloat(mod.price || "0"),
                    quantity: selectedModifierItem.quantity,
                    modifierListId: modifier.identifier,
                  };
                  productModifiers.push(md);
                  const singleModifierPrice =
                    parseFloat(selectedModifierItem.price || "0") *
                    (parseInt(selectedModifierItem.quantity, 10) || 1);
                  formattedProduct.assignedModifiersPrice += singleModifierPrice;
                  formattedProduct.productModifiers = productModifiers || null;
                  return selectedModifierItem;
                }
                return mod;
              });
            }
            return modifier;
          });
        }

        formattedProduct.assignedModifiers = assignedModifiers;

        // Adjust product price based on modifiers
        formattedProduct.originalPrice += parseFloat(formattedProduct.assignedModifiersPrice);
        formattedProduct.price += parseFloat(formattedProduct.assignedModifiersPrice);
        formattedProduct.discountedAmount = formattedProduct.originalPrice - formattedProduct.price;

        productsDiscountedPrice +=
          formattedProduct.discountedAmount * (formattedProduct.quantity || 1);
        subTotal += formattedProduct.originalPrice * (formattedProduct.quantity || 1);

        return formattedProduct;
      } else {
        return null;
      }
    });

    // Filter out any null products
    formattedCartItems = formattedCartItems.filter((item: any) => item !== null);
  }

  formattedOrder.couponCode = orderData.couponCode || "";
  let cartDiscountAmount = 0;
  let calculatedTotalAfterCartDiscount = 0;
  const calculatedTotalAfterProductsDiscount = subTotal - productsDiscountedPrice;
  if (subTotal > 0) {
    calculatedTotalAfterCartDiscount = checkOrderDiscount(
      formattedOrder,
      calculatedTotalAfterProductsDiscount,
      discounts
    )?.finalPriceAfterCartDiscount;
    cartDiscountAmount = subTotal - productsDiscountedPrice - calculatedTotalAfterCartDiscount;
  }
  const cartActiveDiscount = checkOrderDiscount(
    formattedOrder,
    calculatedTotalAfterProductsDiscount,
    discounts
  )?.cartActiveDiscount;
  if (cartActiveDiscount) {
    cartActiveDiscount.deductedAmount = cartDiscountAmount || 0;
  }
  let deliveryFee = 0;
  let deliveryZoneId = $general.zone.id;
  formattedOrder.cartActiveDiscount = cartActiveDiscount || {};
  formattedOrder.outlet = formattedOrder.selections?.outlet;
  let shippingDiscount: any = null;
  let pricingType = "local";
  let shippingAgreement = "vendor";
  // if(vendor)
  if (deliveryZoneId && formattedOrder.selections?.orderType == "delivery") {
    formattedOrder.outlet = outlet;
    const zone = $general.zone;

    if (zone) {
      formattedOrder.zone = zone;

      if (
        zone.shippingDetails?.provider &&
        zone.shippingDetails?.provider != "Local Delivery" &&
        zone.shippingDetails?.pricingType == "provider"
      ) {
        pricingType = "provider";
        shippingAgreement = "provider";
      } else if (
        zone.shippingDetails?.provider &&
        zone.shippingDetails?.provider != "Local Delivery" &&
        zone.shippingDetails?.pricingType == "local"
      ) {
        pricingType = "local";
        shippingAgreement = "both";
        deliveryFee = zone.deliveryFee || 0;
      } else if (pricingType == "local") {
        deliveryFee = zone.deliveryFee || 0;
        // check for discount
      } else {
        deliveryFee = 0;
      }

      if (
        formattedOrder?.selections?.shippingMethod &&
        formattedOrder.selections?.shippingMethod?.rate &&
        pricingType !== "local" &&
        formattedOrder?.selections?.shippingMethod?.provider == zone?.provider
      ) {
        deliveryFee = formattedOrder.selections?.shippingMethod?.rate || 0;
      }
    }
  }

  if (deliveryFee) {
    formattedOrder.cart = formattedOrder.cart || {
      subTotal,
    };

    shippingDiscount = checkDeliveryDiscount(formattedOrder, deliveryFee, discounts);

    if (shippingDiscount.shippingCouponCode?.deductedAmount) {
      deliveryFee = 0;
    }
  }

  formattedOrder.shippingCouponCode = shippingDiscount?.shippingCouponCode || null;
  let finalCalculatedTotal =
    calculatedTotalAfterCartDiscount + deliveryFee - (orderData.customDiscount || 0);
  formattedOrder.deliveryFee = deliveryFee;
  interface CartOrder {
    subTotal: Number;
    productsDiscount: Number;
    deliveryFee: Number;
    cartDiscountAmount: Number;
    total: any;
    quantity: Number;
    cartItems: any;
    customDiscount: Number;
    currency: String;
    exchangeRate: any;
  }

  let cart: CartOrder = {
    cartItems: formattedCartItems,
    subTotal: subTotal,
    productsDiscount: productsDiscountedPrice,
    deliveryFee,
    quantity: totalQuantity,
    total: parseFloat(finalCalculatedTotal.toFixed(3) || "0") || 0,
    cartDiscountAmount,
    customDiscount: orderData.customDiscount || 0,
    exchangeRate: 1,
    currency: vendor.defaultCurrency || "KWD",
  };
  const order: any = {
    id: formattedOrder.id,
    cart,
    orderType: formattedOrder?.selections?.orderType || "delivery",
    address: formattedOrder?.selections?.address || {},
    outlet: {
      id: formattedOrder?.outlet?.id,
      name: formattedOrder?.outlet?.name,
      location: formattedOrder?.outlet?.location || {},
    },
    customer,
    selectedPeriod: "ASAP",
    vendorId: formattedOrder.vendorId || "",
    currency: vendor?.defaultCurrency || "KWD",
    status: formattedOrder.status || "cart",
    paymentMethod: {
      id: selections.paymentMethod || "Unset",
      name: selections.paymentMethod || "Unset",
    },
    paid: formattedOrder.paid || false,
    channel: formattedOrder.channel || "Website",
    origin: "POS",
    specialInstructions: formattedOrder.specialInstructions || "",
    paymentUrl: formattedOrder.paymentUrl || "",
    createdAt: new Date().getTime(),
    orderRef: "",
    couponsUsed: couponsUsed.map((c: any) => c.id),
    timeline: [],
    cartActiveDiscount: formattedOrder.cartActiveDiscount,
    shippingCouponCode: formattedOrder.shippingCouponCode,
    selectedOrderTime: formattedOrder?.selections?.selectedOrderTime || null,
    couponCode: formattedOrder?.couponCode || formattedOrder?.selections?.couponCode || "",
    orderNotes: formattedOrder.orderNotes || "",
  };
  if (shippingAgreement == "provider" || shippingAgreement == "both") {
    order.shipping = formattedOrder?.selections?.shippingMethod || null;
  }

  if (order.address) {
    let address = {
      ...order.address,
      deliveryZoneId: deliveryZoneId || null,
    };
    order.address = address;
  }
  order.shippingAgreement = shippingAgreement || "vendor";
  const cartChanges = getCartChanges(dbProducts, orderData.cart?.cartItems);

  // let lastCartUpdate = getOrder().lastCartUpdate || 0
  // if(orderData.cart?.total != order?.cart?.total || orderData?.cart?.cartItems?.length !== order?.cart?.cartItems?.length){
  //   lastCartUpdate = new Date().getTime()
  // }

  return {
    order,
    cartChanges,
    vendor,
  };
};

export type OrderRequestType = {
  id: string;
  orderRef: string;
  customer: any;
  vendorId: string;
  cartItems: CartItem[];
  save_card: boolean;
  selections: Selections;
  paymentMethod: string;
  orderNotes?: string;
};

type Selections = {
  orderType: string;
  selectedPeriod: string;
  selectedOrderTime: any;
  couponCode?: string;
  area: any;
  channel: string;
  outlet: Outlet;
  origin: string;
  address: any;
};

type Outlet = {
  id: string;
  name: string;
  phoneNumber?: string;
};

interface Product {
  id: string;
  name: { en: string; ar: string };
  price: number;
  discountedPrice: number;
  stockQuantity: number;
  isStockManagement: boolean;
  stockHandle: string;
  categories: string[];
  modifiersPrice: number;
  assignedModifiers: any[];
  selectedModifiers: any[];
  preparationTime: number;
  images: string[];
  description: { en: string; ar: string };
  tags: string[];
  specialInstructions: string;
  category: { name: string; id: string };
  weight: number;
  length: number;
  height: number;
  width: number;
  sku: string;
  productSpecialInstruction: string;
}

interface Discount {
  id: string;
  activeDiscountType: string;
  amountType: "percentage" | "fixed";
  percentage?: string;
  fixed?: string;
  useType: "code" | "automatic";
  code?: string;
  title?: string;
  customerEligibility: string;
  customers: string[];
  usedBy: string[];
  totalUseNumber: string;
  applied: string;
  hasEndDate: boolean;
  endDate: number;
  products?: string[];
  categories?: string[];
}

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  discountedAmount: number;
  originalPrice: number;
  modifiersPrice: number;
  productModifiers: any[];
  activeDiscount: any;
}

interface Order {
  id: string;
  cart: {
    subTotal: number;
    productsDiscount: number;
    deliveryFee: number;
    cartDiscountAmount: number;
    total: number;
    quantity: number;
    cartItems: CartItem[];
    customDiscount: number;
    currency: string;
    exchangeRate: number;
  };
  orderType: string;
  address: any;
  outlet: any;
  customer: any;
  selectedPeriod: string;
  vendorId: string;
  currency: string;
  status: string;
  paymentMethod: { id: string; name: string };
  paid: boolean;
  channel: string;
  origin: string;
  specialInstructions: string;
  paymentUrl: string;
  createdAt: number;
  orderRef: string;
  couponsUsed: string[];
  timeline: any[];
  cartActiveDiscount: any;
  shippingCouponCode: any;
  selectedOrderTime: any;
  couponCode: string;
  orderNotes: string;
  shippingAgreement: string;
  shipping?: any;
}

export const formatCartItems = (items: any[]) => {
  items = items.map((item: Indexable) => {
    let selectedModifiers: Indexable = {};
    if (item.assignedModifiers && item.assignedModifiers.length > 0) {
      item.assignedModifiers.forEach((mod: Indexable) => {
        let modDetails: Indexable = {};
        mod.list.forEach((mdItem: Indexable) => {
          if (mdItem.selected) {
            modDetails[mdItem.name?.en || mdItem.nameEn || mdItem.name?.ar] = mdItem.quantity || 1;
          }
        });

        if (Object.keys(modDetails).length > 0) {
          selectedModifiers[mod.id] = modDetails;
        }
      });
    }
    return {
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      assignedModifiers: item.assignedModifiers,
      images: item.images,
      price: item.price,
      branchesIds: item.branchesIds,
      originalPrice: item.originalPrice || item.price || 0,
      discountedAmount: ((item.originalPrice || item.price || 0) - item.price) * item.quantity || 0,
      productSpecialInstruction: item.productSpecialInstruction,
      selectedModifiers,
    };
  });

  return items;
};
