'use client'
import styles from './EmployerProfile.module.css'
import PropTypes from 'prop-types';
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery
} from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from "next/navigation";
import { useState } from 'react';
import Overview from './overview/Overview';
import { IoBriefcase } from "react-icons/io5";
import { IoDocumentTextSharp } from "react-icons/io5";

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
    { text: "Overview", icon: <DashboardIcon />, path: "/employer/dashboard", color: "#673AB7"  },
    { text: "Profile", icon: <AccountCircleIcon />, path: "/employer/dashboard/profile", color: "#3F51B5"  },
    { text: "Jobs", icon: <IoBriefcase />, path: "/employer/dashboard/jobs", color: "#ff6200ff"  },
    { text: "Applications", icon: <IoDocumentTextSharp />, path: "/employer/dashboard/applications", color: "green"  },
  ];

  const getPageTitle = () => {
    if (pathname === "/employer/dashboard") return "Employer Dashboard";
    if (pathname === "/employer/dashboard/profile") return "Profile";
    if (pathname === "/employer/dashboard/jobs") return "Jobs";
    if (pathname === "/employer/dashboard/jobs/create-job") return "Create Job";
    if (pathname === "/employer/dashboard/applications") return "Applications";
    return "Dashboard";
  };

  const generateBreadcrumbs = () => {
  const pathParts = pathname.split("/").filter(Boolean);

  const breadcrumbItems = [];

  pathParts.forEach((part, index) => {
    const href = "/" + pathParts.slice(0, index + 1).join("/");

    const isLast = index === pathParts.length - 1;

    // Capitalize
    const label = part
      .replace("-", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    if (isLast) {
      breadcrumbItems.push(
        <Typography key={href} color="text.primary">
          {label}
        </Typography>
      );
    } else {
      breadcrumbItems.push(
        <Link
          key={href}
          underline="hover"
          color="inherit"
          onClick={() => router.push(href)}
          sx={{ cursor: "pointer" }}
        >
          {label}
        </Link>
      );
    }
  });

  return breadcrumbItems;
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
              <ListItemIcon className={styles.icon}  style={{ color: item.color }}>{item.icon}</ListItemIcon>
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

      {/* <AppBar
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
      </AppBar> */}

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
          background:'#F5F7FC',
          minHeight:'100vh'
        }}
      > 
        <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
          >
            {generateBreadcrumbs()}
          </Breadcrumbs>
        {pathname === '/employer/dashboard' ? <Overview /> : children}
      </Box>
    </Box>
  );
}

EmployeeProfile.propTypes = {
  window: PropTypes.func,
};

export default EmployeeProfile;
