import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { Slots } from '../../../Modal/slotbooking'; // Defines the Slots type interface
import { addSlot } from '../../../services/slotbookingservices'; // Function to add a slot to the booking service
import DashHeader from '../Dashboardheader/dasheader'; // Header component for the dashboard
import axios from 'axios';
import AsyncSelect from 'react-select/async';  // AsyncSelect component for async data fetching

import './AddSlot.css'; // CSS file for styling
import { useSelector } from 'react-redux';
import { RootState } from '../../Accounts/Store/mystore'; // Root state type for Redux store
import Footer from '../../Footer/footer'; // Footer component

// Yup validation schemas for each step in the form
const validationSchemaStep1 = Yup.object().shape({
  Location: Yup.string().required('Location is required').min(3).max(100),
  Address: Yup.string().required('Address is required').min(10).max(200),
});

const validationSchemaStep2 = Yup.object().shape({
  VehicleType: Yup.string().required('Vehicle type is required').min(3).max(30),
  SlotPrice: Yup.number().required('Price is required').positive().max(10000),
});

const validationSchemaStep3 = Yup.object().shape({
  TotalSlots: Yup.number().required('Total slots are required').positive().integer().max(100),
  SlotAvailability: Yup.number().required('Availability is required').positive().integer().max(100),
});

