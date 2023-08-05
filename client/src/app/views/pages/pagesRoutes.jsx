import { lazy } from 'react';
import Loadable from 'app/components/Loadable';

const AdministratorFundraisersIndex = Loadable(
  lazy(() =>
    import('./administrator/fundraisers/AdministratorFundraisersIndex'),
  ),
);
const AdministratorFundraisersNew = Loadable(
  lazy(() => import('./administrator/fundraisers/AdministratorFundraisersNew')),
);
const FundraisersEdit = Loadable(
  lazy(() =>
    import('./administrator/fundraisers/AdministratorFundraisersEdit'),
  ),
);
const UserFundraisersIndex = Loadable(
  lazy(() => import('./user/fundraisers/UserFundraisersIndex')),
);
const UserFundraisersShow = Loadable(
  lazy(() => import('./user/fundraisers/UserFundraisersShow')),
);
const UserDonatedFundraisersIndex = Loadable(
  lazy(() => import('./user/donated_fundraisers/UserDonatedFundraisersIndex')),
);
const UserDonatedFundraisersShow = Loadable(
  lazy(() => import('./user/donated_fundraisers/UserDonatedFundraisersShow')),
);

const pagesRoutes = [
  {
    path: '/administrator/fundraisers',
    element: <AdministratorFundraisersIndex />,
  },
  {
    path: '/administrator/fundraisers/new',
    element: <AdministratorFundraisersNew />,
  },
  {
    path: '/administrator/fundraisers/:id/edit',
    element: <FundraisersEdit />,
  },
  { path: '/user/fundraisers', element: <UserFundraisersIndex /> },
  { path: '/user/fundraisers/:id', element: <UserFundraisersShow /> },
  {
    path: '/user/donated_fundraisers',
    element: <UserDonatedFundraisersIndex />,
  },
  {
    path: '/user/donated_fundraisers/:id',
    element: <UserDonatedFundraisersShow />,
  },
];

export default pagesRoutes;
