import pagesRoutes from './views/pages/pagesRoutes';
import Redirect from './views/pages/Redirect';
import NotFound from './views/pages/NotFound';

const routes = [
  ...pagesRoutes,
  { path: '/', element: <Redirect /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
