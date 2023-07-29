import { getDonations } from "app/redux/user/slices/donationSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useDonations = (id) => {
  const dispatch = useDispatch();
  const { error, donations, loading } = useSelector((state) => state.donationsForUser);

  // console.log(`donations: ${donations}`);

  useEffect(() => {
    dispatch(getDonations(id));
  }, [dispatch]);

  return {
    donations,
    isError: error,
    isLoading: loading,
  };
};

export default useDonations;
