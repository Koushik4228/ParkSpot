import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Accounts/Store/mystore';
import './ViewProfile.css'; 
import DashHeader from '../ServiceProviderForm/Dashboardheader/dasheader';
import Userheader from '../UserForm/UserDashboardheader/Userheader';
import Footer from '../Footer/footer';
import defaultAvatar from '../../Images/OIP.jpg'; // Adjust path based on your structure

const ViewProfile: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const role = useSelector((state: RootState) => state.user.role);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`https://localhost:7210/api/Account/GetById/${userId}`);
          if (!response.ok) {
            throw new Error('User not found');
          }
          const data = await response.json();
          setUserDetails(data);
        } catch (err) {
          
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    } else {
      setLoading(false);
      setError('No user ID found');
    }
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log('User Details:', userDetails); // Debugging line

  return (
    <>
      {role === 'service' ? <DashHeader /> : <Userheader />}
      <div className="profile-container">
        <h2>Profile Details</h2>
        {userDetails && (
          <div className="profile-card">
            <div className="profile-image">
              <img 
                src={defaultAvatar} 
                alt="Profile Avatar" 
                style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
              />
            </div>
            <div className="profile-info">
              <h3>Hey! {userDetails.firstName} {userDetails.lastName}</h3>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Phone:</strong> {userDetails.phoneNumber}</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ViewProfile;
