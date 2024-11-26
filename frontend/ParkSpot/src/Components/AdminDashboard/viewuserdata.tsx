import React, { useEffect, useState } from 'react'; // Import React and hooks (useEffect, useState)
import { getBookingsByUserId } from '../../services/bookingservice';  // Import the service function to fetch bookings
import './viewuserdata.css';  // Import the CSS file for styling

// Define the interface for Booking. Make sure this structure matches the data from your API
interface Booking {
    slotId: number;
    userName: string;
    vehicleNumber: string;
    bookingDate: string;  // Assuming booking date is a string in ISO format
    startTime: string;
    endtime: string;
    price: number;
    parkingSlotNumber: string;
}

const ViewUserData: React.FC = () => {
    // Declare state variables to manage bookings, loading state, and error messages
    const [bookings, setBookings] = useState<Booking[]>([]);  // State to hold the list of bookings
    const [loading, setLoading] = useState<boolean>(true);  // State to track loading status
    const [error, setError] = useState<string | null>(null);  // State to hold any error messages

    // useEffect hook to fetch the bookings data once the component mounts
    useEffect(() => {
        // Function to fetch the bookings data from the API
        const fetchBookings = async () => {
            try {
                const data = await getBookingsByUserId(1);  // Replace 1 with the dynamic user ID logic
                setBookings(data);

                // Initialize the check-in status to false for all bookings
                const initialStatus = data.reduce((acc: any, booking: Booking) => {
                    acc[booking.slotId] = false;
                    return acc;
                }, {});
            } catch (err: any) {
                // Handle different types of errors that may occur during the API request
                if (err?.response?.status === 404) {
                    setError("No bookings found for this user.");  // No bookings found for the user
                } else if (err?.response?.status === 500) {
                    setError("Internal server error. Please try again later.");  // Handle server-side error
                } else if (err?.response?.data?.message) {
                    // Handle custom error messages from the backend (e.g., validation errors)
                    setError(err.response.data.message);  // Set custom error message from the response
                } else {
                    setError("Failed to fetch bookings. Please check your connection.");  // Generic error message
                }
            } finally {
                setLoading(false);  // Ensure loading state is set to false after the API call completes
            }
        };

        fetchBookings();  // Call the function to fetch bookings when the component mounts
    }, []);  // Empty dependency array means this effect runs only once, when the component is first mounted

    if (loading) return <div>Loading...</div>;  // Show loading message while data is being fetched

    return (
        <div>
            {error && <h3 id='j1' style={{ color: 'red', marginTop: '20px' }}>{error}</h3>}  {/* Display error message if present */}
            
            {/* Container for the table displaying user bookings */}
            <div className="unique-bookings-table-container">
                <h2 style={{ marginLeft: '100px', marginTop: '70px' }}>User Bookings</h2>
                
                {/* Display a table with booking details */}
                <table className="unique-bookings-table">
                    <thead>
                        <tr>
                            {/* Table headers for the different booking properties */}
                            <th>Slot Id</th>
                            <th>User Name</th>
                            <th>Vehicle Number</th>
                            <th>Booking Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Price</th>
                            <th>Parking Slot Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? (
                            // If there are bookings, map over them and display each booking in a table row
                            bookings.map((booking, index) => (
                                <tr key={index}>
                                    <td>{booking.slotId}</td>  {/* Display the slotId */}
                                    <td>{booking.userName}</td>  {/* Display the user's name */}
                                    <td>{booking.vehicleNumber}</td>  {/* Display the vehicle number */}
                                    <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>  {/* Format the booking date */}
                                    <td>{booking.startTime}</td>  {/* Display the start time */}
                                    <td>{booking.endtime}</td>  {/* Display the end time */}
                                    <td>{booking.price.toFixed(2)}</td>  {/* Display price (fixed to 2 decimal places) */}
                                    <td>{booking.parkingSlotNumber}</td>  {/* Display the parking slot number */}
                                </tr>
                            ))
                        ) : (
                            // If no bookings are available, show a message in the table
                            <tr>
                                <td colSpan={8}>No bookings found.</td>  {/* Span across all columns if no bookings */}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewUserData;  // Export the component to be used elsewhere in the app
