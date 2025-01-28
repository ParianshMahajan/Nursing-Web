import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid, Container } from '@mui/material';

const ApartmentList = () => {
    const [apartments, setApartments] = useState([]);

    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const response = await axios.get('/api/apartment/all');
                setApartments(response.data.data);
            } catch (error) {
                console.error('Error fetching apartments:', error);
            }
        };

        fetchApartments();
    }, []);

    return (
        <Container sx={{ py: 8 }} maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
                Available Apartments
            </Typography>
            <Grid container spacing={4}>
                {apartments.map((apartment) => (
                    <Grid item key={apartment._id} xs={12} sm={6} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={apartment.ImgUrl}
                                alt={apartment.Name}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {apartment.Name}
                                </Typography>
                                <Typography>
                                    Price: ${apartment.Price}/night
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {apartment.AboutMe}
                                </Typography>
                                <Link to={`/apartment/${apartment._id}`} style={{ textDecoration: 'none' }}>
                                    View Details
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ApartmentList;
