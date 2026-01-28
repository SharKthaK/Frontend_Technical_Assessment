'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Skeleton,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Dashboard as DashboardIcon,
  People,
  Inventory,
} from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          fetch('https://dummyjson.com/users?limit=0'),
          fetch('https://dummyjson.com/products?limit=0'),
        ]);
        
        const usersData = await usersRes.json();
        const productsData = await productsRes.json();
        
        setStats({
          users: usersData.total || 0,
          products: productsData.total || 0,
          loading: false,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats({ users: 0, products: 0, loading: false });
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.users.toString(),
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Total Products',
      value: stats.products.toString(),
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: '#dc004e',
    },
    {
      title: 'Dashboard',
      value: 'Active',
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
  ];

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
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
              Welcome back, {session?.user?.name}! 👋
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              Here&apos;s your dashboard overview
            </Typography>
          </Paper>

          <Grid container spacing={3}>
            {statsCards.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      bgcolor: 'rgba(0, 200, 83, 0.2)',
                      boxShadow: '0 12px 40px rgba(0, 200, 83, 0.4)',
                      borderColor: '#00c853',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
                          {stat.title}
                        </Typography>
                        {stats.loading ? (
                          <Skeleton width={80} height={48} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                        ) : (
                          <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: '#00c853' }}>
                          {stat.value}
                        </Typography>
                      )}
                    </Box>
                      <Box
                        sx={{
                          background: 'linear-gradient(135deg, rgba(0, 200, 83, 0.2), rgba(0, 200, 83, 0.1))',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 3,
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box sx={{ color: '#00c853' }}>
                          {stat.icon}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper 
            elevation={0}
            sx={{ 
              mt: 4, 
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
              Quick Actions
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Navigate to Users or Products to manage your data. Use the search and filter
              features to find specific items quickly.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<People />}
                href="/users"
                component={Link}
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none', 
                  px: 3,
                  background: 'linear-gradient(135deg, #00c853, #00e676)',
                  color: '#000',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00e676, #00c853)',
                  },
                }}
              >
                Manage Users
              </Button>
              <Button
                variant="outlined"
                startIcon={<Inventory />}
                href="/products"
                component={Link}
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none', 
                  px: 3,
                  borderColor: '#00c853',
                  color: '#00c853',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#00e676',
                    bgcolor: 'rgba(0, 200, 83, 0.1)',
                  },
                }}
              >
                View Products
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
