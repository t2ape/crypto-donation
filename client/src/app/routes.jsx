import fundRaiserRoutes from "./views/fundRaiserRoutes";
import NotFound from "./views/NotFound";

const routes = [
  ...fundRaiserRoutes,
  { path: "*", element: <NotFound /> },
];

export default routes;
