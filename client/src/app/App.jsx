import React, { useEffect } from 'react';

import { styled } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Provider } from 'react-redux';
import { useRoutes } from 'react-router-dom';

import { SettingsProvider } from 'app/contexts/SettingsContext';

import { MatxTheme } from './components';
import Footer from './components/Footer';
import store from './redux/store';
import routes from './routes';

const AppContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
});

const ContentArea = styled('div')({
  flexGrow: 1,
});

function App() {
  const content = useRoutes(routes);

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });
  }, []);

  return (
    <AppContainer>
      <ContentArea>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Provider store={store}>
            <SettingsProvider>
              <MatxTheme>{content}</MatxTheme>
            </SettingsProvider>
          </Provider>
        </LocalizationProvider>
      </ContentArea>
      <Footer />
    </AppContainer>
  );
}

export default App;
