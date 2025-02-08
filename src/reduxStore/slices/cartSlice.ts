import { Indexable, Item } from "@/app/abstraction/types";
import { $deepEqual, $getFromLocal, $writeOnLocal } from "@/app/helpers/helpers";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

export interface CartState {
  key: string | null;
  items: Item[];
  holdingName: string;
  active: boolean;
  customer?: any;
  address?: any;
  selections: {
    paymentMethod?: string;
    couponCode?: string;
    orderType?: "delivery" | "pickup";
    specialInstructions?: string;
    origin?: any;
  };
  [key: string]: any;
}

const initialState: CartState = {
  items: [] as Item[],
  key: null,
  holdingName: "",
  active: false,
  selections: { orderType: "delivery" },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    AddItem: (state, action) => {
      if (!state.key) {
        state.key = nanoid(10);
        state.active = true;
      }
      let key: any = null;
      if (action.payload.key) {
        state.items
          .filter((itm) => itm.id == action.payload.id)
          .map((itm) => {
            if ($deepEqual(itm.assignedModifiers, action.payload.assignedModifiers)) {
              key = itm.key;
            }
          });
      }

      if (!key) state.items.push({ ...action.payload });

      state.items = state.items.map((itm) =>
        itm.id == action.payload.id
          ? {
              ...itm,
              stockQuantity: itm.stockQuantity - action.payload.quantity,
              quantity:
                key && itm.key === key ? itm.quantity + action.payload.quantity : itm.quantity,
            }
          : itm
      );

      // ? Save to local storage
      setCartToLocal($getFromLocal("vendor").id, state);
    },
    SetCartField: (
      state,
      action: PayloadAction<{ fieldName: string; value: any; vendorId: string }>
    ) => {
      if (!state.key) {
        state.key = nanoid(10);
        state.active = true;
      }

      state[action.payload.fieldName] = action.payload.value;

      // ? Save to local storage
      setCartToLocal($getFromLocal("vendor").id, state);
    },
    UpdateItem: (state, action: PayloadAction<Item>) => {
      let itemToUpdate = action.payload;

      const itemIndex = state.items.findIndex((item) =>
        itemToUpdate.key ? item.key === action.payload.key : item.id === itemToUpdate.id
      );

      const incOrDecQun = state.items[itemIndex].quantity - itemToUpdate.quantity;
      state.items[itemIndex] = itemToUpdate;

      state.items = state.items.map((itm) =>
        itm.id == action.payload.id
          ? { ...itm, stockQuantity: itm.stockQuantity + incOrDecQun }
          : itm
      );

      setCartToLocal($getFromLocal("vendor").id, state);
    },
    RemoveItem: (state, action) => {
      const { id, key } = action.payload;

      const hasKey = key !== undefined; // Ensure `0` is treated as a valid key

      const itemToRemove = state.items.find((item) => (hasKey ? item.key === key : item.id === id));

      if (itemToRemove) {
        // Update stockQuantity for the matching item
        state.items = state.items.map((item) =>
          item.id === id
            ? { ...item, stockQuantity: item.stockQuantity + itemToRemove.quantity }
            : item
        );

        // Remove the item from the list
        state.items = state.items.filter((item) => (hasKey ? item.key !== key : item.id !== id));
      }

      // ? Save to local storage
      setCartToLocal($getFromLocal("vendor").id, state);
    },

    UpdateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number; key?: number }>
    ) => {
      const { id, quantity, key } = action.payload;

      const item = state.items.find((item) => (key ? item.key === key : item.id === id));
      const previousQuantity = item?.quantity as number;

      const incOrDecQun = previousQuantity - quantity;

      if (item) item.quantity = quantity;

      state.items = state.items.map((itm) =>
        itm.id == id ? { ...itm, stockQuantity: itm.stockQuantity + incOrDecQun } : itm
      );

      // ? Save to local storage
      setCartToLocal($getFromLocal("vendor").id, state);
    },

    ResetCart: (state, action: PayloadAction<{ vendorId: string }>) => {
      state.items = [];
      Object.keys(state).forEach((key) => {
        if (key !== "items") {
          delete state[key];
        }
      });
      // ? Save to local storage
      setCartToLocal($getFromLocal("vendor").id, state);
    },

    HoldCart: (
      state,
      action: PayloadAction<{ vendorId: string; holdingName: string; cartKey?: string }>
    ) => {
      const { vendorId, holdingName, cartKey } = {
        ...action.payload,
        vendorId: $getFromLocal("vendor").id,
      };

      if (cartKey) {
        // If `cartKey` is provided and `state.items` is not empty, clear the cart first
        if (state.items.length > 0) {
          state.holdingName = holdingName;
          state.active = false;
          setCartToLocal(vendorId, state); // Save current state to local storage
          state.items = [];
          Object.keys(state).forEach((key) => {
            if (key !== "items") delete state[key];
          });
        }

        // Load the holden cart
        const vendorOutletKey = `${vendorId}_${$getFromLocal("branch").id}`;
        const holdenCart = getHoldenCart(vendorOutletKey, cartKey);
        Object.assign(state, holdenCart);
      } else {
        // Handle saving the current cart
        state.holdingName = holdingName;
        setCartToLocal(vendorId, state); // Save current state to local storage
        state.items = [];
        Object.keys(state).forEach((key) => {
          if (key !== "items") delete state[key];
        });
      }
    },
    VoidCart: (state, action: PayloadAction<{ vendorId: string }>) => {
      const key = state.key as string;
      state.items = [];
      Object.keys(state).forEach((key) => {
        if (key !== "items") delete state[key];
      });
      const vendorOutletKey = `${$getFromLocal("vendor").id}_${$getFromLocal("branch").id}`;
      deleteCartFromLocal(vendorOutletKey, key);
    },
    ActivateCart: (state, action: PayloadAction<{ cart: CartState }>) => {
      Object.assign(state, action.payload.cart);
    },
  },
});

