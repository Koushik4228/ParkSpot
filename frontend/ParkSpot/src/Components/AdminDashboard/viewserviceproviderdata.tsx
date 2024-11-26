import axios from "axios"; // Import axios for making HTTP requests
import { useEffect, useState } from "react"; // Import useEffect and useState from React for state management and side effects
import { Typography } from "@mui/material"; // Import Material UI Typography component for consistent text styling
import './viewserviceproviderdata.css'; // Import custom CSS for styling this component

// Interface to define the structure of a Slot object
interface Slot {
    slotId: number;
    location: string;
    slotPrice: number;
    totalSlots: number;
    slotAvailability: number;
    vehicleType: string;
    address: string;
}

// Main component for displaying service provider data (Parking Slot details)
function ViewServiceProviderData() {
    // State to hold the list of slots and loading state
    const [slots, setSlots] = useState<Slot[]>([]); // slots state stores the fetched data
    const [loading, setLoading] = useState(true); // loading state manages the loading indicator

    // useEffect hook to fetch the parking slots from the backend when the component is mounted
    useEffect(() => {
        // Async function to fetch slots data
        const fetchSlots = async () => {
            setLoading(true); // Set loading to true while fetching data
            try {
                // Make a GET request to the API to fetch the slot data
                const response = await axios.get<Slot[]>(`https://localhost:7253/gateway/ParkingSlots`);
                setSlots(response.data); // Set the response data to the slots state
            } catch (error) {
                // Log an error if the request fails
                console.error('Error fetching slots:', error);
            } finally {
                setLoading(false); // Set loading to false once the request is complete
            }
        };

        // Call the fetchSlots function when the component mounts
        fetchSlots();
    }, []); // Empty dependency array means this useEffect will only run once on component mount

    return (
        <div className="service-provider-data-container"> {/* Main container for the component */}
            
            {/* Heading for the section */}
            <Typography variant="h2" className="provider-heading">Service Providers</Typography>
            
            {/* Conditional rendering based on loading state */}
            {loading ? (
                // If data is still loading, display the loading message
                <Typography className="loading-message">Loading...</Typography>
            ) : slots.length > 0 ? (
                // If slots are fetched, render them in a table
                <table className="service-provider-table">
                    <thead>
                        <tr>
                            {/* Table headers for each slot property */}
                            <th>Location</th>
                            <th>Price</th>
                            <th>Total Slots</th>
                            <th>Available Slots</th>
                            <th>Vehicle Type</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Map through each slot and render it as a row in the table */}
                        {slots.map((slot) => (
                            <tr key={slot.slotId}> {/* Use slotId as the key for each table row */}
                                <td>{slot.location}</td> {/* Display slot location */}
                                <td>{slot.slotPrice}</td> {/* Display slot price */}
                                <td>{slot.totalSlots}</td> {/* Display total slots */}
                                <td>{slot.slotAvailability}</td> {/* Display available slots */}
                                <td>{slot.vehicleType}</td> {/* Display the type of vehicle allowed in the slot */}
                                <td>{slot.address}</td> {/* Display the address of the parking slot */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                // If no slots are found, display a message indicating no data is available
                <Typography className="error-message">No slots available.</Typography>
            )}
        </div>
    );
}

export default ViewServiceProviderData; // Export the component to be used in other parts of the app
