import axios from "axios"; // Import axios for making HTTP requests
import { useEffect, useState } from "react"; // Import hooks from React
import { Button, Card } from "react-bootstrap"; // Import Button and Card from react-bootstrap
import { CardActions, CardContent, Typography } from "@mui/material"; // Import Material UI components for styling
import { notification } from "antd"; // Import Ant Design's notification for showing success/error messages
import './adminSlotManagement.css'; // Import the updated CSS file for styling
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for routing

const AdminSlotManagement: React.FC = () => {
    // State to store the list of parking slots and loading state
    const [slots, setSlots] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate(); // To navigate to different routes if needed

    // Status mapping object to convert numerical status codes to readable text
    const statusMapping: { [key: number]: string } = {
        0: 'Pending',    // 0: Pending status
        1: 'Accepted',   // 1: Accepted status
        2: 'Rejected'    // 2: Rejected status
    };

    // useEffect hook to fetch parking slot data on component mount
    useEffect(() => {
        // Asynchronous function to fetch parking slots from the backend API
        const fetchSlots = async () => {
            setLoading(true); // Set loading to true while data is being fetched
            try {
                // Make GET request to fetch parking slots from the API
                const response = await axios.get<any[]>(`https://localhost:7253/gateway/ParkingSlots`);
                setSlots(response.data); // Set the fetched slots data into state
            } catch (error) {
                // Log error if fetching fails
                console.error('Error fetching slot requests:', error);
            } finally {
                // Set loading to false once the request is complete
                setLoading(false);
            }
        };
        fetchSlots(); // Call the fetchSlots function on component mount
    }, []); // Empty dependency array means this effect runs only once after initial render

    // Function to show notification for success or error messages
    const openNotification = (type: 'success' | 'error', message: string) => {
        notification[type]({
            message: type === 'success' ? 'Action Successful' : 'Action Failed', // Set message title based on type
            description: message, // Set the message description
        });
    };

    // Handle accepting a slot request by making a PUT request to approve the slot
    const handleAccept = async (slotId: number) => {
        try {
            // Make PUT request to approve the slot
            await axios.put(`https://localhost:7253/gateway/ParkingSlots/approve/${slotId}`);
            // Show success notification
            openNotification('success', `Slot ${slotId} approved successfully.`);
        } catch (error) {
            // Log error and show failure notification if request fails
            console.error('Error accepting slot:', error);
            openNotification('error', 'Failed to approve the slot. Please try again.');
        }
    };

    // Handle rejecting a slot request by making a PUT request to reject the slot
    const handleReject = async (slotId: number) => {
        try {
            // Make PUT request to reject the slot
            await axios.put(`https://localhost:7253/gateway/ParkingSlots/reject/${slotId}`);
            // Show success notification
            openNotification('success', `Slot ${slotId} rejected successfully.`);
        } catch (error) {
            // Log error and show failure notification if request fails
            console.error('Error rejecting slot:', error);
            openNotification('error', 'Failed to reject the slot. Please try again.');
        }
    };

    return (
        <div className="admin-slot-container"> {/* Main container for the slots */}
            <div className="admin-slot-cards"> {/* Container for all slot cards */}
                {loading ? (
                    <Typography>Loading...</Typography> // Display loading text while fetching data
                ) : slots.length > 0 ? (
                    // If slots are fetched, map through the slots and render each slot as a card
                    slots.map((slot) => (
                        <Card key={slot.slotId} className="slot-card"> {/* Card for each slot */}
                            <CardContent>
                                {/* Slot details displayed within the card */}
                                <Typography className="slot-location">Location: {slot.location}</Typography>
                                <Typography className="slot-price">Price: {slot.slotPrice}</Typography>
                                <Typography className="slot-status">Status: {statusMapping[slot.status] || 'Unknown'}</Typography>
                            </CardContent>
                            <CardActions>
                                {/* Accept button to approve the slot */}
                                <Button onClick={() => handleAccept(slot.slotId)} className="accept-button">
                                    Accept
                                </Button>
                                {/* Reject button to reject the slot */}
                                <Button onClick={() => handleReject(slot.slotId)} className="reject-button">
                                    Reject
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    // If no slots are available, show this message
                    <Typography>No slot requests available.</Typography>
                )}
            </div>
        </div>
    );
};

export default AdminSlotManagement; // Export the AdminSlotManagement component for use elsewhere
