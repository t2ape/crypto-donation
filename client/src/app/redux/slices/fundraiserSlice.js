import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  error: null,
  fundraisers: [],
  loading: false,
};

export const getFundraisers = createAsyncThunk("products/get", async () => {
  const res = await axios.get("/api/ecommerce/get-product-list");
  return res.data;
});

const fundraiserSlice = createSlice({
  initialState,
  name: "fundraisers",
  extraReducers: (builder) => {
    builder
      .addCase(getFundraisers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFundraisers.fulfilled, (state, actions) => {
        state.loading = false;
        state.fundraisers = actions.payload;
      })
      .addCase(getFundraisers.rejected, (state, actions) => {
        state.loading = false;
        state.fundraisers = [];
        state.error = actions.error.message;
      });
  },
});

export const fundraiserReducer = fundraiserSlice.reducer;
