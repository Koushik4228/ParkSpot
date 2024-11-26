// src/components/EditProfile.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Accounts/Store/mystore';
import axios, { AxiosError } from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './EditProfile.css';

 // Import the service provider header
import DashHeader from '../ServiceProviderForm/Dashboardheader/dasheader';
import Userheader from '../UserForm/UserDashboardheader/Userheader';
import Footer from '../Footer/footer';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const role = useSelector((state: RootState) => state.user.role); // Fetch role from Redux state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<{ firstName: string; lastName: string; email: string; phoneNumber: string }>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const navigate = useNavigate(); // Initialize navigate


  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) {
        setLoading(false);
        setError('No user ID found');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7210/api/Account/GetById/${userId}`);
        setInitialValues({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
        });
      } catch (err) {
        const error = err as AxiosError;
        
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phoneNumber: Yup.string().required('Phone number is required').matches(/^\d+$/, 'Phone number must be numeric'),
  });

  const handleSubmit = async (values: { firstName: string; lastName: string; phoneNumber: string }) => {
    const { email, ...updatedData } = { ...initialValues, ...values }; // Merge with initial values, exclude email
    try {
      await axios.put(`https://localhost:7210/api/Account/UpdateUser/${userId}`, updatedData);
      
      // Show success notification
      notification.success({
        message: 'Profile Updated',
        description: 'Your profile has been updated successfully!',
      });

      // Navigate to home page
      navigate('/viewprofile'); // Replace with your actual home route
    } catch (err) {
      const error = err as AxiosError;
//setError(error.response?.data?.message || 'Failed to update user');
      notification.error({
        message: 'Update Failed',
//description: error.response?.data?.message || 'An error occurred while updating your profile.',
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    {role === 'service' ? <DashHeader /> : <Userheader />}
    <div className="profile-container">
      {/* Conditional header rendering */}
      <h2>Edit Profile</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {() => (
          <Form className="edit-profile-form">
            <div>
              <label>
                First Name:
                <Field type="text" name="firstName" required />
                <ErrorMessage name="firstName" component="div" className="error" />
              </label>
            </div>
            <div>
              <label>
                Last Name:
                <Field type="text" name="lastName" required />
                <ErrorMessage name="lastName" component="div" className="error" />
              </label>
            </div>
            <div>
              <label>
                Phone:
                <Field type="tel" name="phoneNumber" required />
                <ErrorMessage name="phoneNumber" component="div" className="error" />
              </label>
            </div>
            <button type="submit" className='editprofile-submit'>Save Changes</button>
          </Form>
        )}
      </Formik>
    </div>
    <Footer/>
    </>
  );
};

export default EditProfile;