export const {
  AddItem,
  RemoveItem,
  UpdateQuantity,
  SetCartField,
  UpdateItem,
  ResetCart,
  HoldCart,
  VoidCart,
  ActivateCart,
} = cartSlice.actions;
export default cartSlice.reducer;

function setCartToLocal(vendorId: string, cart: CartState) {
  let getLocalCarts = $getFromLocal("carts");

  vendorId += `_${$getFromLocal("branch").id}`;

  if (!getLocalCarts) {
    const openStorage: any = {};
    openStorage[vendorId] = [cart];
    $writeOnLocal("carts", openStorage);
    return;
  }

  if (!getLocalCarts[vendorId]) getLocalCarts[vendorId] = [];
  let findCart = getLocalCarts[vendorId]?.find((_cart: CartState) => _cart.key === cart.key);

  if (!findCart) {
    getLocalCarts[vendorId].push(cart);
  } else {
    let updateCarts = getLocalCarts[vendorId]
      .map((_cart: CartState) => {
        if (_cart.key === cart.key) {
          //TODO delete cart if cart.items.length === 0 (optional)
          // if (cart.items.length === 0) {

          //   return null;
          // }
          return cart;
        }
        return _cart;
      })
      .filter(Boolean); // Remove null values from the array
    getLocalCarts[vendorId] = updateCarts;
  }

  $writeOnLocal("carts", getLocalCarts);
}

function deleteCartFromLocal(vendorId: string, cartKey: string) {
  let getLocalCarts = $getFromLocal("carts") || {};
  const findCartIndex = (getLocalCarts[vendorId] || []).findIndex(
    (cart: CartState) => cart.key == cartKey
  );
  if (findCartIndex !== -1) {
    getLocalCarts[vendorId].splice(findCartIndex, 1);
  }
  $writeOnLocal("carts", getLocalCarts);
}

export function getHoldenCart(vendorId: string, cartKey: string) {
  let getLocalCarts = $getFromLocal("carts");

  let cartToReturn: CartState = { key: "", items: [], holdingName: "", active: true };
  getLocalCarts[vendorId] = getLocalCarts[vendorId].map((_cart: CartState) => {
    if (_cart.key === cartKey) {
      const foundCart = { ..._cart, holdingName: "" };
      cartToReturn = foundCart;
      return foundCart;
    }
    return _cart;
  });
  $writeOnLocal("carts", getLocalCarts);

  return cartToReturn as CartState;
}
