import { Discount, Item } from "@/app/abstraction/types";
import { $getFromLocal, $writeOnLocal } from "@/app/helpers/helpers";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { it } from "node:test";

interface CartState {
  items: Item[];
  [key: string]: any;
}

const initialState: CartState = {
  items: [] as Item[],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    AddItem: (state, action) => {
      state.items.push({ ...action.payload });

      state.items = state.items.map((itm) =>
        itm.id == action.payload.id ? { ...itm, stock: itm.stock - action.payload.quantity } : itm
      );
    },
    SetCartField: (state, action: PayloadAction<{ fieldName: string; value: any }>) => {
      state[action.payload.fieldName] = action.payload.value;
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
    },
    AddDiscount: (state, action: PayloadAction<{ id: string; discount: Discount }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.discount = action.payload.discount;
      }
    },
  },
});

export const { AddItem, RemoveItem, UpdateQuantity, AddDiscount, SetCartField, UpdateItem } =
  cartSlice.actions;
export default cartSlice.reducer;

function setCartToLocal(vendorId: string, cart: Item[]) {
  const getLocalCarts = $getFromLocal("carts");
  const newCarts = (getLocalCarts[vendorId] = cart);
  $writeOnLocal("carts", newCarts);
}
