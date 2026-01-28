'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  ArrowBack,
  Email,
  Phone,
  Business,
  LocationOn,
  Cake,
  School,
} from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import { useUsersStore } from '@/store/usersStore';
import { User } from '@/lib/types';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchUserById } = useUsersStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'instant' });

    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = parseInt(params.id as string);
        const userData = await fetchUserById(userId);
        setUser(userData);
      } catch (err) {
        const errorMessage = err instanceof TypeError && err.message.includes('fetch')
          ? 'Failed to connect. Please check your internet connection.'
          : err instanceof Error && err.message === 'User not found'
          ? 'User not found'
          : 'Failed to load user details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [params.id, fetchUserById]);

  if (error) {
    return (
      <>
        <Navigation />
        <Box sx={{ 
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #00c853 100%)',
          minHeight: '100vh',
          py: 4,
        }}>
          <Container maxWidth="lg">
            <Alert 
              severity="error"
              sx={{
                borderRadius: 3,
                background: 'rgba(255, 100, 100, 0.2)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 100, 100, 0.4)',
                color: 'white',
                fontSize: '1rem',
                '& .MuiAlert-icon': {
                  color: '#ff6b6b',
                },
              }}
            >
              {error || 'User not found'}
            </Alert>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.push('/users')}
              sx={{ 
                mt: 2,
                background: 'linear-gradient(135deg, #00c853, #00e676)',
                color: '#000',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #00e676, #00c853)',
                },
              }}
            >
              Back to Users
            </Button>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Box sx={{ 
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #00c853 100%)',
        minHeight: '100vh',
        py: 4,
      }}>
        <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/users')}
          sx={{ 
            mb: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              background: 'rgba(0, 200, 83, 0.2)',
              borderColor: '#00c853',
            },
          }}
        >
          Back to Users
        </Button>

        {loading || !user ? (
          <Paper sx={{ 
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Skeleton variant="circular" width={120} height={120} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                <Skeleton variant="text" width="40%" height={30} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" height={200} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
          </Paper>
        ) : (
        <Paper sx={{ 
          p: 4,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Box sx={{ position: 'relative', width: 120, height: 120 }}>
              {!imageLoaded && !imageError && (
                <Skeleton 
                  variant="circular" 
                  width={120} 
                  height={120} 
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }} 
                />
              )}
              <Avatar
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                sx={{ 
                  width: 120, 
                  height: 120,
                  opacity: imageLoaded || imageError ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  fontSize: '2.5rem',
                }}
              >
                {user.firstName[0]}{user.lastName[0]}
              </Avatar>
              <img
                src={user.image}
                alt=""
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{ display: 'none' }}
              />
            </Box>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 700 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                @{user.username}
              </Typography>
              <Chip
                label={user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                size="small"
                sx={{
                  background: user.gender === 'male' ? 'rgba(33, 150, 243, 0.3)' : 'rgba(233, 30, 99, 0.3)',
                  color: 'white',
                  border: user.gender === 'male' ? '1px solid rgba(33, 150, 243, 0.5)' : '1px solid rgba(233, 30, 99, 0.5)',
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card 
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 700 }}>
                    Contact Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Email sx={{ color: '#00c853' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>{user.email}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Phone sx={{ color: '#00c853' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Phone
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>{user.phone}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Cake sx={{ color: '#00c853' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Birth Date
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {new Date(user.birthDate).toLocaleDateString()} (Age: {user.age})
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card 
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 700 }}>
                    Professional Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Business sx={{ color: '#00c853' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Company
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>{user.company.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {user.company.title} - {user.company.department}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <School sx={{ color: '#00c853' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        University
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>{user.university}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card 
                elevation={0}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 700 }}>
                    Address
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <LocationOn sx={{ color: '#00c853' }} />
                    <Box>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {user.address.address}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {user.address.city}, {user.address.state} {user.address.postalCode}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {user.address.country}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
        )}
        </Container>
      </Box>
    </>
  );
}
