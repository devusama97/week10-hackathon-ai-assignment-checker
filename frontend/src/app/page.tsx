'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardActions, Chip, Box, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import Navbar from '@/components/Navbar';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import Link from 'next/link';
import api from '@/lib/api';

export default function Home() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    setLoading(true);
    api.get('/assignments')
      .then(res => setAssignments(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDeleteClick = (id: string) => {
    setAssignmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assignmentToDelete) return;
    try {
      await api.delete(`/assignments/${assignmentToDelete}`);
      fetchAssignments();
      setDeleteDialogOpen(false);
      setAssignmentToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete assignment');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAssignmentToDelete(null);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/assignments/${id}/status`, { status: newStatus });
      fetchAssignments();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: { xs: 3, md: 6 }, mb: { xs: 4, md: 8 }, px: { xs: 2, sm: 3 } }}>
        {/* Header Section */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: { xs: 3, md: 5 },
        }}>
          <Box>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: '#0f172a',
                mb: 1,
              }}
            >
              Active Assignments
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              Manage and track your AI-powered assignment evaluations
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            href="/create"
            sx={{
              height: 'fit-content',
              px: { xs: 3, md: 4 },
              py: { xs: 1.5, md: 1.5 },
              fontSize: { xs: '0.9rem', md: '1rem' },
              whiteSpace: 'nowrap',
            }}
          >
            Create New
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress size={60} sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {assignments.map((assignment: any) => (
              <Grid key={assignment._id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden', // Ensure header corners are rounded
                  }}
                >
                  {/* Card Header with Solid Teal */}
                  <Box sx={{
                    bgcolor: 'primary.main',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5,
                          minWidth: '36px',
                          height: '36px',
                        }}
                      >
                        <DescriptionIcon sx={{ color: 'white', fontSize: '1.1rem' }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: 'white',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {assignment.title}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(assignment._id)}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                    {/* Instructions Preview */}
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2.5,
                        color: 'text.secondary',
                        height: '3.6em',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        fontSize: { xs: '0.85rem', md: '0.875rem' },
                        lineHeight: 1.5,
                      }}
                    >
                      {assignment.instructions}
                    </Typography>

                    {/* Status Chips */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={assignment.markingMode.toUpperCase()}
                        size="small"
                        sx={{
                          background: assignment.markingMode === 'strict'
                            ? 'rgba(239, 68, 68, 0.08)'
                            : 'rgba(16, 185, 129, 0.08)',
                          color: assignment.markingMode === 'strict' ? 'error.main' : 'success.main',
                          borderColor: assignment.markingMode === 'strict' ? 'error.light' : 'success.light',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: '24px',
                        }}
                        variant="outlined"
                      />
                      <Chip
                        label={assignment.status === 'inactive' ? 'Deactivated' : 'Active'}
                        size="small"
                        icon={assignment.status === 'inactive' ? <ToggleOffIcon style={{ fontSize: 16 }} /> : <CheckCircleIcon style={{ fontSize: 16 }} />}
                        sx={{
                          background: assignment.status === 'inactive'
                            ? 'rgba(100, 116, 139, 0.08)'
                            : 'rgba(13, 148, 136, 0.08)',
                          color: assignment.status === 'inactive' ? 'text.secondary' : 'primary.main',
                          borderColor: assignment.status === 'inactive' ? 'text.secondary' : 'primary.light',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: '24px',
                        }}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>

                  {/* Action Buttons */}
                  <CardActions sx={{
                    p: { xs: 2.5, md: 3 },
                    pt: 0,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    '& .MuiButton-root': {
                      ml: '0 !important', // Remove default left margin
                    }
                  }}>
                    <Button
                      size="small"
                      component={Link}
                      href={`/assignment/${assignment._id}`}
                      variant="outlined"
                      sx={{
                        flex: { xs: '1 1 100%', sm: '1 1 auto' },
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        py: 1,
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      component={Link}
                      href={`/assignment/${assignment._id}/upload`}
                      variant="outlined"
                      sx={{
                        flex: { xs: '1 1 100%', sm: '1 1 auto' },
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        py: 1,
                      }}
                    >
                      Upload
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={assignment.status === 'inactive' ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      onClick={() => handleToggleStatus(assignment._id, assignment.status || 'active')}
                      sx={{
                        flex: { xs: '1 1 100%', sm: '1 1 auto' },
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        py: 1,
                        borderColor: assignment.status === 'inactive' ? 'success.main' : 'warning.main',
                        color: assignment.status === 'inactive' ? 'success.main' : 'warning.main',
                        '&:hover': {
                          borderColor: assignment.status === 'inactive' ? 'success.light' : 'warning.light',
                          background: assignment.status === 'inactive'
                            ? 'rgba(16, 185, 129, 0.05)'
                            : 'rgba(245, 158, 11, 0.05)',
                        }
                      }}
                    >
                      {assignment.status === 'inactive' ? 'Activate' : 'Deactivate'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}

            {/* Empty State */}
            {assignments.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    py: { xs: 8, md: 12 },
                    px: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 80, md: 100 },
                      height: { xs: 80, md: 100 },
                      borderRadius: '50%',
                      background: '#0d9488',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 3,
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: { xs: '2.5rem', md: '3rem' }, color: 'white' }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 1,
                      fontWeight: 700,
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                    }}
                  >
                    No Assignments Yet
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      mb: 3,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                    }}
                  >
                    Start by creating your first assignment to begin AI-powered evaluations
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={Link}
                    href="/create"
                    size="large"
                  >
                    Create Your First Assignment
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ color: '#0f172a', fontWeight: 700 }}>
          Delete Assignment?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#475569' }}>
            Are you sure you want to delete this assignment? This action will also delete all student submissions and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{ color: '#475569' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              background: '#ef4444',
              '&:hover': { background: '#dc2626' }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
