import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Booking } from '../../../Modal/booking';
import { addBooking } from '../../../services/bookingservice';
import { useNavigate, useLocation } from 'react-router-dom';
import Userheader from "../UserDashboardheader/Userheader";
import './userbooking.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../Accounts/Store/mystore'; // Import the RootState type for Redux state
import Footer from '../../Footer/footer';

import { fetchSlotDetails } from '../../../services/slotbookingservices'; // Import service to fetch slot details
import MapComponent from './MapComponentuser'; // Import Map Component to display location on the map

// Define form validation schema for user inputs
const validationSchema = Yup.object({
  userName: Yup.string()
    .required('User Name is required')
    .min(3, 'User Name must be at least 3 characters'),
  
  vehicleNumber: Yup.string()
    .required('Vehicle Number is required')
    .matches(/^[a-zA-Z0-9]*$/, 'Vehicle Number must contain only alphabets and numbers')
    .max(10, 'Vehicle Number must be at most 10 characters long'),
  
  bookingDate: Yup.string()
    .required('Booking Date is required')
    .test('not-past', 'Booking Date cannot be a past date', (value) => {
      if (!value) return false; // Check if value is empty

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set today’s date to midnight for comparison

      const bookingDate = new Date(value);
      bookingDate.setHours(0, 0, 0, 0); // Set booking date to midnight

      return bookingDate >= today; // Ensure booking date is today or future date
    }),
  
  startTime: Yup.string()
    .required('Start Time is required'),
  
  endTime: Yup.string()
    .required('End Time is required'),
});

// Calculate the time difference between start and end times for pricing
const calculateTimeDifference = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return 0;
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  return diffHours > 0 ? diffHours : 0; // Return positive time difference
};

// Display time difference and price based on slot price
const TimeDifferenceAndPrice = ({ slotPrice }: { slotPrice: number }) => {
  const { values, setFieldValue } = useFormikContext<Booking>();
  const timeDifference = calculateTimeDifference(values.startTime, values.endTime);

  useEffect(() => {
    const calculatedPrice = timeDifference * slotPrice;
    setFieldValue('price', calculatedPrice); // Update price field with calculated price
  }, [timeDifference, slotPrice, setFieldValue]);

  return (
    <div className="booking-form-field-time-difference">
      <div className="time-difference">Time Difference: {timeDifference} hour(s)</div>
      <div className="booking-form-field-price">
        <label htmlFor="price" className="booking-form-label-price">Price</label>
        <Field type="text" id="price" name="price" className="booking-form-input" readOnly />
      </div>
    </div>
  );
};

const UserBooking: React.FC = () => {
  const navigate = useNavigate();
  const locatioon = useLocation();
  const { slotId, slotPrice, longitude, latitude, location } = locatioon.state || {}; // Get slot details from navigation state
  const [parkingSlotNumber] = useState(`PARK-${Math.floor(Math.random() * 10000)}`); // Generate a unique parking slot number
  const [step, setStep] = useState(1); // Track form step for multi-step navigation
  const [setSlotDetails] = useState<any>(null); // State to hold slot details (latitude, longitude)
  const userId = useSelector((state: RootState) => state.user.userId); // Retrieve user ID from Redux state

  // Define initial form values
  const initialValues: Booking = {
    userName: '',
    vehicleNumber: '',
    bookingDate: new Date(),
    startTime: '',
    endTime: '',
    price: 0,
    parkingSlotNumber: '',
    slotId: 0,
    bookingId: 0,
    customerId: userId || 0
  };

  // Fetch slot details if slotId is provided
  useEffect(() => {
    if (slotId) {
      const getSlotDetails = async () => {
        const details = await fetchSlotDetails(slotId);
        setSlotDetails(details);
      };
      getSlotDetails();
    }
  }, [slotId]);

  // Handle form submission to add booking and navigate to thank you page
  const handleSubmit = async (values: Booking, { resetForm }: any) => {
    await addBooking({ ...values, parkingSlotNumber, customerId: userId || 0 });
    resetForm();
    navigate("/thank-you");
  };

  // Render different form steps
  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="booking-form-field-user-name">
              <label htmlFor="userName" className="booking-form-label-user-name">User Name</label>
              <Field type="text" name="userName" placeholder="Enter your name" className="booking-form-input" />
              <ErrorMessage name="userName" component="div" className="booking-form-error" />
            </div>
            <div className="booking-form-field-vehicle-number">
              <label htmlFor="vehicleNumber" className="booking-form-label-vehicle-number">Vehicle Number</label>
              <Field type="text" name="vehicleNumber" placeholder="Enter vehicle number" className="booking-form-input" />
              <ErrorMessage name="vehicleNumber" component="div" className="booking-form-error" />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="booking-form-field-booking-date">
              <label htmlFor="bookingDate" className="booking-form-label-booking-date">Booking Date</label>
              <Field type="date" name="bookingDate" className="booking-form-input" />
              <ErrorMessage name="bookingDate" component="div" className="booking-form-error" />
            </div>
            <div className="booking-form-field-start-time">
              <label htmlFor="startTime" className="booking-form-label-start-time">Start Time</label>
              <Field type="time" name="startTime" className="booking-form-input" />
              <ErrorMessage name="startTime" component="div" className="booking-form-error" />
            </div>
            <div className="booking-form-field-end-time">
              <label htmlFor="endTime" className="booking-form-label-end-time">End Time</label>
              <Field type="time" name="endTime" className="booking-form-input" />
              <ErrorMessage name="endTime" component="div" className="booking-form-error" />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <TimeDifferenceAndPrice slotPrice={slotPrice} />
            <div className="booking-form-field-parking-slot-number">
              <label htmlFor="parkingSlotNumber" className="booking-form-label-parking-slot-number">Parking Slot Number</label>
              <Field type="text" name="parkingSlotNumber" value={parkingSlotNumber} readOnly className="booking-form-input" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Userheader />
      <div className="form-container-booking">
        <div className="booking-layout">
          <div className="image-container">
            <img src="src\Images\userdashboard.png" alt="Booking" className="booking-image" />
          </div>
          <div className="form-container">
            <Formik
              initialValues={{ ...initialValues, slotId }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="booking-form-structure">
                  {renderStepContent(step)}
                  <div className="navigation-buttons">
                    {step > 1 && (
                      <button
                        type="button"
                        className="navigation-button"
                        onClick={() => setStep(step - 1)}
                      >
                        Previous
                      </button>
                    )}
                    {step < 3 && (
                      <button
                        type="button"
                        className="navigation-button"
                        onClick={() => setStep(step + 1)}
                      >
                        Next
                      </button>
                    )}
                    {step === 3 && (
                      <button
                        type="submit"
                        className="booking-form-submit-button"
                        disabled={isSubmitting}
                      >
                        Add Booking
                      </button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      {/* Render the Map Component with latitude and longitude if available */}
      {longitude && latitude && (
        <div className="map-containernew">
          <MapComponent latitude={latitude} longitude={longitude} />
        </div>
      )}
    </>
  );
};

export default UserBooking;
