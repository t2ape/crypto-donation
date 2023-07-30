import pagesRoutes from './views/pages/pagesRoutes';
import Redirect from './auth/Redirect';
import NotFound from './views/sessions/NotFound';

const routes = [
  ...pagesRoutes,
  { path: '/', element: <Redirect /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
