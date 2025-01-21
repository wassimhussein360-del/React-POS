import { Discount, Item } from "@/app/abstraction/types";
import { $getFromLocal, $writeOnLocal } from "@/app/helpers/helpers";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  key: string | null;
  items: Item[];
  holdingName: string;
  [key: string]: any;
}

const initialState: CartState = {
  items: [] as Item[],
  key: null,
  holdingName: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    AddItem: (state, action) => {
      if (!state.items.length) state.key = new Date().getTime().toString();

      state.items.push({ ...action.payload });

      state.items = state.items.map((itm) =>
        itm.id == action.payload.id ? { ...itm, stock: itm.stock - action.payload.quantity } : itm
      );

      // ? Save to local storage
      setCartToLocal(action.payload.vendorId, state);
    },
    SetCartField: (
      state,
      action: PayloadAction<{ fieldName: string; value: any; vendorId: string }>
    ) => {
      state[action.payload.fieldName] = action.payload.value;

      // ? Save to local storage
      setCartToLocal(action.payload.vendorId, state);
    },
    UpdateItem: (state, action: PayloadAction<Item>) => {
      if (action.payload.key) {
        let incOrDecQun = 0;
        const item = state.items.find((item) => item.key === action.payload.key);
        if (item) {
          incOrDecQun = item.quantity - action.payload.quantity;
          item.quantity = action.payload.quantity;
          item.modifiers = action.payload.modifiers;
        }

        state.items = state.items.map((itm) =>
          itm.id == action.payload.id ? { ...itm, stock: itm.stock + incOrDecQun } : itm
        );

        // ? Save to local storage
        setCartToLocal(item?.vendorId as string, state);
      }
    },
    RemoveItem: (state, action) => {
      const { id, key } = action.payload;

      const hasKey = key !== undefined; // Ensure `0` is treated as a valid key

      const itemToRemove = state.items.find((item) => (hasKey ? item.key === key : item.id === id));

      if (itemToRemove) {
        // Update stock for the matching item
        state.items = state.items.map((item) =>
          item.id === id ? { ...item, stock: item.stock + itemToRemove.quantity } : item
        );

        // Remove the item from the list
        state.items = state.items.filter((item) => (hasKey ? item.key !== key : item.id !== id));
      }

      // ? Save to local storage
      setCartToLocal(itemToRemove?.vendorId as string, state);
    },

    UpdateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number; key?: number }>
    ) => {
      const key = action.payload.key;
      const item = state.items.find((item) =>
        key ? item.key === action.payload.key : item.id === action.payload.id
      );

      const incOrDecQun = (item?.quantity as number) - action.payload.quantity;

      if (item) item.quantity = action.payload.quantity;

      state.items = state.items.map((itm) =>
        itm.id == action.payload.id ? { ...itm, stock: itm.stock + incOrDecQun } : itm
      );

      // ? Save to local storage
      setCartToLocal(item?.id as string, state);
    },
    AddDiscount: (state, action: PayloadAction<{ id: string; discount: Discount }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.discount = action.payload.discount;
      }

      // ? Save to local storage
      setCartToLocal(item?.id as string, state);
    },

    ResetCart: (state, action: PayloadAction<{ vendorId: string }>) => {
      state.items = [];
      Object.keys(state).forEach((key) => {
        if (key !== "items") {
          delete state[key];
        }
      });
      // ? Save to local storage
      setCartToLocal(action.payload.vendorId, state);
    },

    HoldCart: (
      state,
      action: PayloadAction<{ vendorId: string; holdingName: string; cartKey?: string }>
    ) => {
      console.log(action.payload.cartKey);
      console.log(action.payload.holdingName);
      console.log(action.payload.vendorId);

      const vendorId = action.payload.vendorId;
      if (action.payload.cartKey) {
        console.log(1);

        const holdenCart = getHoldenCart(vendorId, action.payload.cartKey);
        console.log({ holdenCart });

        state.items = holdenCart.items;
        state.key = holdenCart.key;
        state.holdingName = holdenCart.holdingName;
        Object.keys(holdenCart).forEach((key) => {
          if (key !== "items" && key !== "key" && key !== "holdingName") {
            state[key] = holdenCart[key];
          }
        });
      } else {
        console.log(2);

        state.holdingName = action.payload.holdingName;

        // ? Save to local storage
        setCartToLocal(vendorId, state);

        state.items = [];
        Object.keys(state).forEach((key) => {
          if (key !== "items") {
            delete state[key];
          }
        });
      }
    },
  },
});

export const {
  AddItem,
  RemoveItem,
  UpdateQuantity,
  AddDiscount,
  SetCartField,
  UpdateItem,
  ResetCart,
  HoldCart,
} = cartSlice.actions;
export default cartSlice.reducer;

function setCartToLocal(vendorId: string, cart: CartState) {
  let getLocalCarts = $getFromLocal("carts");
  console.log({ 1: cart });

  if (!getLocalCarts) {
    const openStorage: any = {};
    openStorage[vendorId] = [cart];
    $writeOnLocal("carts", openStorage);
    console.log({ 2: openStorage });
    return;
  }

  let findCart = getLocalCarts[vendorId].find((_cart: CartState) => _cart.key === cart.key);

  console.log({ 3: findCart });

  if (!findCart) {
    getLocalCarts[vendorId].push(cart);
  } else {
    let updateCarts = getLocalCarts[vendorId]
      .map((_cart: CartState) => {
        if (_cart.key === cart.key) {
          // delete cart if cart.items.length === 0
          if (cart.items.length === 0) {
            console.log(["cart is empty"]);

            return null;
          }
          return cart;
        }
        return _cart;
      })
      .filter(Boolean); // Remove null values from the array
    getLocalCarts[vendorId] = updateCarts;
  }

  $writeOnLocal("carts", getLocalCarts);
}

function getHoldenCart(vendorId: string, cartKey: string) {
  let getLocalCarts = $getFromLocal("carts");

  let cartToReturn: CartState = { key: "", items: [], holdingName: "" };
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
