import { Indexable, Item } from "@/app/abstraction/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GeneralState {
  branch: Indexable;
  products: Array<Item>;
  discounts: Array<any>;
  order: Indexable;
  outlets: Array<any>;
  zone: Indexable;
  cartDrawer?: boolean;
  shippingMethods: any[];
  [key: string]: any;
}

const initialState: GeneralState = {
  branch: {},
  products: [],
  discounts: [],
  order: {},
  outlets: [],
  zone: {},
  shippingMethods: [],
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    SetGeneralField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      state[action.payload.field] = action.payload.value;
    },
  },
});

export const { SetGeneralField } = generalSlice.actions;
export default generalSlice.reducer;
