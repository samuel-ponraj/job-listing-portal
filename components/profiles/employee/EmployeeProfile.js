'use client'
import styles from './EmployeeProfile.module.css'
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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import { useState } from 'react';
import ProfileForm from './ProfileForm';
import ResumeUpload from './ResumeUpload';
import { useUser } from "@clerk/clerk-react";
import AppliedJobs from './appliedjobs/AppliedJobs';
import { FaCircleCheck } from "react-icons/fa6";
// import Breadcrumbs from '@mui/material/Breadcrumbs';
// import Link from '@mui/material/Link';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// import { usePathname } from 'next/navigation';


function EmployeeProfile(props) {

  // const pathname = usePathname();

  const { window } = props;
  const isSmallScreen = useMediaQuery('(max-width:1024px)');
  const drawerWidth = isSmallScreen ? 240 : 300;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Dashboard'); 

  const {user } = useUser();

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) setMobileOpen(!mobileOpen);
  };


  const menuItems = [
    // { text: 'Overview', icon: <DashboardIcon />, value: 'Overview' },
    { text: 'Profile', icon: <AccountCircleIcon />, value: 'Profile', color: "#3F51B5" },
    { text: 'Resume', icon: <DescriptionIcon />, value: 'Resume', color: "#FB8C00"  },
    { text: 'Applied Jobs', icon: <FaCircleCheck />, value: 'Applied Jobs', color: "green"  },
  ];

  const userImage = user?.imageUrl

  const drawer = (
    <div>
      <Toolbar className={styles.toolbar}>
        <div className={styles.toolbarImage}>
          {userImage? (
            <img src={userImage} alt="" width={50} height={50} />
          ): <img src='/placeholder.png' alt="" width={50} height={50} />
          }
        </div>  
        <div className={styles.toolbarName}>
          <h3>{user?.firstName} {user?.lastName}</h3>
        </div>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => setSelectedSection(item.value)} // 👈 Switch content
              selected={selectedSection === item.value} // highlight active item
            >
              <ListItemIcon className={styles.icon} style={{ color: item.color }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;


  const renderMainContent = () => {
    switch (selectedSection) {
      case 'Profile':
        return <ProfileForm />;
      case 'Resume':
        return <ResumeUpload />;
      case 'Applied Jobs':
        return <AppliedJobs />;  
      default:
        return <AppliedJobs />;
    }
  };

//   const generateBreadcrumbs = () => {
//   const pathParts = pathname.split("/").filter(Boolean);

//   const breadcrumbItems = [];

//   pathParts.forEach((part, index) => {
//     const href = "/" + pathParts.slice(0, index + 1).join("/");

//     const isLast = index === pathParts.length - 1;

//     // Capitalize
//     const label = part
//       .replace("-", " ")
//       .replace(/\b\w/g, (l) => l.toUpperCase());

//     if (isLast) {
//       breadcrumbItems.push(
//         <Typography key={href} color="text.primary">
//           {label}
//         </Typography>
//       );
//     } else {
//       breadcrumbItems.push(
//         <Link
//           key={href}
//           underline="hover"
//           color="inherit"
//           onClick={() => router.push(href)}
//           sx={{ cursor: "pointer" }}
//         >
//           {label}
//         </Link>
//       );
//     }
//   });

//   return breadcrumbItems;
// };

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
          mt: '70px',
          backgroundColor: '#fff',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            {selectedSection === 'Dashboard' ? 'Applied Jobs' : selectedSection}
          </Typography>
        </Toolbar>
      </AppBar>

     
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, mt: '70px' },
          }}
          slotProps={{ root: { keepMounted: true } }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, mt: '70px' },
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
          mt: '75px',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
          >
            {generateBreadcrumbs()}
          </Breadcrumbs> */}
        {renderMainContent()}
      </Box>
    </Box>
  );
}

EmployeeProfile.propTypes = {
  window: PropTypes.func,
};

export default EmployeeProfile;
