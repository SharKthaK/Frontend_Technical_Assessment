'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Rating,
  List,
  ListItem,
  ListItemText,
  ImageList,
  ImageListItem,
  Skeleton,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Star,
  LocalShipping,
  Inventory,
  Category,
  Reviews,
  NavigateBefore,
  NavigateNext,
} from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import { useProductsStore } from '@/store/productsStore';
import { Product } from '@/lib/types';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchProductById } = useProductsStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [thumbnailsLoading, setThumbnailsLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'instant' });

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productId = parseInt(params.id as string);
        const productData = await fetchProductById(productId);
        setProduct(productData);
      } catch (err) {
        const errorMessage = err instanceof TypeError && err.message.includes('fetch')
          ? 'Failed to connect. Please check your internet connection.'
          : err instanceof Error && err.message === 'Product not found'
          ? 'Product not found'
          : 'Failed to load product details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id, fetchProductById]);

  // Memoized average rating calculation
  const averageReviewRating = useMemo(() => {
    if (!product?.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / product.reviews.length;
  }, [product?.reviews]);

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
              {error || 'Product not found'}
            </Alert>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.push('/products')}
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
              Back to Products
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
          onClick={() => router.push('/products')}
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
          Back to Products
        </Button>

        {loading || !product ? (
          <Paper sx={{ 
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Skeleton variant="text" width="80%" height={50} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mt: 2 }} />
                <Skeleton variant="rectangular" height={150} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, mt: 2 }} />
              </Grid>
            </Grid>
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
          <Grid container spacing={4}>
            {/* Image Gallery */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  position: 'relative',
                  mb: 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                {mainImageLoading && (
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height={400}
                    sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                  />
                )}
                <img
                  src={product.images[selectedImage] || product.thumbnail}
                  alt={product.title}
                  loading="lazy"
                  onLoad={() => setMainImageLoading(false)}
                  onError={() => setMainImageLoading(false)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    opacity: mainImageLoading ? 0 : 1,
                    transition: 'opacity 0.3s',
                  }}
                />
                
                {/* Previous Image Button */}
                {product.images.length > 1 && (
                  <IconButton
                    onClick={() => {
                      const newIndex = selectedImage === 0 ? product.images.length - 1 : selectedImage - 1;
                      setSelectedImage(newIndex);
                      setMainImageLoading(true);
                    }}
                    disabled={product.images.length <= 1}
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 1)',
                      },
                      boxShadow: 2,
                    }}
                  >
                    <NavigateBefore />
                  </IconButton>
                )}
                
                {/* Next Image Button */}
                {product.images.length > 1 && (
                  <IconButton
                    onClick={() => {
                      const newIndex = selectedImage === product.images.length - 1 ? 0 : selectedImage + 1;
                      setSelectedImage(newIndex);
                      setMainImageLoading(true);
                    }}
                    disabled={product.images.length <= 1}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 1)',
                      },
                      boxShadow: 2,
                    }}
                  >
                    <NavigateNext />
                  </IconButton>
                )}
              </Box>

              <ImageList sx={{ width: '100%', height: 100 }} cols={4} rowHeight={80}>
                {product.images.map((image, index) => (
                  <ImageListItem
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setMainImageLoading(true);
                    }}
                    sx={{
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                      borderRadius: 1,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {thumbnailsLoading[index] !== false && (
                      <Skeleton 
                        variant="rectangular" 
                        width="100%" 
                        height={80}
                        sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                      />
                    )}
                    <img 
                      src={image} 
                      alt={`${product.title} ${index + 1}`}
                      loading="lazy"
                      onLoad={() => setThumbnailsLoading(prev => ({ ...prev, [index]: false }))}
                      onError={() => setThumbnailsLoading(prev => ({ ...prev, [index]: false }))}
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: thumbnailsLoading[index] !== false ? 0 : 1,
                        transition: 'opacity 0.3s',
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>

            {/* Product Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 700 }}>
                {product.title}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={product.category} 
                  sx={{ 
                    background: 'rgba(0, 200, 83, 0.3)',
                    color: 'white',
                    border: '1px solid rgba(0, 200, 83, 0.5)',
                  }} 
                />
                <Chip 
                  label={product.brand} 
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }} 
                />
                {product.tags.slice(0, 2).map((tag) => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    size="small" 
                    sx={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }} 
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={product.rating} readOnly precision={0.1} sx={{ color: '#00c853' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {product.rating} ({product.reviews?.length || 0} reviews)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 3 }}>
                <Typography variant="h3" sx={{ color: '#00c853', fontWeight: 700 }}>
                  ${product.price}
                </Typography>
                {product.discountPercentage > 0 && (
                  <Chip
                    label={`${product.discountPercentage}% OFF`}
                    sx={{ 
                      background: 'rgba(255, 100, 100, 0.3)',
                      color: 'white',
                      border: '1px solid rgba(255, 100, 100, 0.5)',
                    }}
                    size="small"
                  />
                )}
              </Box>

              <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                {product.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Inventory sx={{ color: '#00c853' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Stock
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {product.stock} units
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Category sx={{ color: '#00c853' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        SKU
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>{product.sku}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalShipping sx={{ color: '#00c853' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Shipping
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'white' }}>
                        {product.shippingInformation}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                <strong style={{ color: 'white' }}>Warranty:</strong> {product.warrantyInformation}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                <strong style={{ color: 'white' }}>Return Policy:</strong> {product.returnPolicy}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <strong style={{ color: 'white' }}>Min Order Quantity:</strong> {product.minimumOrderQuantity}
              </Typography>
            </Grid>
          </Grid>

          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <>
              <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Reviews sx={{ color: '#00c853' }} />
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                    Customer Reviews ({product.reviews.length})
                  </Typography>
                  <Rating value={averageReviewRating} readOnly precision={0.1} sx={{ color: '#00c853' }} />
                </Box>

                <Grid container spacing={2}>
                  {product.reviews.map((review, index) => (
                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                      <Card 
                        elevation={0}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                              {review.reviewerName}
                            </Typography>
                            <Rating value={review.rating} readOnly size="small" sx={{ color: '#00c853' }} />
                          </Box>
                          <Typography variant="body2" paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {review.comment}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            {new Date(review.date).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}

          {/* Specifications */}
          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 700 }}>
            Specifications
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Weight"
                    secondary={`${product.weight} kg`}
                    primaryTypographyProps={{ sx: { color: 'white', fontWeight: 600 } }}
                    secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.8)' } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Dimensions"
                    secondary={`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`}
                    primaryTypographyProps={{ sx: { color: 'white', fontWeight: 600 } }}
                    secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.8)' } }}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Availability"
                    secondary={product.availabilityStatus}
                    primaryTypographyProps={{ sx: { color: 'white', fontWeight: 600 } }}
                    secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.8)' } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Created"
                    secondary={new Date(
                      product.meta.createdAt
                    ).toLocaleDateString()}
                    primaryTypographyProps={{ sx: { color: 'white', fontWeight: 600 } }}
                    secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.8)' } }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>
        )}
        </Container>
      </Box>
    </>
  );
}
