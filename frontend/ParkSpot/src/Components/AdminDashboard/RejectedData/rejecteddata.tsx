import axios from "axios"; // Import axios for making HTTP requests
import { useEffect, useState } from "react"; // Import useEffect and useState from React
import { Slot } from "../../ServiceProviderForm/ViewSlot/viewslot"; // Import Slot type definition
import { Typography } from "@mui/material"; // Import Material UI Typography component for styling text
import { useNavigate } from "react-router"; // Import useNavigate hook for routing/navigation
import './rejecteddata.css'; // Import custom CSS styles for the component
import AdminHeader from "../Adminheader/Adminheader"; // Import AdminHeader component (assumed to be a reusable header)
import Footer from "../../Footer/footer"; // Import Footer component (assumed to be a reusable footer)

const RejectedData: React.FC = () => {
    // State to hold the list of rejected parking slots and loading state
    const [slots, setSlots] = useState<Slot[]>([]); 
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate(); // Hook to navigate to other routes

    // useEffect hook to fetch rejected parking slots when the component mounts
    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true); // Set loading state to true before data is fetched
            try {
                // Make GET request to fetch rejected parking slots from the backend API
                const response = await axios.get<Slot[]>(`https://localhost:7253/gateway/ParkingSlots/rejected`);
                setSlots(response.data); // Set the fetched slots data into state
            } catch (error) {
                // Log any errors that occur during the fetch operation
                console.error('Error fetching slots:', error);
            } finally {
                setLoading(false); // Set loading state to false once the fetch is complete
            }
        };
        fetchSlots(); // Call the fetchSlots function on component mount
    }, []); // Empty dependency array means this effect runs only once after initial render

    return (
        <>
            <AdminHeader /> {/* Render the AdminHeader component at the top of the page */}
            <div className="rejected-data-container"> {/* Main container for displaying rejected slots */}
                <h2 className="rejected-title">Rejected Parking Slots</h2> {/* Title of the page */}
                
                {/* If the data is still loading, show the loading message */}
                {loading ? (
                    <Typography className="rejected-loading-message">Loading...</Typography>
                ) : slots.length > 0 ? (
                    // If slots are available, display them in a table
                    <table className="rejected-table">
                        <thead>
                            <tr>
                                {/* Table headers for slot information */}
                                <th>Location</th>
                                <th>Price</th>
                                <th>Total Slots</th>
                                <th>Available Slots</th>
                                <th>Vehicle Type</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Map through the rejected slots and render each slot as a row in the table */}
                            {slots.map((slot) => (
                                <tr key={slot.slotId}> {/* Use slotId as the key for each row */}
                                    <td>{slot.location}</td> {/* Display the location of the slot */}
                                    <td>{slot.slotPrice}</td> {/* Display the price of the slot */}
                                    <td>{slot.totalSlots}</td> {/* Display the total number of slots */}
                                    <td>{slot.slotAvailability}</td> {/* Display the availability of the slots */}
                                    <td>{slot.vehicleType}</td> {/* Display the vehicle type allowed in the slot */}
                                    <td>{slot.address}</td> {/* Display the address of the parking slot */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    // If no rejected slots are available, display an error message
                    <Typography className="rejected-error-message">No slots available.</Typography>
                )}
            </div>
            <Footer /> {/* Footer component, assuming it is used for global footer content */}
        </>
    );
};

export default RejectedData; // Export the RejectedData component to be used in other parts of the app
