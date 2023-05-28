import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AuthProvider } from "app/contexts/FirebaseAuthContext";
import { SettingsProvider } from "app/contexts/SettingsContext";
import { Provider } from "react-redux";
import { useRoutes } from "react-router-dom";
import { MatxTheme } from "./components";
import store from "./redux/store";
import routes from "./routes";
import "../fake-db";
import React, { useEffect } from 'react';

const App = () => {
  const content = useRoutes(routes);

  useEffect(() => {
    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload();
    });
    }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Provider store={store}>
        <SettingsProvider>
          <MatxTheme>
            <AuthProvider>{content}</AuthProvider>
          </MatxTheme>
        </SettingsProvider>
      </Provider>
    </LocalizationProvider>
  );
};

export default App;
