import axios from "axios";
import { useEffect, useState } from "react";
import { Slot } from "../../ServiceProviderForm/ViewSlot/viewslot"; // Importing the Slot type/interface
import { Button, Card } from "react-bootstrap";
import { Box, CardActions, CardContent, TextField, Typography } from "@mui/material";
import { LocationOn, AttachMoney, DirectionsCar, Info } from '@mui/icons-material'; // Import icons for UI enhancement
import './userbookingcard.css';
import { useNavigate } from "react-router-dom";
import Userheader from "../UserDashboardheader/Userheader";
import MapComponent from "../../JustView/mapcomponent"; // Importing a MapComponent for displaying locations on a map
import { notification } from "antd"; // Importing notification library to show error messages

// Define the type for the search parameters
interface SearchParams {
  location: string; // Location to be used for searching slots
}

const ViewBookDetails: React.FC = () => {
    const [slots, setSlots] = useState<Slot[]>([]); // State to hold all slots fetched from the server
    const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]); // State to hold slots filtered based on user search
    const [searchLoading, setSearchLoading] = useState(false); // State to indicate loading during search
    const [searchParams, setSearchParams] = useState<SearchParams>({ location: '' }); // State for search parameters
    const [loading, setLoading] = useState(true); // State for loading the slots initially
    const [errorMessage, setErrorMessage] = useState<string>(''); // State to display an error message if the location is invalid

    const navigate = useNavigate(); // Hook to navigate to other pages

    // Fetch all slots when the component mounts
    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true); // Start loading spinner
            try {
                // Fetch approved parking slots from the server
                const response = await axios.get<Slot[]>(`https://localhost:7253/gateway/ParkingSlots/approved`);
                setSlots(response.data); // Store all slots in the state
                setFilteredSlots(response.data); // Initially, set filtered slots to show all fetched slots
            } catch (error) {
                console.error('Error fetching slots:', error); // Log error if fetching fails
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };
        fetchSlots(); // Trigger the fetch function on mount
    }, []);

    // Handle the search functionality
    const handleSearch = async () => {
        setSearchLoading(true); // Start loading spinner for search
        setErrorMessage(''); // Clear any previous error messages
        try {
            const { location } = searchParams;
            if (!location) {
                // Show error notification if location is empty
                notification.error({
                    message: 'Error',
                    description: 'Location is required for search',
                });
                setSearchLoading(false); // Stop loading spinner
                return;
            }

            // Fetch available slots based on location parameter
            const response = await axios.get<Slot[]>(`https://localhost:7253/gateway/ParkingSlots/available?location=${location}`);
            console.log('Search Response:', response.data);  // Log API response for debugging

            // Update filtered slots if any available slots are found
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setFilteredSlots(response.data); // Update filtered slots with the search result
            } else {
                setErrorMessage('No slots available for the provided location.'); // Show error if no slots match
                setFilteredSlots([]); // Clear filtered slots if no match is found
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            setErrorMessage('There was an error while fetching the slots. Please try again.');
        } finally {
            setSearchLoading(false); // Stop loading spinner for search
        }
    };

    // Handle the booking action when "Book Now" button is clicked
    const handleBookNow = (slot: Slot) => {
        // Navigate to booking page with selected slot details passed as state
        navigate(`/userbooking`, { 
            state: { 
                slotId: slot.slotId, 
                slotPrice: slot.slotPrice,
                location: slot.location,
                vehicleType: slot.vehicleType,
                latitude: slot.latitude,
                longitude: slot.longitude
            } 
        });
    };

    return (
        <>
            <Userheader /> {/* Render the user header component */}

            {/* Search Form */}
            <Box className="search-box10" mb={2}>
                <TextField
                    label="Location"
                    variant="outlined"
                    fullWidth
                    value={searchParams.location} // Bind search location input
                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })} // Update location input
                />
                <button className="serach-uerbooking" onClick={handleSearch} disabled={searchLoading}>
                    {searchLoading ? 'Searching...' : 'Search'} {/* Show loading text if search is ongoing */}
                </button>
            </Box>

            {/* Display Error Message */}
            {errorMessage && (
                <Typography variant="h6" color="error" align="center" className="error-message">
                    {errorMessage} {/* Display error message if there is one */}
                </Typography>
            )}

            {/* Main Content: Display slots or loading message */}
            <div className="booking-container">
                <div className="booking-cards">
                    {loading ? (
                        <Typography>Loading...</Typography> // Display loading message while fetching slots
                    ) : filteredSlots.length > 0 ? (
                        filteredSlots.map((slot) => (
                            <Card key={slot.slotId} className="booking-card">
                                <CardContent>
                                    {/* Display slot details */}
                                    <Typography className="slot-location">
                                        <LocationOn /> Location: {slot.location}
                                    </Typography>
                                    <Typography className="slot-price">
                                        <AttachMoney /> Price: {slot.slotPrice}
                                    </Typography>
                                    <Typography className="slot-total">
                                        <Info /> Total Slots: {slot.totalSlots}
                                    </Typography>
                                    <Typography className="slot-available">
                                        <Info /> Available Slots: {slot.slotAvailability}
                                    </Typography>
                                    <Typography className="slot-vehicle-type">
                                        <DirectionsCar /> Vehicle Type: {slot.vehicleType}
                                    </Typography>
                                    <Typography className="slot-address">Address: {slot.address}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        onClick={() => handleBookNow(slot)} // Trigger booking action
                                        disabled={slot.slotAvailability <= 0} // Disable button if no slots available
                                        className="book-now-btn"
                                        style={{ backgroundColor: '#f7ca4e', borderColor: '#f7ca4e', color: 'black' }}
                                    >
                                        Book Now
                                    </Button>
                                </CardActions>
                            </Card>
                        ))
                    ) : (
                        <Typography>No slots available.</Typography> // Display message if no slots are available
                    )}
                </div>

                <div className="booking-map">
                    {/* Display the MapComponent with filtered slots */}
                    <MapComponent slots={filteredSlots} />
                </div>
            </div>
        </>
    );
};

export default ViewBookDetails;
