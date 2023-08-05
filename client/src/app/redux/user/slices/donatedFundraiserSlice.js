import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import UserFundraiserHandlerContract from 'contracts/UserFundraiserHandler.json';
import getWeb3 from 'utils/getWeb3';

const initialState = {
  error: null,
  donatedFundraisers: [],
  loading: false,
};

export const getDonatedFundraisers = createAsyncThunk(
  'user/donated_fundraisers/get',
  async () => {
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    const accounts = await web3.eth.getAccounts();
    const deployedNetwork = UserFundraiserHandlerContract.networks[networkId];
    const contract = new web3.eth.Contract(
      UserFundraiserHandlerContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    const donatedFundraisers = await contract.methods
      .fundraisersDonatedByMsgSender()
      .call({ from: accounts[0] });
    return donatedFundraisers;
  },
);

const donatedFundraiserSlice = createSlice({
  initialState,
  name: 'userDonatedFundraisers',
  extraReducers: (builder) => {
    builder
      .addCase(getDonatedFundraisers.pending, (state) => {
        state.loading = true; // eslint-disable-line no-param-reassign
      })
      .addCase(getDonatedFundraisers.fulfilled, (state, actions) => {
        state.loading = false; // eslint-disable-line no-param-reassign
        state.donatedFundraisers = actions.payload; // eslint-disable-line no-param-reassign
      })
      .addCase(getDonatedFundraisers.rejected, (state, actions) => {
        state.loading = false; // eslint-disable-line no-param-reassign
        state.donatedFundraisers = []; // eslint-disable-line no-param-reassign
        state.error = actions.error.message; // eslint-disable-line no-param-reassign
      });
  },
});

export const userDonatedFundraiserReducer = donatedFundraiserSlice.reducer;
