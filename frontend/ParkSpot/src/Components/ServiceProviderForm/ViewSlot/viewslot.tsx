import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './viewslot.css'; // CSS for styling
import DashHeader from '../Dashboardheader/dasheader'; // Dashboard header component
import { Modal, notification } from 'antd'; // Ant Design components for modal and notifications
import { useSelector } from 'react-redux';
import { RootState } from '../../Accounts/Store/mystore'; // Import RootState for Redux state type
import Footer from '../../Footer/footer'; // Footer component

// Define the structure of a Slot object
export interface Slot {
  slotId: string;
  location: string;
  slotPrice: number;
  vehicleType: string;
  slotAvailability: number;
  totalSlots: number;
  address: string;
  longitude: number;
  latitude: number;
}

// Yup schema for form validation
const validationSchema = Yup.object().shape({
  location: Yup.string().required('Location is required'),
  slotPrice: Yup.number().required('Price is required').positive('Price must be a positive number'),
  vehicleType: Yup.string().required('Vehicle type is required'),
  totalSlots: Yup.number().required('Number of slots is required').positive('Total slots must be positive'),
  slotAvailability: Yup.number().required('Availability is required').positive('Availability must be a positive number').integer('Availability must be an integer'),
  address: Yup.string().required('Address is required'),
});

