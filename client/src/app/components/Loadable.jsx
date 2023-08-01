import { Suspense } from 'react';
import Loading from './MatxLoading';

const Loadable = (Component) => function LoadableComponent(props) {
  return (
    <Suspense fallback={<Loading />}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...props} />
    </Suspense>
  );
};

export default Loadable;
