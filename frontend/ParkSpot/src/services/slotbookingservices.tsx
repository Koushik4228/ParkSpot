
 
import axios from 'axios';

import { Slots } from '../Modal/slotbooking';

// import { Slot } from '../Components/Addslot/ViewSlot/viewslot'
 
 
// Define the base URL for the slots API
const BASE_URL = `https://localhost:7253/gateway/parkingslots`;
 
// Function to add a new slot
export const addSlot = async (newSlot: Slots) => {
  try {
    const response = await axios.post(`${BASE_URL}`, newSlot);
    return response.data;
  } catch (error) {
    console.error('Error adding slot:', error);
    throw error;
  }
};


const API_URL = 'https://localhost:7065/api/ParkingSlots/location/'; 

// Interface to represent the structure of slot details
export interface SlotDetails {
  latitude: number;
  longitude: number;
  // Add any other slot properties you may need
}

export const fetchSlotDetails = async (slotId: number): Promise<SlotDetails> => {
  try {
    // Make an API call to fetch slot details by slotId
    const response = await axios.get(`${API_URL}/slots/${slotId}`);

    // Assuming the response data is in the format { latitude, longitude }
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch slot details');
    }
  } catch (error) {
    console.error('Error fetching slot details:', error);
    throw error; // Rethrow error to be handled by the caller
  }
};
 
 