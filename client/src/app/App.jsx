import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SettingsProvider } from 'app/contexts/SettingsContext';
import { Provider } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import React, { useEffect } from 'react';
import { MatxTheme } from './components';
import store from './redux/store';
import routes from './routes';

function App() {
  const content = useRoutes(routes);

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Provider store={store}>
        <SettingsProvider>
          <MatxTheme>
            {content}
          </MatxTheme>
        </SettingsProvider>
      </Provider>
    </LocalizationProvider>
  );
}

export default App;
