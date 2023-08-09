import pagesRoutes from './views/pages/pagesRoutes';
import Redirect from './views/pages/Redirect';
import NotFound from './views/pages/NotFound';
import About from './views/pages/About';

const routes = [
  ...pagesRoutes,
  { path: '/about', element: <About /> },
  // { path: '/disclaimer', element: <Disclaimer /> },
  { path: '/', element: <Redirect /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
