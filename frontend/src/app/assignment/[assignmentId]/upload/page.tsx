'use client';
import React, { useState, useCallback } from 'react';
import { Container, Typography, Box, Paper, Button, List, ListItem, ListItemIcon, ListItemText, Divider, LinearProgress, Alert } from '@mui/material';
import Navbar from '@/components/Navbar';
import { useDropzone } from 'react-dropzone';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function UploadSubmissions() {
    const { assignmentId } = useParams();
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
    });

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));

        try {
            await api.post(`/submissions/upload/${assignmentId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccess(true);
            setTimeout(() => router.push(`/assignment/${assignmentId}`), 2000);
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: { xs: 4, md: 8 }, mb: 4 }}>
                <Paper elevation={0} sx={{ overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                    {/* Header */}
                    <Box sx={{ bgcolor: 'primary.main', p: 3, color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                p: 1,
                                borderRadius: '8px',
                                display: 'flex'
                            }}>
                                <CloudUploadIcon />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'white' }}>
                                    Upload Student Submissions
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9, color: 'white' }}>
                                    Batch process multiple PDF assignments for AI evaluation
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ p: { xs: 3, md: 5 } }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Drag and drop multiple PDFs here. Each PDF should ideally be named <strong>"StudentName_RollNo.pdf"</strong> for better identification.
                        </Typography>

                        <Box
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed',
                                borderColor: isDragActive ? 'primary.main' : '#cbd5e1',
                                borderRadius: 3,
                                p: { xs: 4, md: 8 },
                                textAlign: 'center',
                                bgcolor: isDragActive ? 'rgba(13, 148, 136, 0.05)' : '#f8fafc',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                mb: 4,
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'rgba(13, 148, 136, 0.02)',
                                }
                            }}
                        >
                            <input {...getInputProps()} />
                            <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2, opacity: 0.8 }} />
                            {isDragActive ? (
                                <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>Drop the PDFs here...</Typography>
                            ) : (
                                <Box>
                                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                                        Drag & drop student PDFs here
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        or click to browse from your computer
                                    </Typography>
                                </Box>
                            )}
                            <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary', fontWeight: 500 }}>
                                Supported format: PDF only
                            </Typography>
                        </Box>

                        {files.length > 0 && (
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                        Selected Files ({files.length})
                                    </Typography>
                                    <Button size="small" color="error" onClick={() => setFiles([])} sx={{ fontWeight: 600 }}>
                                        Remove All
                                    </Button>
                                </Box>
                                <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #e2e8f0' }}>
                                    <List disablePadding>
                                        {files.map((file, index) => (
                                            <React.Fragment key={index}>
                                                <ListItem sx={{ py: 1.5 }}>
                                                    <ListItemIcon>
                                                        <PictureAsPdfIcon sx={{ color: '#ef4444' }} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={file.name}
                                                        secondary={`${(file.size / 1024).toFixed(1)} KB`}
                                                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                                                    />
                                                </ListItem>
                                                {index < files.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Paper>
                            </Box>
                        )}

                        {uploading && (
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>AI Evaluating submissions...</Typography>
                                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>Processing</Typography>
                                </Box>
                                <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
                            </Box>
                        )}

                        {success && (
                            <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ mb: 4, fontWeight: 600 }}>
                                Batch processed successfully! Redirecting to results...
                            </Alert>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button
                                variant="outlined"
                                disabled={uploading}
                                onClick={() => router.back()}
                                sx={{
                                    px: 4,
                                    height: '48px',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleUpload}
                                disabled={files.length === 0 || uploading || success}
                                startIcon={<CloudUploadIcon />}
                                sx={{
                                    px: 4,
                                    height: '48px',
                                    whiteSpace: 'nowrap',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    background: files.length > 0 && !uploading ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' : undefined,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                                    }
                                }}
                            >
                                {uploading ? 'Processing Batch...' : 'Start AI Evaluation'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
