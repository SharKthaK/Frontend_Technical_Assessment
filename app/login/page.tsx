'use client';

import { signIn } from 'next-auth/react';
import { useState, FormEvent, Suspense } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon, Person, Lock } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid username or password');
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #00c853 100%)',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 200, 83, 0.8))',
              backdropFilter: 'blur(10px)',
              py: 4,
              textAlign: 'center',
            }}
          >
            <LoginIcon sx={{ fontSize: 56, color: 'white', mb: 1 }} />
            <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.9), mt: 1 }}>
              Sign in to access your dashboard
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              <TextField
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                autoFocus
                disabled={loading}
                placeholder="emilys"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#00c853' }} />
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
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#00c853',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: 1,
                  },
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                disabled={loading}
                placeholder="emilyspass"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#00c853' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
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
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#00c853',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: 1,
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ 
                  mt: 1,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #00c853, #00e676)',
                  color: '#000',
                  boxShadow: '0 4px 14px rgba(0, 200, 83, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00e676, #00c853)',
                    boxShadow: '0 6px 20px rgba(0, 200, 83, 0.6)',
                  },
                  '&:disabled': {
                    background: 'rgba(0, 200, 83, 0.3)',
                    color: 'rgba(0, 0, 0, 0.5)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 3,
                borderRadius: 2,
                background: alpha(theme.palette.info.main, 0.05),
                borderColor: alpha(theme.palette.info.main, 0.2),
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                <strong>Demo Credentials:</strong>
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                Username: <strong>emilys</strong>
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                Password: <strong>emilyspass</strong>
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    }>
      <LoginForm />
    </Suspense>
  );
}
