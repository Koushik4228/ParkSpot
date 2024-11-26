// Import necessary modules and components
import axios from "axios"; // For making HTTP requests
import { useEffect, useState } from "react"; // React hooks for managing state and side effects
import { Slot } from "../../ServiceProviderForm/ViewSlot/viewslot"; // Type for Slot data
import { Typography } from "@mui/material"; // Material UI component for text
import { useNavigate } from "react-router"; // React Router hook for navigation
import './accepteddata.css'; // Import custom CSS file for styling
import AdminHeader from "../Adminheader/Adminheader"; // Import the admin header component
import Footer from "../../Footer/footer"; // Import the footer component (not used in this example)

const AcceptedData: React.FC = () => {
    // State hooks to store the slots data and loading state
    const [slots, setSlots] = useState<Slot[]>([]); // State to store the array of accepted slots
    const [loading, setLoading] = useState(true); // State to track loading status

    const navigate = useNavigate(); // Navigation hook for redirecting

    // useEffect hook to fetch data on component mount
    useEffect(() => {
        // Asynchronous function to fetch slots data
        const fetchSlots = async () => {
            setLoading(true); // Set loading to true when starting to fetch data
            try {
                // Making an HTTP GET request to the API to fetch approved parking slots
                const response = await axios.get<Slot[]>("https://localhost:7253/gateway/ParkingSlots/approved");
                setSlots(response.data); // Update the slots state with the data received from the API
            } catch (error) {
                console.error('Error fetching slots:', error); // Handle errors if the request fails
            } finally {
                setLoading(false); // Set loading to false once the request is completed (success or failure)
            }
        };
        fetchSlots();
    }, []);

    

    return (
        <>
            {/* Admin Header component */}
            <AdminHeader />

            {/* Main container for accepted parking slots */}
            <div className="accepted-data-container">
                {/* Title for the page */}
                <h2 className="accepted-title">Accepted Parking Slots</h2>

                {/* Display loading message while data is being fetched */}
                {loading ? (
                    <Typography className="accepted-loading-message">Loading...</Typography>
                ) : slots.length > 0 ? (
                    // If there are slots available, render the table
                    <table className="accepted-table">
                        <thead>
                            <tr>
                                {/* Table headers for displaying slot details */}
                                <th>Location</th>
                                <th>Price</th>
                                <th>Total Slots</th>
                                <th>Available Slots</th>
                                <th>Vehicle Type</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mapping over the slots array to render each slot's details in a table row */}
                            {slots.map((slot) => (
                                <tr key={slot.slotId}>
                                    <td>{slot.location}</td>
                                    <td>{slot.slotPrice}</td>
                                    <td>{slot.totalSlots}</td>
                                    <td>{slot.slotAvailability}</td>
                                    <td>{slot.vehicleType}</td>
                                    <td>{slot.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    // If no slots are available, display a message
                    <Typography className="accepted-error-message">No slots available.</Typography>
                )}
            </div>

            {/* Optional Footer (not used in this example) */}
            {/* <Footer /> */}
        </>
    );
};

export default AcceptedData; // Export the component to be used in other parts of the app
