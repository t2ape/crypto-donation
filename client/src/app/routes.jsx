import About from './views/pages/About';
import Disclaimer from './views/pages/Disclaimer';
import NotFound from './views/pages/NotFound';
import pagesRoutes from './views/pages/pagesRoutes';
import Redirect from './views/pages/Redirect';

const routes = [
  ...pagesRoutes,
  { path: '/about', element: <About /> },
  { path: '/disclaimer', element: <Disclaimer /> },
  { path: '/', element: <Redirect /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
