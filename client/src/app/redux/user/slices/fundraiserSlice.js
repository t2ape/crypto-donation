import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getWeb3 from "utils/getWeb3";
import FundraiserFactoryContract from "contracts/FundraiserFactory.json";

const initialState = {
  error: null,
  fundraisers: [],
  loading: false,
};

export const getFundraisers = createAsyncThunk("user/fundraisers/get", async () => {
  const web3 = await getWeb3();
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = FundraiserFactoryContract.networks[networkId];
  const contract = new web3.eth.Contract(
    FundraiserFactoryContract.abi,
    deployedNetwork && deployedNetwork.address
  );

  // TODO: ページネーションに応じた limit と offset に変更する
  const fundraisers = await contract.methods.fundraisers_for_user(50, 0).call();
  return fundraisers
});

const fundraiserSlice = createSlice({
  initialState,
  name: "fundraisersForUser",
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

export const fundraiserForUserReducer = fundraiserSlice.reducer;
