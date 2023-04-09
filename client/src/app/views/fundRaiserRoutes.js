import Loadable from "app/components/Loadable";
import { lazy } from "react";

const FundRaiserForm = Loadable(lazy(() => import("./fund_raisers/FundRaiserForm")));

const fundRaiserRoutes = [
  { path: "/fund_raisers/new", element: <FundRaiserForm /> },
];

export default fundRaiserRoutes;
