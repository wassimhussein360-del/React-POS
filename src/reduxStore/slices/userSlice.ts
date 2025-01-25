import { User, Vendor } from "@/app/abstraction/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: User | null;
  vendors: any[];
  vendor: Vendor | null;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  vendors: [],
  vendor: null,
  isLoading: true,
};

export const userVendorInfo = createAsyncThunk(
  "cart/addItemAndDoSomethingElse",
  async (userVendorInfo: UserState, { dispatch, getState }) => {
    // You can also access the state if needed
    const state: any = getState();
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SetUser: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
    },

    SetVendors: (state, action: PayloadAction<UserState["vendors"]>) => {
      state.vendors = action.payload;
    },

    SetVendor: (state, action: PayloadAction<UserState["vendor"]>) => {
      state.vendor = action.payload;
    },
    SetLoader: (state, action: PayloadAction<UserState["isLoading"]>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { SetUser, SetVendors, SetVendor,SetLoader } = userSlice.actions;
export default userSlice.reducer;
