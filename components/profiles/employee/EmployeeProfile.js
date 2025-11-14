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
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import { useState } from 'react';
import ProfileForm from './ProfileForm';
import ResumeUpload from './ResumeUpload';
import Dashboard from './Dashboard';
import { useUser } from "@clerk/clerk-react";


function EmployeeProfile(props) {
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
    { text: 'User Dashboard', icon: <DashboardIcon />, value: 'Dashboard' },
    { text: 'Profile', icon: <AccountCircleIcon />, value: 'Profile' },
    { text: 'Resume', icon: <DescriptionIcon />, value: 'Resume' },
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
              <ListItemIcon>{item.icon}</ListItemIcon>
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
      default:
        return <Dashboard />;
    }
  };

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
            {selectedSection === 'Dashboard' ? 'User Dashboard' : selectedSection}
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
        {renderMainContent()}
      </Box>
    </Box>
  );
}

EmployeeProfile.propTypes = {
  window: PropTypes.func,
};

export default EmployeeProfile;
