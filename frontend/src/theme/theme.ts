'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0d9488', // Solid Teal
            light: '#14b8a6',
            dark: '#0f766e',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f97316', // Solid Orange accent
            light: '#fb923c',
            dark: '#ea580c',
            contrastText: '#ffffff',
        },
        success: {
            main: '#22c55e',
            light: '#4ade80',
            dark: '#16a34a',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        background: {
            default: '#ffffff', // Solid white
            paper: '#f8fafc', // Very light slate
        },
        text: {
            primary: '#0f172a', // Dark slate
            secondary: '#475569', // Medium slate
        },
    },
    typography: {
        fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '3rem',
            letterSpacing: '-0.02em',
            color: '#0f172a',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '-0.01em',
            color: '#0f172a',
        },
        h3: {
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-0.01em',
            color: '#0f172a',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.75rem',
            color: '#0f172a',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.5rem',
            color: '#0f172a',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.25rem',
            color: '#0f172a',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.01em',
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: '#ffffff', // Solid white background
                    minHeight: '100vh',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '12px 28px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)',
                    },
                },
                contained: {
                    background: '#0d9488', // Solid teal
                    '&:hover': {
                        background: '#0f766e', // Darker teal
                    },
                },
                outlined: {
                    borderWidth: '2px',
                    borderColor: '#0d9488',
                    color: '#0d9488',
                    '&:hover': {
                        borderWidth: '2px',
                        borderColor: '#14b8a6',
                        background: 'rgba(13, 148, 136, 0.05)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: '#ffffff',
                    border: '2px solid #e2e8f0', // Light border
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        borderColor: '#0d9488',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 20px rgba(13, 148, 136, 0.1)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: '#0d9488', // Solid teal navbar
                    boxShadow: 'none',
                    borderBottom: '3px solid #0f766e',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        background: '#ffffff',
                        transition: 'all 0.2s ease',
                        '& fieldset': {
                            borderColor: '#cbd5e1',
                            borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                            borderColor: '#94a3b8',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#0d9488',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: '6px',
                },
                outlined: {
                    borderWidth: '2px',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #e2e8f0',
                },
                head: {
                    fontWeight: 700,
                    background: '#0d9488', // Solid teal header
                    color: '#ffffff',
                    borderBottom: '2px solid #0f766e',
                },
            },
        },
    },
});

export default theme;
