import {
  Box,
  styled,
  ThemeProvider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import useSettings from 'app/hooks/useSettings';
import { sidenavCompactWidth, sideNavWidth } from 'app/utils/constant';
import React, { useEffect, useRef } from 'react';
import Scrollbar from 'react-perfect-scrollbar';
import Footer from '../../Footer';
import SecondarySidebar from '../../SecondarySidebar/SecondarySidebar';

// styled components
const Layout1Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  background: theme.palette.background.default,
}));

const ContentBox = styled(Box)({
  height: '100%',
  display: 'flex',
  overflowY: 'auto',
  overflowX: 'hidden',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const StyledScrollBar = styled(Scrollbar)({
  flexGrow: '1',
  height: '100%',
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
});

const LayoutContainer = styled(Box)(({ width, open }) => ({
  flexGrow: '1',
  height: '100vh',
  display: 'flex',
  marginLeft: width,
  overflow: 'hidden',
  verticalAlign: 'top',
  position: 'relative',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  marginRight: open ? 50 : 0,
}));

const Layout1 = () => {
  const { settings, updateSettings } = useSettings();
  const { layout1Settings, secondarySidebar } = settings;
  const topbarTheme = settings.themes[layout1Settings.topbar.theme];
  const {
    leftSidebar: { mode: sidenavMode, show: showSidenav },
  } = layout1Settings;

  const getSidenavWidth = () => {
    switch (sidenavMode) {
      case 'full':
        return sideNavWidth;
      case 'compact':
        return sidenavCompactWidth;
      default:
        return '0px';
    }
  };

  const theme = useTheme();
  const sidenavWidth = getSidenavWidth();
  const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));

  const ref = useRef({ isMdScreen, settings });
  const layoutClasses = `theme-${theme.palette.type}`;

  useEffect(() => {
    let { settings } = ref.current;
    let sidebarMode = settings.layout1Settings.leftSidebar.mode;

    if (settings.layout1Settings.leftSidebar.show) {
      let mode = isMdScreen ? 'close' : sidebarMode;
      updateSettings({ layout1Settings: { leftSidebar: { mode } } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMdScreen]);

  return (
    <Layout1Root className={layoutClasses}>
      <LayoutContainer width={sidenavWidth} open={secondarySidebar.open}>
        {settings.footer.show && settings.footer.fixed && <Footer />}
      </LayoutContainer>

      {settings.secondarySidebar.show && <SecondarySidebar />}
    </Layout1Root>
  );
};

export default React.memo(Layout1);
