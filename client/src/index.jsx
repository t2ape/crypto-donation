import ReactDOM from 'react-dom/client';

import { StyledEngineProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import App from './app/App';

// third party css
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

// main root element
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StyledEngineProvider injectFirst>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StyledEngineProvider>,
);
