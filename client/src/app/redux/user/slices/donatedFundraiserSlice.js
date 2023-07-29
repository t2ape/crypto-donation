import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getWeb3 from "utils/getWeb3";
import UserFundraiserHandlerContract from "contracts/UserFundraiserHandler.json";

const initialState = {
  error: null,
  donatedFundraisers: [],
  loading: false,
};

export const getDonatedFundraisers = createAsyncThunk("user/donated_fundraisers/get", async () => {
  const web3 = await getWeb3();
  const networkId = await web3.eth.net.getId();

  const accounts = await web3.eth.getAccounts();
  const selectedAccount = accounts[0];

  const deployedNetwork = UserFundraiserHandlerContract.networks[networkId];
  const contract = new web3.eth.Contract(
    UserFundraiserHandlerContract.abi,
    deployedNetwork && deployedNetwork.address
  );

  const donatedFundraisers = await contract.methods.fundraisersDonatedByMsgSender().call({ from: selectedAccount });
  return donatedFundraisers
});

const donatedFundraiserSlice = createSlice({
  initialState,
  name: "donatedFundraisersForUser",
  extraReducers: (builder) => {
    builder
      .addCase(getDonatedFundraisers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDonatedFundraisers.fulfilled, (state, actions) => {
        state.loading = false;
        state.donatedFundraisers = actions.payload;
      })
      .addCase(getDonatedFundraisers.rejected, (state, actions) => {
        state.loading = false;
        state.donatedFundraisers = [];
        state.error = actions.error.message;
      });
  },
});

export const donatedFundraiserForUserReducer = donatedFundraiserSlice.reducer;
