'use client'
import styles from './EmployerProfile.module.css'
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from "next/navigation";
import { useState } from 'react';

function EmployeeProfile({ children, ...props }) {

  const router = useRouter();
  const pathname = usePathname();

  const { window } = props;
  const isSmallScreen = useMediaQuery('(max-width:1024px)');
  const drawerWidth = isSmallScreen ? 240 : 300;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { user } = useUser();

  const menuItems = [
    { text: "User Dashboard", icon: <DashboardIcon />, path: "/employer/dashboard" },
    { text: "Profile", icon: <AccountCircleIcon />, path: "/employer/dashboard/profile" },
    { text: "Jobs", icon: <AccountCircleIcon />, path: "/employer/dashboard/jobs" },
    { text: "Applications", icon: <AccountCircleIcon />, path: "/employer/dashboard/applications" },
  ];

  const getPageTitle = () => {
    if (pathname === "/employer/dashboard") return "Employer Dashboard";
    if (pathname === "/employer/dashboard/profile") return "Profile";
    if (pathname === "/employer/dashboard/jobs") return "Jobs";
    if (pathname === "/employer/dashboard/jobs/create-job") return "Create Job";
    if (pathname === "/employer/dashboard/applications") return "Applications";
    return "Dashboard";
  };

  const drawer = (
    <div>
      <Toolbar className={styles.toolbar}>
        <div className={styles.toolbarImage}>
          {user?.imageUrl ? (
            <img src={user.imageUrl} width={50} height={50} />
          ) : (
            <img src="/placeholder.png" width={50} height={50} />
          )}
        </div>
        <div className={styles.toolbarName}>
          <h3>{user?.firstName} {user?.lastName}</h3>
          <p>Chennai, India</p>
        </div>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => router.push(item.path)}
              selected={pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: "70px",
          backgroundColor: "#fff",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {getPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }}}>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, mt: "70px" },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth, mt: "70px" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "75px",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

EmployeeProfile.propTypes = {
  window: PropTypes.func,
};

export default EmployeeProfile;
