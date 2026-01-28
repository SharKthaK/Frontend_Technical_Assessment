'use client';

import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  SearchOff as SearchOffIcon,
} from '@mui/icons-material';

export default function NotFound() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #00c853 100%)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 6 },
            textAlign: 'center',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
        >
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SearchOffIcon
              sx={{
                fontSize: { xs: 80, sm: 120 },
                color: '#00c853',
                opacity: 0.9,
                filter: 'drop-shadow(0 4px 12px rgba(0, 200, 83, 0.4))',
              }}
            />
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', sm: '6rem' },
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00c853, #00e676)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem' },
              fontWeight: 600,
              color: 'white',
              mb: 2,
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              maxWidth: 500,
              mx: 'auto',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => router.push('/dashboard')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Go to Dashboard
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
