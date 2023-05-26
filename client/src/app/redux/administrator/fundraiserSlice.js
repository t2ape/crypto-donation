import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getWeb3 from "utils/getWeb3";
import AdministratorFundraiserHandlerContract from "contracts/AdministratorFundraiserHandler.json";

const initialState = {
  error: null,
  fundraisers: [],
  loading: false,
};

export const getFundraisers = createAsyncThunk("fundraisers/get", async () => {
  const web3 = await getWeb3();
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = AdministratorFundraiserHandlerContract.networks[networkId];
  const contract = new web3.eth.Contract(
    AdministratorFundraiserHandlerContract.abi,
    deployedNetwork && deployedNetwork.address
  );

  // TODO: ページネーションに応じた limit と offset に変更する
  const fundraisers = await contract.methods.fundraisers(50, 0).call();
  return fundraisers
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
