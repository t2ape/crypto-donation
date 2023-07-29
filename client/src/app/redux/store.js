import { configureStore } from "@reduxjs/toolkit";
import { brandReducer } from "./slices/brandSlice";
import { cartReducer } from "./slices/cartSlice";
import { categoryReducer } from "./slices/categorySlice";
import { notificationReducer } from "./slices/notificationSlice";
import { productReducer } from "./slices/productSlice";
import { ratingReducer } from "./slices/ratingSlice";
import { scrumReducer } from "./slices/scrumSlice";
import { userReducer } from "./slices/userSlice";
import { fundraiserReducer } from "./administrator/fundraiserSlice";
import { fundraiserForUserReducer } from "./user/slices/fundraiserSlice";
import { donatedFundraiserForUserReducer } from "./user/slices/donatedFundraiserSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    users: userReducer,
    brands: brandReducer,
    ratings: ratingReducer,
    scrumboard: scrumReducer,
    products: productReducer,
    categories: categoryReducer,
    notifications: notificationReducer,
    fundraisers: fundraiserReducer,
    fundraisersForUser: fundraiserForUserReducer,
    donatedFundraisersForUser: donatedFundraiserForUserReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
