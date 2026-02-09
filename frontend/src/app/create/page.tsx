'use client';
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CreateAssignment() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        instructions: '',
        markingMode: 'loose',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/assignments', formData);
            router.push('/');
        } catch (err) {
            console.error(err);
            alert('Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: { xs: 3, md: 6 }, mb: { xs: 4, md: 8 }, px: { xs: 2, sm: 3 } }}>
                {/* Header */}
                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            color: '#0f172a',
                            mb: 1,
                        }}
                    >
                        Setup New Assignment
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            fontSize: { xs: '0.9rem', md: '1rem' },
                        }}
                    >
                        Define the goal and evaluation rules for your students
                    </Typography>
                </Box>

                <Paper elevation={0} sx={{ overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                    {/* Form Header */}
                    <Box sx={{ bgcolor: 'primary.main', p: 3, color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                p: 1,
                                borderRadius: '8px',
                                display: 'flex'
                            }}>
                                <AddIcon />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'white' }}>
                                    Assignment Configurations
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9, color: 'white' }}>
                                    Fill in the details below to setup your evaluation criteria
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ p: { xs: 3, md: 5 } }}>
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {/* Assignment Title */}
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>
                                        General Information
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Assignment Title"
                                        placeholder="e.g. Mental Health Essay"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </Box>

                                {/* Instructions */}
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>
                                        Evaluation Context
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Instructions & Evaluation Criteria"
                                        multiline
                                        rows={8}
                                        required
                                        placeholder="Write an essay on mental health, 500 words. Must include Intro, Body, Conclusion."
                                        value={formData.instructions}
                                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                    />
                                </Box>

                                {/* Marking Mode */}
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>
                                        Grading Strategy
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Marking Mode</InputLabel>
                                        <Select
                                            value={formData.markingMode}
                                            label="Marking Mode"
                                            onChange={(e) => setFormData({ ...formData, markingMode: e.target.value })}
                                        >
                                            <MenuItem value="loose">
                                                <Box sx={{ py: 0.5 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        Loose Marking
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        Rewards effort and creativity
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="strict">
                                                <Box sx={{ py: 0.5 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        Strict Marking
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        Focused on instruction adherence
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Divider />

                                {/* Action Buttons */}
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                                    justifyContent: 'flex-end',
                                    gap: 2,
                                }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => router.back()}
                                        startIcon={<ArrowBackIcon />}
                                        sx={{ px: 4, height: '48px' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        disabled={loading}
                                        startIcon={<AddIcon />}
                                        sx={{ px: 4, height: '48px' }}
                                    >
                                        {loading ? 'Creating...' : 'Create Assignment'}
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

