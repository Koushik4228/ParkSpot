import { Link, Outlet } from 'react-router-dom'; // Import Link and Outlet for navigation and nested routing
import './admindashboard.css'; // Import CSS for styling the admin dashboard
import AdminHeader from './Adminheader/Adminheader'; // Import AdminHeader component for consistent header
import Footer from '../Footer/footer'; // Import Footer component to be included in the dashboard

// AdminDashboard Component
function AdminDashboard() {
    return (
        <>
            <AdminHeader /> {/* Render AdminHeader component to show consistent header across the admin pages */}
            
            <div className="admin-dashboard"> {/* Main container for the admin dashboard layout */}
                
                {/* Dashboard header section */}
                <header className="dashboard-header">
                    <h2>Admin Dashboard</h2> {/* Title of the admin dashboard */}
                    
                    <div className="button-container"> {/* Container for navigation buttons */}
                        
                        {/* Button for navigating to User Booking Details */}
                        <div className="button-item">
                            <button type="button" className="dashboard-button">
                                <Link to='userbookingdetails' className='adminnav'> User Bookings </Link>
                            </button>
                        </div>

                        {/* Button for navigating to Service Providers Data (currently commented out) */}
                        {/* <div className="button-item">
                            <button type="button" className="dashboard-button">
                                <Link to='viewserviceproviderdata' className='adminnav'> Service Providers Data</Link>
                            </button>
                        </div> */}
                        
                        {/* Button for navigating to User Feedback */}
                        <div className="button-item">
                            <button type="button" className="dashboard-button">
                                <Link to='viewuserfeedback' className='adminnav'> Users Feedback</Link>
                            </button>
                        </div>

                        {/* Button for navigating to Service Approval (Admin Slot Management) */}
                        <div className="button-item">
                            <button type="button" className="dashboard-button">
                                <Link to='adminslotmanagement' className='adminnav'> Service Approval </Link>
                            </button>
                        </div>

                        {/* Button for navigating to Users Statistics */}
                        <div className="button-item">
                            <button type="button" className="dashboard-button">
                                <Link to='statistics' className='adminnav'> Users Statistics</Link>
                            </button>
                        </div>

                    </div>
                </header>

                {/* The content section that will render the nested route components */}
                <div className="dashboard-content">
                    <Outlet /> {/* This is where nested routes (like user booking details, feedback, etc.) will be rendered */}
                </div>

            </div>

        </>
    );
}

export default AdminDashboard; // Export the AdminDashboard component to be used in other parts of the application
