'use client';
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem, Avatar, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navItems = isAuthenticated ? [
        { label: 'Dashboard', href: '/' },
        { label: 'New Assignment', href: '/create' },
    ] : [];

    const drawer = (
        <Box sx={{
            width: 280,
            height: '100%',
            background: '#ffffff',
            p: 2,
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, mb: 2 }}>
                <IconButton onClick={handleDrawerToggle} sx={{ color: '#0f172a' }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            component={Link}
                            href={item.href}
                            onClick={handleDrawerToggle}
                            sx={{
                                borderRadius: '8px',
                                '&:hover': {
                                    background: '#0d9488',
                                }
                            }}
                        >
                            <ListItemText
                                primary={item.label}
                                sx={{
                                    color: '#0f172a',
                                    '& .MuiTypography-root': {
                                        fontWeight: 600,
                                    }
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
                {!isAuthenticated && (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} href="/login" onClick={handleDrawerToggle}>
                                <ListItemText primary="Login" sx={{ color: '#0f172a' }} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} href="/signup" onClick={handleDrawerToggle}>
                                <ListItemText primary="Sign Up" sx={{ color: '#0f172a' }} />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" elevation={0}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ minHeight: { xs: '64px', md: '72px' } }}>
                        {/* Mobile Menu Icon */}
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { md: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        {/* Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 'auto', md: 4 } }}>
                            <Box
                                sx={{
                                    background: '#f97316',
                                    borderRadius: '8px',
                                    p: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 1.5,
                                }}
                            >
                                <SchoolIcon sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }} />
                            </Box>
                            <Typography
                                variant="h6"
                                noWrap
                                component={Link}
                                href="/"
                                sx={{
                                    display: 'flex',
                                    fontWeight: 700,
                                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                                    color: 'white',
                                    textDecoration: 'none',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                AI CHECKER
                            </Typography>
                        </Box>

                        {/* Desktop Navigation */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    component={Link}
                                    href={item.href}
                                    sx={{
                                        color: 'white',
                                        fontWeight: 600,
                                        px: 2,
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Auth Section */}
                        <Box sx={{ flexGrow: 0 }}>
                            {isAuthenticated ? (
                                <>
                                    <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                                        <Avatar
                                            sx={{
                                                background: '#f97316',
                                                color: 'white',
                                                width: 40,
                                                height: 40,
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </Avatar>
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                        PaperProps={{
                                            sx: {
                                                mt: 1.5,
                                                minWidth: 200,
                                                background: '#ffffff',
                                                border: '2px solid #e2e8f0',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                            },
                                        }}
                                    >
                                        <MenuItem disabled sx={{ opacity: 1, color: '#475569' }}>
                                            {user?.name}
                                        </MenuItem>

                                        <MenuItem
                                            onClick={handleLogout}
                                            sx={{
                                                color: '#ef4444',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                }
                                            }}
                                        >
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                                    <Button
                                        component={Link}
                                        href="/login"
                                        variant="outlined"
                                        sx={{
                                            color: 'white',
                                            borderColor: 'white',
                                            '&:hover': {
                                                borderColor: 'white',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                            },
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        component={Link}
                                        href="/signup"
                                        variant="contained"
                                        sx={{
                                            background: '#f97316',
                                            '&:hover': {
                                                background: '#ea580c',
                                            },
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 250,
                        background: 'transparent',
                        border: 'none',
                    },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;

