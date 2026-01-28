'use client';

import { memo, useEffect} from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

/**
 * Navigation component with MUI
 * Optimized with React.memo to prevent unnecessary re-renders
 */
const Navigation = memo(() => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Users', path: '/users', icon: <PeopleIcon /> },
    { label: 'Products', path: '/products', icon: <InventoryIcon /> },
  ];

  const drawer = (
    <Box 
      onClick={() => setMobileOpen(false)} 
      sx={{ 
        textAlign: 'center',
        height: '100%',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #00c853 100%)',
        color: 'white',
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          my: 2,
          fontWeight: 700,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <DashboardIcon sx={{ color: '#00c853' }} />
        Admin Portal
      </Typography>
      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              href={item.path}
              selected={pathname === item.path}
              sx={{
                borderRadius: 2,
                background: pathname === item.path 
                  ? 'rgba(0, 200, 83, 0.3)' 
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: pathname === item.path 
                  ? '1px solid rgba(0, 200, 83, 0.5)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(0, 200, 83, 0.2)',
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                },
                '&.Mui-selected': {
                  background: 'rgba(0, 200, 83, 0.3)',
                  border: '1px solid rgba(0, 200, 83, 0.5)',
                  '&:hover': {
                    background: 'rgba(0, 200, 83, 0.4)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: '#00c853', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  sx: { fontWeight: 600, color: 'white' }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          zIndex: 1100,
          backdropFilter: 'blur(20px)',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(0, 200, 83, 0.95))',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <DashboardIcon sx={{ mr: 1.5, fontSize: 28 }} />
              <Typography
                variant="h6"
                component="div"
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                }}
              >
                Admin Portal
              </Typography>
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    color="inherit"
                    component={Link}
                    href={item.path}
                    startIcon={item.icon}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      bgcolor: pathname === item.path ? 'rgba(0, 200, 83, 0.3)' : 'transparent',
                      backdropFilter: pathname === item.path ? 'blur(10px)' : 'none',
                      border: pathname === item.path ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                      '&:hover': {
                        bgcolor: 'rgba(0, 200, 83, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {session && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={session.user?.name || 'User'}
                    src={(session.user as any)?.image}
                    sx={{
                      border: '2px solid white',
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                    }}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1.5,
                        background: 'rgba(26, 26, 26, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                        borderRadius: 2,
                        minWidth: 200,
                      },
                    },
                  }}
                >
                  <MenuItem disabled sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    '&.Mui-disabled': {
                      opacity: 1,
                    },
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {session.user?.name}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0, 200, 83, 0.2)',
                    },
                  }}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" sx={{ color: '#00c853' }} />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #00c853 100%)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