// Main component for managing slots
const SlotsManager: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]); // State for storing all slots
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]); // State for filtered slots
  const [currentSlot, setCurrentSlot] = useState<Slot | null>(null); // State for currently selected slot for editing
  const [open, setOpen] = useState(false); // State for modal visibility
  const [loading, setLoading] = useState(true); // State to manage loading spinner

  const userId = useSelector((state: RootState) => state.user.userId); // Fetch userId from Redux store
  console.log(userId);

  // Fetch slots from the API whenever the component mounts or userId changes
  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://localhost:7253/gateway/ParkingSlots/owner/${userId}`);
        console.log('Fetched Slots:', response.data);
        
        setSlots(response.data); // Set fetched slots to slots state
        setFilteredSlots(response.data); // Set filtered slots to the same data initially
      } catch (error) {
        console.error('Error fetching slots:', error);
      } finally {
        setLoading(false); // Hide loading spinner after data fetch
      }
    };
    fetchSlots();
  }, [userId]);

  // Open the edit modal and set the selected slot for editing
  const handleEdit = (slot: Slot) => {
    setCurrentSlot(slot);
    setOpen(true);
  };

  // Delete slot with confirmation dialog
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this slot?',
      onOk: async () => {
        try {
          await axios.delete(`https://localhost:7253/gateway/ParkingSlots/${id}`); // Call API to delete slot
          
          // Update state to remove the deleted slot
          setSlots((prevSlots) => prevSlots.filter((slot) => slot.slotId !== id));
          setFilteredSlots((prevFilteredSlots) => prevFilteredSlots.filter((slot) => slot.slotId !== id));
          
          notification.success({
            message: 'Success',
            description: 'Slot deleted successfully',
          });
        } catch (error) {
          console.error('Error deleting slot:', error);
        }
      },
    });
  };

  // Handle form submission to update a slot
  const handleSubmit = async (values: Omit<Slot, 'slotId'>) => {
    if (!currentSlot) return; 
    const updatedSlot: Slot = { ...values, slotId: currentSlot.slotId }; // Update slot data
    console.log(currentSlot);
    
    try {
      await axios.put(`https://localhost:7253/gateway/ParkingSlots/${currentSlot.slotId}`, updatedSlot);
      
      // Update slot data in component state
      setSlots(slots.map(slot => (slot.slotId === currentSlot.slotId ? updatedSlot : slot)));
      setFilteredSlots(filteredSlots.map(slot => (slot.slotId === currentSlot.slotId ? updatedSlot : slot)));
      
      setCurrentSlot(null);
      setOpen(false); // Close edit modal
      notification.success({
        message: 'Success',
        description: 'Slot updated successfully',
      });
    } catch (error) {
      console.error('Error updating slot:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update slot',
      });
    }
  };

  return (
    <> 
      <DashHeader /> {/* Render dashboard header */}
      <Container maxWidth="md" className="slots-manager-container">
        <Typography variant="h4" className="slots-manager-title">
          Manage Slots
        </Typography> 

        {/* Display loading message or list of slots */}
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={2}>
            {filteredSlots.length > 0 ? (
              filteredSlots.map((slot) => (
                <Grid item xs={12} sm={6} md={4} key={slot.slotId}>
                  <Card className="slots-manager-card">
                    <CardContent>
                      {/* Display slot details */}
                      <Typography>Location: {slot.location}</Typography>
                      <Typography>Address: {slot.address}</Typography>
                      <Typography>Latitude: {slot.latitude}</Typography>
                      <Typography>Longitude: {slot.longitude}</Typography>
                      <Typography>Price: {slot.slotPrice}</Typography>
                      <Typography>Total Slots: {slot.totalSlots}</Typography>
                      <Typography>Availability: {slot.slotAvailability}</Typography>
                      <Typography>Vehicle Type: {slot.vehicleType}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button onClick={() => handleEdit(slot)} style={{ backgroundColor: '#f7ca4e', color: 'black' }}>Edit</Button>
                      <Button onClick={() => handleDelete(slot.slotId)} style={{ backgroundColor: '#f7ca4e', color: 'black' }}>Delete</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No slots found.</Typography>
            )}
          </Grid>
        )}

        {/* Edit Slot Dialog with Formik form for slot editing */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            style: {
              width: '600px',
              maxWidth: '90%',
            },
          }}
        >
          <DialogTitle>Edit Slot</DialogTitle>
          <DialogContent>
            {currentSlot && (
              <Formik
                initialValues={{ ...currentSlot }} // Initialize form with current slot data
                validationSchema={validationSchema} // Use validation schema
                onSubmit={handleSubmit}
              >
                {({ handleChange, handleBlur, setFieldValue }) => (
                  <Form>
                    <Box className="slots-manager-form-box">
                      {/* Form fields for each slot attribute */}
                      <Field
                        name="location"
                        as={TextField}
                        label="Location"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="location" component="div" className="error-message" />

                      <Field
                        name="latitude"
                        as={TextField}
                        label="Latitude"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="latitude" component="div" className="error-message" />

                      <Field
                        name="longitude"
                        as={TextField}
                        label="Longitude"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="longitude" component="div" className="error-message" />

                      <Field
                        name="slotPrice"
                        as={TextField}
                        label="Price"
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="slotPrice" component="div" className="error-message" />

                      <Field
                        name="vehicleType"
                        as={TextField}
                        label="Vehicle Type"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="vehicleType" component="div" className="error-message" />

                      <Field
                        name="totalSlots"
                        as={TextField}
                        label="Total Slots"
                        type="number"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = Number(e.target.value);
                          setFieldValue("totalSlots", value); // Update total slots value
                          setFieldValue("slotAvailability", value); // Sync availability with total slots
                        }}
                        onBlur={handleBlur}
                        required                       
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="totalSlots" component="div" className="error-message" />

                      <Field
                        name="slotAvailability"
                        as={TextField}
                        label="Availability"
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        disabled // Read-only field
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="slotAvailability" component="div" className="error-message" />

                      <Field
                        name="address"
                        as={TextField}
                        label="Address"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                      <ErrorMessage name="address" component="div" className="error-message" />

                      <Box mt={2}>
                        <Button type="submit" variant="outlined" style={{ backgroundColor: '#f7ca42', color: 'black' }}>
                          Update Slot
                        </Button>
                      </Box>
                    </Box>
                  </Form>
                )}
              </Formik>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </>
  );
};

export default SlotsManager;
