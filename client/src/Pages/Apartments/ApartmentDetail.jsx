import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Button,
    TextField,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { API_URL } from '../../api/config';

const ApartmentDetail = () => {
    const { id } = useParams();
    const [apartment, setApartment] = useState(null);
    const [openBooking, setOpenBooking] = useState(false);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [requirements, setRequirements] = useState('');

    useEffect(() => {
        const fetchApartment = async () => {
            try {
                const response = await axios.get(`${API_URL}/apartment/${id}`);
                setApartment(response.data.data);
            } catch (error) {
                console.error('Error fetching apartment:', error);
            }
        };

        fetchApartment();
    }, [id]);

    const handleBooking = async () => {
        try {
            const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage
            await axios.post(`${API_URL}/apartment/book`, {
                apartmentId: id,
                userId,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                requirements: [requirements]
            });
            setOpenBooking(false);
            // Show success message or redirect
        } catch (error) {
            console.error('Error booking apartment:', error);
        }
    };

    if (!apartment) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container sx={{ py: 8 }} maxWidth="lg">
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="400"
                            image={apartment.ImgUrl}
                            alt={apartment.Name}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {apartment.Name}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                        ${apartment.Price}/night
                    </Typography>
                    <Typography paragraph>
                        {apartment.AboutMe}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenBooking(true)}
                    >
                        Book Now
                    </Button>
                </Grid>
            </Grid>

            <Dialog open={openBooking} onClose={() => setOpenBooking(false)}>
                <DialogTitle>Book Apartment</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Check-in Date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            type="date"
                            label="Check-out Date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Special Requirements"
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBooking(false)}>Cancel</Button>
                    <Button onClick={handleBooking} variant="contained" color="primary">
                        Submit Booking
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ApartmentDetail;
