'use client';

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  Pagination,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  InputAdornment,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Skeleton,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import { useUsersStore } from '@/store/usersStore';
import { useRouter } from 'next/navigation';

/**
 * Memoized User Row Component
 * Prevents unnecessary re-renders when other rows update
 */
const UserRow = memo(({ user }: { user: any }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <TableRow
      hover
      onClick={() => router.push(`/users/${user.id}`)}
      sx={{
        cursor: 'pointer',
        '&:hover': { 
          bgcolor: 'rgba(0, 200, 83, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {imageLoading && (
            <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
          )}
          <Avatar 
            src={user.image} 
            alt={`${user.firstName} ${user.lastName}`}
            imgProps={{ 
              loading: 'lazy',
              onLoad: () => setImageLoading(false),
            }}
            sx={{ display: imageLoading ? 'none' : 'flex' }}
          />
          <Box>
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
              {user.firstName} {user.lastName}
            </Typography>
            {!isMobile && (
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                @{user.username}
              </Typography>
            )}
          </Box>
        </Box>
      </TableCell>
      {!isMobile && (
        <>
          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{user.email}</TableCell>
          <TableCell>
            <Chip
              label={user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
              size="small"
              sx={{
                background: user.gender === 'male' ? 'rgba(33, 150, 243, 0.3)' : 'rgba(233, 30, 99, 0.3)',
                color: 'white',
                border: user.gender === 'male' ? '1px solid rgba(33, 150, 243, 0.5)' : '1px solid rgba(233, 30, 99, 0.5)',
              }}
            />
          </TableCell>
          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{user.phone}</TableCell>
          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{user.company.name}</TableCell>
        </>
      )}
    </TableRow>
  );
});

UserRow.displayName = 'UserRow';

export default function UsersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    users,
    total,
    currentPage,
    limit,
    loading,
    error,
    searchQuery,
    fetchUsers,
    setSearchQuery,
    setCurrentPage,
  } = useUsersStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Memoized page count calculation
  const pageCount = useMemo(() => Math.ceil(total / limit), [total, limit]);

  // Load users on mount and when page changes
  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
  }, [currentPage, searchQuery, fetchUsers]);

  // Debounced search with useCallback
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    
    const timeoutId = setTimeout(() => {
      setSearchQuery(value);
      setCurrentPage(1);
      fetchUsers(1, value);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [setSearchQuery, setCurrentPage, fetchUsers]);

  // Memoized page change handler
  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setCurrentPage]
  );

  return (
    <>
      <Navigation />
      <Box sx={{ 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #00c853 100%)',
        minHeight: '100vh',
        pb: 4 
      }}>
        <Container maxWidth="xl" sx={{ pt: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 200, 83, 0.8))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              color: 'white',
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Users Management
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Browse and search through {total} users
            </Typography>
          </Paper>

          <Card 
            elevation={0}
            sx={{ 
              mb: 3,
              borderRadius: 3,
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: 'none',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <TextField
                fullWidth
                placeholder="Search users by name, email, or username..."
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#00c853' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 200, 83, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00c853',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: 1,
                  },
                }}
              />
            </CardContent>
          </Card>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2, 
                borderRadius: 2,
                background: 'rgba(255, 100, 100, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 100, 100, 0.4)',
                color: 'white',
                fontSize: '1rem',
                '& .MuiAlert-icon': {
                  color: '#ff6b6b',
                },
              }}
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={50} sx={{ color: '#00c853' }} />
            </Box>
          ) : (
            <>
              <TableContainer 
                component={Paper}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: 'none',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      bgcolor: 'rgba(0, 200, 83, 0.2)',
                      backdropFilter: 'blur(10px)',
                    }}>
                      <TableCell sx={{ fontWeight: 700, color: 'white' }}>Name</TableCell>
                      {!isMobile && (
                        <>
                          <TableCell sx={{ fontWeight: 700, color: 'white' }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: 'white' }}>Gender</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: 'white' }}>Phone</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: 'white' }}>Company</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 1 : 5} align="center">
                          <Typography variant="body2" sx={{ py: 4, color: 'white', fontSize: '1rem' }}>
                            No users found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => <UserRow key={user.id} user={user} />)
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                    size={isMobile ? 'small' : 'large'}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          bgcolor: 'rgba(0, 200, 83, 0.2)',
                          borderColor: '#00c853',
                        },
                        '&.Mui-selected': {
                          bgcolor: '#00c853',
                          color: '#000',
                          fontWeight: 700,
                          '&:hover': {
                            bgcolor: '#00e676',
                          },
                        },
                      },
                    }}
                  />
                </Box>
              )}

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
                Showing {users.length} of {total} users
              </Typography>
            </>
          )}
        </Container>
      </Box>
    </>
  );
}
