'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Login,
  Dashboard,
  People,
  Inventory,
  CheckCircle,
} from '@mui/icons-material';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #000000, #1a1a1a, #00c853)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #00c853 100%)',
        py: { xs: 6, md: 8 },
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', color: 'white', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography 
            variant="h5" 
            paragraph
            sx={{
              fontWeight: 400,
              opacity: 0.95,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            Modern, responsive admin panel built with Next.js, Material-UI, and Zustand
          </Typography>

          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/login"
            startIcon={<Login />}
            sx={{ 
              mt: 3,
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #00c853, #00e676)',
              color: '#000',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(0, 200, 83, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00e676, #00c853)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 200, 83, 0.6)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Get Started
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card 
              elevation={0}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  bgcolor: 'rgba(0, 200, 83, 0.2)',
                  boxShadow: '0 12px 40px rgba(0, 200, 83, 0.4)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Dashboard sx={{ fontSize: 56, color: '#00c853', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'white' }}>
                  Modern Dashboard
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Clean and intuitive admin interface with real-time data visualization
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card 
              elevation={0}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  bgcolor: 'rgba(0, 200, 83, 0.2)',
                  boxShadow: '0 12px 40px rgba(0, 200, 83, 0.4)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <People sx={{ fontSize: 56, color: '#00c853', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'white' }}>
                  User Management
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Browse, search, and manage users with advanced pagination
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card 
              elevation={0}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  bgcolor: 'rgba(0, 200, 83, 0.2)',
                  boxShadow: '0 12px 40px rgba(0, 200, 83, 0.4)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Inventory sx={{ fontSize: 56, color: '#00c853', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'white' }}>
                  Product Catalog
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Complete product management with filters and categories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper 
          elevation={0}
          sx={{ 
            mt: 6, 
            p: { xs: 3, md: 4 },
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            borderRadius: 3,
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 3, color: 'white' }}>
            Key Features
          </Typography>
          <Grid container spacing={2}>
            {[
              'NextAuth authentication with DummyJSON API',
              'Zustand state management with smart caching',
              'Material-UI responsive design',
              'Advanced pagination, search, and filters',
              'Performance optimizations with React hooks',
              'Protected routes and middleware',
              'Full TypeScript type safety',
            ].map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={index}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <CheckCircle sx={{ color: '#00c853', fontSize: 20, mt: 0.3 }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{feature}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
           