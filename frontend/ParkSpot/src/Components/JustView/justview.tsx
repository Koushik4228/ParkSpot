import axios from "axios";
import { useEffect, useState } from "react";
import { Slot } from "../../Components/ServiceProviderForm/ViewSlot/viewslot";
import { Button, Card } from "react-bootstrap";
import { Box, CardActions, CardContent, TextField, Typography } from "@mui/material";
import './justview.css';
import { Link, useNavigate } from "react-router-dom";
import MapComponent from "./mapcomponent";
import { notification } from "antd";
import Header from "../Header/header";

const JustViewSlot: React.FC = () => {
    const [slots, setSlots] = useState<Slot[]>([]); // All available slots
    const [loading, setLoading] = useState(true); // Loading state for initial slots fetch
    const [searchLoading, setSearchLoading] = useState(false); // Loading state for search
    const [searchParams, setSearchParams] = useState({ location: '' }); // Search parameters
    const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]); // Filtered slots based on search
    const [errorMessage, setErrorMessage] = useState<string>(''); // Error message for invalid location

    const navigate = useNavigate();

    // Fetch all available slots when component mounts
    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            try {
                const response = await axios.get<Slot[]>(`https://localhost:7253/gateway/ParkingSlots/approved`);
                setSlots(response.data); // Save fetched slots
            } catch (error) {
                console.error('Error fetching slots:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, []);

  

    // Handle search functionality
    const handleSearch = async () => {
        setSearchLoading(true); // Start loading state for search
        setErrorMessage(''); // Reset error message when search starts
        try {
            const { location } = searchParams;
            if (!location) {
                notification.error({
                    message: 'Error',
                    description: 'Location is required for search',
                });
                setSearchLoading(false);
                return;
            }

            const response = await axios.get(`https://localhost:7253/gateway/ParkingSlots/available?location=${location}`);
            console.log('Search Response:', response.data);  // Log API response for debugging

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setFilteredSlots(response.data);  // Update filtered slots
            } else {
                // If no slots are found, set an error message
                setErrorMessage('No slots available for the provided location.');
                setFilteredSlots([]); // Clear filtered slots if no match found
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            setErrorMessage('There was an error while fetching the slots. Please try again.');
        } finally {
            setSearchLoading(false); // Stop loading after the search completes
        }
    };

    return (
        <>
        <Header/>
            {/* Search Form */}
            <Box className="slots-manager-search-box" mb={2}>
                <TextField
                    label="Location"
                    variant="outlined"
                    fullWidth
                    value={searchParams.location}
                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                />
                <Button variant="outlined" onClick={handleSearch} disabled={searchLoading}>
                    {searchLoading ? 'Searching...' : 'Search'}
                </Button>
            </Box>

            {/* Display Error Message */}
            {errorMessage && (
                <Typography variant="h6" color="error" align="center" className="error-message">
                    {errorMessage}
                </Typography>
            )}

            {/* Main Content - Cards and Map side by side */}
            <div className="justview-main-content">
                {/* Cards Container */}
                <div className="justview-booking-container">
                    <div className="justview-booking-cards">
                        {loading ? (
                            <Typography>Loading...</Typography> // Loading state for fetching slots
                        ) : filteredSlots.length > 0 ? (
                            // If search has been done and filtered slots exist, show them
                            filteredSlots.map((slot) => (
                                <Card key={slot.slotId} className="justview-booking-card">
                                    <CardContent>
                                        <Typography className="justview-slot-location">Location: {slot.location}</Typography>
                                        <Typography className="justview-slot-price">Price: {slot.slotPrice}</Typography>
                                        <Typography className="justview-slot-total">Total Slots: {slot.totalSlots}</Typography>
                                        <Typography className="justview-slot-available">Available Slots: {slot.slotAvailability}</Typography>
                                        <Typography className="justview-slot-vehicle-type">Vehicle Type: {slot.vehicleType}</Typography>
                                        <Typography className="justview-slot-address">Address: {slot.address}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <button className="btn-justview" disabled={slot.slotAvailability <= 0} >
                                            <Link to='/login' id="l1">Book Now</Link>
                                        </button>
                                    </CardActions>
                                </Card>
                            ))
                        ) : slots.length > 0 ? (
                            // If no search was done, show all available slots
                            slots.map((slot) => (
                                <Card key={slot.slotId} className="justview-booking-card">
                                    <CardContent>
                                        <Typography className="justview-slot-location">Location: {slot.location}</Typography>
                                        <Typography className="justview-slot-price">Price: {slot.slotPrice}</Typography>
                                        <Typography className="justview-slot-total">Total Slots: {slot.totalSlots}</Typography>
                                        <Typography className="justview-slot-available">Available Slots: {slot.slotAvailability}</Typography>
                                        <Typography className="justview-slot-vehicle-type">Vehicle Type: {slot.vehicleType}</Typography>
                                        <Typography className="justview-slot-address">Address: {slot.address}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <button className="btn-justview" disabled={slot.slotAvailability <= 0} >
                                            <Link to='/login' id="l1">Book Now</Link>
                                        </button>
                                    </CardActions>
                                </Card>
                            ))
                        ) : (
                            <Typography>No slots available.</Typography> // If no slots exist at all
                        )}
                    </div>
                </div>

                {/* Map Component */}
                <div className="map-container">
                    <MapComponent slots={filteredSlots.length > 0 ? filteredSlots : slots} />
                </div>
            </div>
        </>
    );
};

export default JustViewSlot;
