import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";
import { ThemeProvider, Box, CssBaseline } from "@mui/material";
import { useState } from "react";
import { darkTheme, lightTheme } from "../services/themes";
import ResponsiveDrawer from "../components/drawer";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    localStorage.setItem("is-dark-theme", (!isDarkTheme).toString());
    setIsDarkTheme(!isDarkTheme);
  };
  const drawerWidth = 240;

  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <ResponsiveDrawer
            drawerWidth={drawerWidth}
            isDarkTheme={isDarkTheme}
            toggleTheme={toggleTheme}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
          >
            <Component {...pageProps} />
          </Box>
        </Box>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default MyApp;
