'use client';
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert, Link as MuiLink } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', formData);
            // Use the context login function to update global state immediately
            login(response.data.access_token, response.data.user);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#ffffff' }}>
            <Container maxWidth="sm">
                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ bgcolor: 'primary.main', p: 1.5, borderRadius: '50%', mb: 2 }}>
                            <LockOutlinedIcon sx={{ color: 'white', fontSize: 32 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Teacher Login
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Access your AI Assignment Checker
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
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
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2">
                            Don't have an account?{' '}
                            <MuiLink component={Link} href="/signup" sx={{ fontWeight: 600 }}>
                                Sign up here
                            </MuiLink>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
