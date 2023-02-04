import { GitHub } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ArticleIcon from "@mui/icons-material/Article";
import {
  Toolbar,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Drawer,
  Box,
  IconButton,
  Typography,
  ListSubheader,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Props {
  drawerWidth: number;
  toggleTheme: () => void;
  isDarkTheme: boolean;
}

const ResponsiveDrawer = ({ drawerWidth, toggleTheme, isDarkTheme }: Props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    setCurrentPage(router.asPath);
    const handleRouteChange = (url: string) => {
      setCurrentPage(url);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  const drawer = (
    <Box onClick={handleDrawerToggle}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
          maxHeight: "100dvh",
        }}
      >
        <List disablePadding>
          <ListItem>
            <Box
              sx={{ display: "flex", py: 3, gap: 1, justifyContent: "center" }}
            >
              <Box>
                <Typography fontWeight="bold">NoteTaky</Typography>
                <Typography>Simple Note Taking</Typography>
              </Box>
            </Box>
            <Divider />
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={currentPage === "/"}
              component={Link}
              href="/"
            >
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListSubheader component="div" id="nested-list-subheader">
            Recent Pages
          </ListSubheader>
        </List>
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton
            onClick={toggleTheme}
            aria-label="toggle Dark and Light theme mode"
          >
            {isDarkTheme ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton
            component={Link}
            href="https://github.com/joscha0/notetaky"
            target="_blank"
            aria-label="GitHub"
            rel="noreferrer"
          >
            <GitHub />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Box
        position="fixed"
        sx={{
          zIndex: 999,
          display: { sm: "none" },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Box>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="drawer"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default ResponsiveDrawer;
