import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getWeb3 from "utils/getWeb3";
import FundraiserContract from "contracts/Fundraiser.json";

const initialState = {
  error: null,
  donations: [],
  loading: false,
};

export const getDonations = createAsyncThunk("user/donations/get", async (id) => {
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  const selectedAccount = accounts[0];

  const contract = new web3.eth.Contract(
    FundraiserContract.abi,
    id
  );

  const donations = await contract.methods.donations().call({ from: selectedAccount });
  return donations
});

const donationSlice = createSlice({
  initialState,
  name: "donationsForUser",
  extraReducers: (builder) => {
    builder
      .addCase(getDonations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDonations.fulfilled, (state, actions) => {
        state.loading = false;
        state.donations = actions.payload;
        // console.log(`donations: ${state.donations}`);
      })
      .addCase(getDonations.rejected, (state, actions) => {
        state.loading = false;
        state.donations = [];
        state.error = actions.error.message;
      });
  },
});

export const donationForUserReducer = donationSlice.reducer;
