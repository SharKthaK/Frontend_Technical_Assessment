'use client';

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import {
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  Pagination,
  CircularProgress,
  Alert,
  Rating,
  Chip,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  useMediaQuery,
  useTheme,
  Skeleton,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import { useProductsStore } from '@/store/productsStore';
import Link from 'next/link';

/**
 * Memoized Product Card Component
 * Optimized to prevent re-renders when other products update
 */
const ProductCard = memo(({ product }: { product: any }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Card
      component={Link}
      href={`/products/${product.id}`}
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        borderRadius: 3,
        background: 'rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          bgcolor: 'rgba(0, 200, 83, 0.2)',
          boxShadow: '0 8px 24px rgba(0, 200, 83, 0.3)',
          borderColor: '#00c853',
        },
      }}
    >
      <Box sx={{ position: 'relative', height: 200, flexShrink: 0 }}>
        {imageLoading && (
          <Skeleton 
            variant="rectangular" 
            width="100%"
            height={200}
            sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
          />
        )}
        <CardMedia
          component="img"
          height="200"
          image={product.thumbnail}
          alt={product.title}
          loading="lazy"
          sx={{ 
            objectFit: 'cover',
            opacity: imageLoading ? 0 : 1,
            transition: 'opacity 0.3s',
            width: '100%',
            height: '100%',
          }}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="div" noWrap sx={{ color: 'white' }}>
          {product.title}
        </Typography>
        
        <Chip
          label={product.category}
          size="small"
          sx={{ 
            mb: 1, 
            width: 'fit-content',
            background: 'rgba(0, 200, 83, 0.3)',
            color: 'white',
            border: '1px solid rgba(0, 200, 83, 0.5)',
          }}
        />

        <Typography
          variant="body2"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          {product.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Rating value={product.rating} readOnly precision={0.1} size="small" sx={{ color: '#00c853' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              ({product.rating})
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ color: '#00c853', fontWeight: 700 }}>
            ${product.price}
          </Typography>

          {product.discountPercentage > 0 && (
            <Chip
              label={`-${product.discountPercentage}%`}
              size="small"
              sx={{ 
                mt: 1,
                background: 'rgba(255, 100, 100, 0.3)',
                color: 'white',
                border: '1px solid rgba(255, 100, 100, 0.5)',
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default function ProductsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    products,
    total,
    currentPage,
    limit,
    loading,
    error,
    searchQuery,
    selectedCategory,
    categories,
    fetchProducts,
    fetchCategories,
    setSearchQuery,
    setSelectedCategory,
    setCurrentPage,
  } = useProductsStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Memoized page count
  const pageCount = useMemo(() => Math.ceil(total / limit), [total, limit]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Load products when filters change
  useEffect(() => {
    fetchProducts(currentPage, searchQuery, selectedCategory);
  }, [currentPage, searchQuery, selectedCategory, fetchProducts]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearch, searchQuery, setSearchQuery, setCurrentPage]);

  // Memoized category change handler
  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      setCurrentPage(1);
      setLocalSearch('');
      setSearchQuery('');
      fetchProducts(1, '', category);
    },
    [setSelectedCategory, setCurrentPage, setSearchQuery, fetchProducts]
  );

  // Memoized page change handler
  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setCurrentPage]
  );

  // Scroll to top on category or search change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [selectedCategory, searchQuery]);

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
              Products Catalog
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Explore our collection of {total} products
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
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    placeholder="Search products by name or description..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
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
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)', '&.Mui-focused': { color: '#00c853' } }}>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Category"
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      sx={{
                        borderRadius: 2,
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 200, 83, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#00c853',
                        },
                        '& .MuiSvgIcon-root': {
                          color: '#00c853',
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: 'rgba(26, 26, 26, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            '& .MuiMenuItem-root': {
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'rgba(0, 200, 83, 0.2)',
                              },
                              '&.Mui-selected': {
                                bgcolor: 'rgba(0, 200, 83, 0.3)',
                                '&:hover': {
                                  bgcolor: 'rgba(0, 200, 83, 0.4)',
                                },
                              },
                            },
                          },
                        },
                      }}
                    >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
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
              {products.length === 0 ? (
                <Alert 
                  severity="info" 
                  sx={{ 
                    borderRadius: 2,
                    background: 'rgba(0, 200, 83, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 200, 83, 0.3)',
                    color: 'white',
                    fontSize: '1rem',
                    '& .MuiAlert-icon': {
                      color: '#00c853',
                    },
                  }}
                >
                  No products found
                </Alert>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {products.map((product) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                        <ProductCard product={product} />
                      </Grid>
                    ))}
                  </Grid>

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

                  <Typography
                    variant="caption"
                    sx={{ display: 'block', mt: 2, textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Showing {products.length} of {total} products
                  </Typography>
                </>
              )}
            </>
          )}
        </Container>
      </Box>
    </>
  );
}
