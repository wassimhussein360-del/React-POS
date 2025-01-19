import { User } from "@/app/abstraction/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: User | null;
  vendors: any[];
  vendor: any;
}

const initialState: UserState = {
  user: null,
  vendors: [],
  vendor: null,
};

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
  },
});

export const { SetUser, SetVendors, SetVendor } = userSlice.actions;
export default userSlice.reducer;
