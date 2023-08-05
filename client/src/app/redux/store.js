import { configureStore } from '@reduxjs/toolkit';

import { userDonatedFundraiserReducer } from './slices/user/donatedFundraiserSlice';
import { userDonationReducer } from './slices/user/donationSlice';

const store = configureStore({
  reducer: {
    userDonatedFundraisers: userDonatedFundraiserReducer,
    userDonations: userDonationReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
