// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { SettingsProvider } from "app/contexts/SettingsContext";
import { useRoutes } from "react-router-dom";
import { MatxTheme } from "./components";
import routes from "./routes";

const App = () => {
  const content = useRoutes(routes);

  return (
    <SettingsProvider>
      <MatxTheme>
        {content}
      </MatxTheme>
    </SettingsProvider>
  );
  // return (
  //   <LocalizationProvider dateAdapter={AdapterDateFns}>
  //     <SettingsProvider>
  //       <MatxTheme>
  //         {content}
  //       </MatxTheme>
  //     </SettingsProvider>
  //   </LocalizationProvider>
  // );
};

export default App;
