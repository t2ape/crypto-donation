import { Box, styled, ThemeProvider, useTheme } from "@mui/material";
import useSettings from "app/hooks/useSettings";
import Scrollbar from "react-perfect-scrollbar";
import { Outlet } from "react-router-dom";
import Footer from "../../Footer";
import SecondarySidebar from "../../SecondarySidebar/SecondarySidebar";
import { Layout2Container } from "./layout2.style";

// styled components
const Layout2Root = styled("div")({
  flexGrow: 1,
  height: "100vh",
  display: "flex",
  overflow: "hidden",
  position: "relative",
  flexDirection: "column",
});

const ContentBox = styled(Box)({
  padding: 0,
  height: "100%",
  display: "flex",
  overflowY: "auto",
  overflowX: "hidden",
  flexDirection: "column",
  justifyContent: "space-between",
});

const StyledScrollBar = styled(Scrollbar)({
  flexGrow: "1",
  display: "flex",
  position: "relative",
  flexDirection: "column",
});

const Layout2 = () => {
  const theme = useTheme();
  const { settings } = useSettings();

  let { layout2Settings } = settings;
  let topbarTheme = settings.themes[layout2Settings.topbar.theme];
  let navbarTheme = settings.themes[layout2Settings.navbar.theme];
  const {
    leftSidebar: { mode: sidenavMode, show: showSidenav },
  } = layout2Settings;

  let layoutClasses = {
    [settings.activeLayout]: true,
    "bg-default text-primary": true,
    [`sidenav-${layout2Settings.leftSidebar.mode}`]: true,
    [`layout-${layout2Settings.mode} theme-${theme.palette.type}`]: true,
  };

  return (
    <Layout2Container>
      <Layout2Root className={layoutClasses}>
        {settings.perfectScrollbar && (
          <StyledScrollBar options={{ suppressScrollX: true }}>
            <Box p={0} flexGrow={1} position="relative">
              <Outlet />
            </Box>
            {settings.footer.show && !settings.footer.fixed && <Footer />}
          </StyledScrollBar>
        )}

        {!settings.perfectScrollbar && (
          <ContentBox options={{ suppressScrollX: true }}>
            <Box p={0} flexGrow={1} position="relative">
              <Outlet />
            </Box>
            {settings.footer.show && !settings.footer.fixed && <Footer />}
          </ContentBox>
        )}

        {settings.footer.show && settings.footer.fixed && <Footer />}
      </Layout2Root>

      {settings.secondarySidebar.show && <SecondarySidebar />}
    </Layout2Container>
  );
};

export default Layout2;
