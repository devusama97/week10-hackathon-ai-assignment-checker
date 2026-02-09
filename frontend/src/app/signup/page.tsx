'use client';
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert, Link as MuiLink, Snackbar } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successToast, setSuccessToast] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/signup', formData);
            setSuccessToast(true);
            // Wait a bit for the toast to be seen before redirecting
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#ffffff' }}>
            <Container maxWidth="sm">
                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ bgcolor: 'secondary.main', p: 1.5, borderRadius: '50%', mb: 2 }}>
                            <PersonAddOutlinedIcon sx={{ color: 'white', fontSize: 32 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Create Teacher Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Join the AI Assignment Checker platform
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            required
                            helperText="Minimum 6 characters"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mb: 2 }}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <MuiLink component={Link} href="/login" sx={{ fontWeight: 600 }}>
                                Login here
                            </MuiLink>
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            <Snackbar
                open={successToast}
                autoHideDuration={4000}
                onClose={() => setSuccessToast(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
                    Signup successful! Redirecting to login...
                </Alert>
            </Snackbar>
        </Box>
    );
}
