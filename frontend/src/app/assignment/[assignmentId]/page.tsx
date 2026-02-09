'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Navbar from '@/components/Navbar';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function AssignmentDetail() {
    const { assignmentId } = useParams();
    const router = useRouter();
    const [assignment, setAssignment] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [remarksDialogOpen, setRemarksDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [aRes, sRes] = await Promise.all([
                    api.get(`/assignments/${assignmentId}`),
                    api.get(`/submissions/assignment/${assignmentId}`)
                ]);
                setAssignment(aRes.data);
                setSubmissions(sRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [assignmentId]);

    const handleExport = () => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        window.open(`${baseUrl}/submissions/export/${assignmentId}`, '_blank');
    };

    const handleDeleteSubmission = async (id: string) => {
        if (!confirm('Are you sure you want to delete this result?')) return;
        try {
            await api.delete(`/submissions/${id}`);
            setSubmissions(submissions.filter(s => s._id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete submission');
        }
    };

    const handleClearAll = async () => {
        if (!confirm('Are you sure you want to CLEAR ALL results for this assignment? This cannot be undone.')) return;
        try {
            await api.delete(`/submissions/assignment/${assignmentId}`);
            setSubmissions([]);
        } catch (err) {
            console.error(err);
            alert('Failed to clear results');
        }
    };

    const handleOpenRemarks = (student: any) => {
        setSelectedStudent(student);
        setRemarksDialogOpen(true);
    };

    if (loading) return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>Loading...</Typography>
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Navbar />
            <Container maxWidth="xl" sx={{ mt: { xs: 3, md: 4 }, mb: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
                {/* Back Button */}
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.back()}
                    sx={{ mb: 3 }}
                >
                    Back to Dashboard
                </Button>

                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0',
                    }}
                >
                    {/* Header bar */}
                    <Box sx={{ bgcolor: 'secondary.main', p: 3, color: 'white' }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    p: 1.5,
                                    borderRadius: '8px',
                                    display: 'flex'
                                }}>
                                    <AssignmentIcon sx={{ fontSize: '1.75rem' }} />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: { xs: '1.5rem', md: '2rem' },
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {assignment?.title}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9, letterSpacing: 0.5 }}>
                                        ASSIGNMENT OVERVIEW & CRITERIA
                                    </Typography>
                                </Box>
                            </Box>
                            <Chip
                                label={assignment?.markingMode?.toUpperCase()}
                                sx={{
                                    fontWeight: 700,
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    px: 2,
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Content area */}
                    <Box sx={{ p: { xs: 3, md: 4 } }}>
                        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block' }}>
                            Instructions
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.primary',
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                lineHeight: 1.8,
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {assignment?.instructions}
                        </Typography>
                    </Box>
                </Paper>

                {/* Results Header */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                    mb: 3,
                }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '1.5rem', md: '1.75rem' },
                        }}
                    >
                        Evaluation Results ({submissions.length})
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<ClearAllIcon />}
                            onClick={handleClearAll}
                            disabled={submissions.length === 0}
                            size={isMobile ? 'small' : 'medium'}
                            sx={{
                                flex: { xs: 1, sm: 'none' },
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                textTransform: 'none',
                                px: 3
                            }}
                        >
                            Clear All
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<DownloadIcon />}
                            onClick={handleExport}
                            disabled={submissions.length === 0}
                            size={isMobile ? 'small' : 'medium'}
                            sx={{
                                flex: { xs: 1, sm: 'none' },
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                textTransform: 'none',
                                px: 3
                            }}
                        >
                            Export Excel
                        </Button>
                    </Box>
                </Box>

                {/* Results Table */}
                <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>Student Name</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>Roll Number</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>Score / 100</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: { xs: '0.8rem', md: '0.875rem' }, display: { xs: 'none', md: 'table-cell' } }}>Remarks</TableCell>
                                <TableCell sx={{ fontWeight: 700, width: 80 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {submissions.map((s) => (
                                <TableRow
                                    key={s._id}
                                    sx={{
                                        '&:hover': {
                                            background: 'rgba(168, 85, 247, 0.05)',
                                        }
                                    }}
                                >
                                    <TableCell sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>{s.studentName}</TableCell>
                                    <TableCell sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>{s.rollNumber}</TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: { xs: '1rem', md: '1.125rem' },
                                                color: s.score >= 50 ? 'success.main' : 'error.main'
                                            }}
                                        >
                                            {s.score}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={s.status?.toUpperCase()}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '0.7rem',
                                                background: s.status === 'completed'
                                                    ? 'rgba(16, 185, 129, 0.15)'
                                                    : 'rgba(245, 158, 11, 0.15)',
                                                color: s.status === 'completed' ? 'success.light' : 'warning.light',
                                                borderColor: s.status === 'completed' ? 'success.main' : 'warning.main',
                                            }}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 400, display: { xs: 'none', md: 'table-cell' } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography
                                                variant="body2"
                                                noWrap
                                                sx={{
                                                    flexGrow: 1,
                                                    fontSize: '0.875rem',
                                                    color: 'text.secondary',
                                                }}
                                            >
                                                {s.remarks}
                                            </Typography>
                                            <Tooltip title="View Full Remarks">
                                                <IconButton size="small" onClick={() => handleOpenRemarks(s)}>
                                                    <InfoIcon fontSize="small" color="primary" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenRemarks(s)}
                                                sx={{
                                                    display: { xs: 'flex', md: 'none' },
                                                    color: 'primary.main',
                                                }}
                                            >
                                                <InfoIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteSubmission(s._id)}
                                                sx={{
                                                    color: 'error.main',
                                                    '&:hover': {
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {submissions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                background: 'rgba(168, 85, 247, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto',
                                                mb: 2,
                                            }}
                                        >
                                            <AssignmentIcon sx={{ fontSize: '2.5rem', color: 'primary.main' }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                                            No Submissions Yet
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Upload student submissions to see evaluation results here
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog
                    open={remarksDialogOpen}
                    onClose={() => setRemarksDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: { borderRadius: 3, p: 1 }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 700, pb: 1, borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>
                        AI Evaluation Feedback
                    </DialogTitle>
                    <DialogContent sx={{ py: 3 }}>
                        <Box sx={{ mb: 2, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                                Student Name
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {selectedStudent?.studentName}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                                Detailed Remarks
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1, color: '#475569', lineHeight: 1.6 }}>
                                {selectedStudent?.remarks}
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => setRemarksDialogOpen(false)}
                            sx={{ borderRadius: 2, fontWeight: 700, py: 1.5 }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}