const AddSlot: React.FC = () => {
  const navigate = useNavigate(); // Navigation hook for redirection
  const [currentStep, setCurrentStep] = useState(0); // Track current step of form
  const [address, setAddress] = useState<string | null>(null); // State to hold selected address
  const [latitude, setLatitude] = useState<number | null>(null); // State for latitude of selected address
  const [longitude, setLongitude] = useState<number | null>(null); // State for longitude of selected address
  const userId = useSelector((state: RootState) => state.user.userId); // Fetch user ID from Redux store

  // Fetch address data from OpenStreetMap based on user input
  const handleAddressSearch = async (inputValue: string) => {
    if (!inputValue) return [];  // Return empty if no input

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}&addressdetails=1&limit=5`
      );
      // Map response data to format expected by AsyncSelect
      return response.data.map((item: any) => ({
        label: item.display_name,  // Full address as label
        value: item,               // Full geolocation data as value
      }));
    } catch (error) {
      console.error('Error fetching address from OpenStreetMap:', error);
      return [];
    }
  };

  // Handle address selection
  const handleSelectAddress = (selectedOption: any, setFieldValue: any) => {
    if (selectedOption) {
      const { lat, lon } = selectedOption.value;
      setLatitude(Number(lat));   // Set latitude state
      setLongitude(Number(lon));  // Set longitude state
      setAddress(selectedOption.label); // Set address state
      setFieldValue('Address', selectedOption.label); // Set Formik field for address
      setFieldValue('Latitude', Number(lat));
      setFieldValue('Longitude', Number(lon));
    }
  };

  // Form submission handler
  const handleSubmit = async (values: Omit<Slots, 'id'>) => {
    const newSlot: Slots = {
      ...values,
      id: uuidv4(), // Generate unique ID
      Ownerid: userId || 0, // Set owner ID
      Latitude: latitude || 0,   // Set latitude
      Longitude: longitude || 0, // Set longitude
    };

    try {
      const response = await addSlot(newSlot); // Call addSlot service function
      if (response) {
        navigate('/viewbooking'); // Redirect to view booking page on success
      }
    } catch (error) {
      console.error('Error adding slot:', error);
    }
  };

  // Proceed to the next form step
  const nextStep = () => setCurrentStep((prev) => prev + 1);

  return (
    <>
      <DashHeader /> {/* Render dashboard header */}
      <Container id="add-slot-container">
        <div className="addslot-image">
          <img src={'src/Images/Designer (1).jpeg'} alt="Description" style={{ width: '100%', height: '400px', borderRadius: '8px' }} />
        </div>
        <div id="form-wrapper">
          <div id="form-container">
            {currentStep === 0 && ( // Display title on first step only
              <Typography variant="h4" id="add-slot-title" align="center">
                Add New Slot
              </Typography>
            )}
            <Formik
              initialValues={{
                Location: '',
                Address: address || '',  // Initialize Address
                Latitude: latitude || 0,  // Initialize Latitude
                Longitude: longitude || 0, // Initialize Longitude
                VehicleType: '',
                SlotPrice: 0,
                TotalSlots: 0,
                SlotAvailability: 0,
                Ownerid: userId || 0,
              }}
              validationSchema={
                currentStep === 0 ? validationSchemaStep1 :
                currentStep === 1 ? validationSchemaStep2 :
                validationSchemaStep3
              }
              onSubmit={currentStep === 2 ? handleSubmit : nextStep} // Submit on last step; otherwise proceed to next step
            >
              {({ handleChange, handleBlur, setFieldValue }) => (
                <Form>
                  <div>
                    {currentStep === 0 && ( // Fields for Step 1
                      <>
                        <div>
                          <label htmlFor="Location" className="form-label">Location</label>
                          <Field name="Location" id="Location" type="text" className="form-input" onChange={handleChange} onBlur={handleBlur} required />
                          <ErrorMessage name="Location" component="div" className="error-message" />
                        </div>
                         
                        <div>
                          <label htmlFor="Address" className="form-label">Address</label>
                          <AsyncSelect
                            id="Address"
                            name="Address"
                            className="form-input"
                            cacheOptions
                            loadOptions={handleAddressSearch}  // Fetch options asynchronously
                            onChange={(selectedOption) => handleSelectAddress(selectedOption, setFieldValue)}  // Handle address selection
                            getOptionLabel={(e: any) => e.label} // Display full address
                            value={address ? { label: address, value: { display_name: address, lat: latitude, lon: longitude } } : null} // Set current address as selected value
                            required
                          />
                          {address && <div className="selected-address">{address}</div>}
                          <ErrorMessage name="Address" component="div" className="error-message" />
                        </div>
                      </>
                    )}
                    {currentStep === 1 && ( // Fields for Step 2
                      <>
                        <div>
                          <label htmlFor="VehicleType" className="form-label">Vehicle Type</label>
                          <Field name="VehicleType" id="VehicleType" type="text" className="form-input" onChange={handleChange} onBlur={handleBlur} required />
                          <ErrorMessage name="VehicleType" component="div" className="error-message" />
                        </div>
                        <div>
                          <label htmlFor="SlotPrice" className="form-label">Price</label>
                          <Field name="SlotPrice" id="SlotPrice" type="number" className="form-input" onChange={handleChange} onBlur={handleBlur} required />
                          <ErrorMessage name="SlotPrice" component="div" className="error-message" />
                        </div>
                      </>
                    )}
                    {currentStep === 2 && ( // Fields for Step 3
                      <>
                        <div>
                          <label htmlFor="TotalSlots" className="form-label">Total Slots</label>
                          <Field
                            name="TotalSlots"
                            id="TotalSlots"
                            type="number"
                            className="form-input"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const value = Number(e.target.value);
                              setFieldValue('TotalSlots', value); // Set total slots
                              setFieldValue('SlotAvailability', value); // Set slot availability to total slots
                            }}
                            onBlur={handleBlur}
                            required
                          />
                          <ErrorMessage name="TotalSlots" component="div" className="error-message" />
                        </div>
                        <div>
                          <label htmlFor="SlotAvailability" className="form-label">Availability</label>
                          <Field
                            name="SlotAvailability"
                            id="SlotAvailability"
                            type="number"
                            className="form-input"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            disabled
                            InputProps={{ readOnly: true }}
                          />
                          <ErrorMessage name="SlotAvailability" component="div" className="error-message" />
                        </div>
                      </>
                    )}
                    <div>
                      {currentStep > 0 && ( // Render Back button if not on first step
                        <button
                          type="button"
                          className='back-btn'
                          onClick={() => setCurrentStep((prev) => prev - 1)}
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        className='addslot-button'
                        style={{ marginLeft: '10px' }}
                      >
                        {currentStep === 2 ? 'Add Slot' : 'Next' }
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Container>
     <Footer/>
    </>
  );
};

export default AddSlot;
