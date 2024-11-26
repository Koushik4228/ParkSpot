import React, { useEffect, useState } from 'react';
import { updateSlotAvailability, updateSlotAvailability12 } from '../../../services/bookingservice';
import './viewuserbooking.css';
import Userheader from '../UserDashboardheader/Userheader';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../Accounts/Store/mystore'; // Import RootState type for accessing Redux state
import { notification } from 'antd'; // Import Ant Design notification for user feedback

// Define the Booking interface to specify the structure of booking data
interface Booking {
    slotId: number;
    userName: string;
    vehicleNumber: string;
    bookingDate: string; // Date or string, depending on how the API returns it
    startTime: string;
    endtime: string;
    price: number;
    parkingSlotNumber: string;
    customerid: number;
}
 
const BookingsTable: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]); // State to hold user's bookings
    const [loading, setLoading] = useState<boolean>(true); // State to track loading status
    const [error, setError] = useState<string | null>(null); // State to store any error messages
    const [checkInStatus, setCheckInStatus] = useState<{ [key: string]: boolean }>({}); // Track check-in status by booking key
    const navigate = useNavigate(); // Hook to navigate to other pages
    const userId = useSelector((state: RootState) => state.user.userId); // Get userId from Redux state
 
    // Fetch user's bookings from the API on component mount
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`https://localhost:7253/gateway/Booking/customer/${userId}`);
                setBookings(response.data); // Store fetched bookings
            } catch (err) {
                setError("Failed to fetch bookings."); // Set error message if API call fails
            } finally {
                setLoading(false); // Set loading to false once API call completes
            }
        };
        fetchBookings(); // Fetch bookings on mount
    }, [userId]); // Dependency on userId ensures fetch triggers only on mount
 
    // Load check-in status from localStorage on mount to retain the check-in state
    useEffect(() => {
        const persistedStatus = JSON.parse(localStorage.getItem('checkInStatus') || '{}');
        setCheckInStatus(persistedStatus); // Set check-in status from persisted data
    }, []);
 
    // Utility function to show notifications (success or error) at the top-right corner
    const showNotification = (type: 'success' | 'error', message: string, description?: string) => {
        notification[type]({
            message,
            description,
            placement: 'topRight',
        });
    };
 
    // Handle the "Check In" action, update availability and save status
    const handleEntry = async (slotId: number, userName: string) => {
        const statusKey = `${slotId}_${userName}`; // Unique key for each booking based on slotId and userName
 
        // Prevent multiple check-ins for the same booking
        if (checkInStatus[statusKey] ?? false) {
            showNotification('error', "Already Checked In"); // Show error if already checked in
            return;
        }
 
        try {
            // Update the check-in status to disable the button after the first click
            setCheckInStatus((prevStatus) => {
                const newStatus = { ...prevStatus, [statusKey]: true };
                // Persist check-in status in localStorage
                localStorage.setItem('checkInStatus', JSON.stringify(newStatus));
                return newStatus; // Return the updated status
            });
 
            // Fetch current slot availability from the API
            const slotResponse = await axios.get(`https://localhost:7253/gateway/ParkingSlots/${slotId}`);
            const currentAvailability = slotResponse.data.slotAvailability;
 
            if (currentAvailability > 0) {
                // Update the slot availability by decrementing it
                await updateSlotAvailability(slotId, currentAvailability - 1);
                showNotification('success', "Checked-In Successfully"); // Notify success
            } else {
                showNotification('error', "No available slots for this booking."); // Notify if no slots available
            }
        } catch (error) {
            console.error("Error updating slot availability:", error); // Log error if update fails
            showNotification('error', "Error updating slot availability. Please try again later.");
        }
    };
 
    // Handle the "Check Out" action, reset availability and navigate to payment
    const handleExit = async (slotId: number, userName: string) => {
        const statusKey = `${slotId}_${userName}`; // Unique key for each booking based on slotId and userName
 
        try {
            // Fetch current slot availability from the API
            const slotResponse = await axios.get(`https://localhost:7253/gateway/ParkingSlots/${slotId}`);
            const currentAvailability = slotResponse.data.slotAvailability;
 
            // Update the slot availability by incrementing it
            await updateSlotAvailability12(slotId, currentAvailability + 1);
            showNotification('success', "Checked-Out Successfully"); // Notify success
 
            // Update check-in status to enable check-in button again
            setCheckInStatus((prevStatus) => {
                const newStatus = { ...prevStatus, [statusKey]: false };
                // Persist updated status in localStorage
                localStorage.setItem('checkInStatus', JSON.stringify(newStatus));
                return newStatus; // Return the updated status
            });
 
            // Find the booking details for payment processing and navigate to payment page
            const bookingDetails = bookings.find(booking => booking.slotId === slotId && booking.userName === userName);
            if (bookingDetails) {
                navigate('/payNow', {
                    state: {
                        slotId: bookingDetails.slotId,
                        userName: bookingDetails.userName,
                        price: bookingDetails.price,
                        vehicleNumber: bookingDetails.vehicleNumber,
                    },
                });
            }
        } catch (error) {
            console.error("Error updating slot availability:", error); // Log error if update fails
            showNotification('error', "Error updating slot availability. Please try again later.");
        }
    };
 
    // Render loading or error messages if necessary
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
 
    // Render bookings table if data is loaded successfully
    return (
        <>
            <Userheader /> {/* Render the user header component */}
            <div className="bookings-table-container">
                <h2>Your Bookings</h2>
                <table className="bookings-table">
                    <thead>
                        <tr>
                            <th>Slot Id</th>
                            <th>User Name</th>
                            <th>Vehicle Number</th>
                            <th>Booking Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Price</th>
                            <th>Parking Slot Number</th>
                            <th>Entry</th>
                            <th>Exit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Render each booking as a table row */}
                        {bookings.map((booking, index) => (
                            <tr key={index}>
                                <td>{booking.slotId}</td>
                                <td>{booking.userName}</td>
                                <td>{booking.vehicleNumber}</td>
                                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                <td>{booking.startTime}</td>
                                <td>{booking.endtime}</td>
                                <td>{booking.price.toFixed(2)}</td>
                                <td>{booking.parkingSlotNumber}</td>
                                <td>
                                    {/* Check-in button, disabled if already checked in */}
                                    <button
                                        onClick={() => handleEntry(booking.slotId, booking.userName)}
                                        className="checkout-btn"
                                        disabled={checkInStatus[`${booking.slotId}_${booking.userName}`] ?? false}
                                    >
                                        Check IN
                                    </button>
                                </td>
                                <td>
                                    {/* Check-out button, enabled only if already checked in */}
                                    <button
                                        onClick={() => handleExit(booking.slotId, booking.userName)}
                                        className="checkout-btn"
                                        disabled={!(checkInStatus[`${booking.slotId}_${booking.userName}`] ?? false)}
                                    >
                                        Check OUT
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};
 
export default BookingsTable;
