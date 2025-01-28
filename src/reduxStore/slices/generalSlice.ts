import { Indexable, Item } from "@/app/abstraction/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GeneralState {
  branch: Indexable;
  products: Array<Item>;
  discounts: Array<any>;
  [key: string]: any;
}

const initialState: GeneralState = {
  branch: {},
  products: [],
  discounts: [],
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
