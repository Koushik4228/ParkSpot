import { Booking } from "../Modal/booking";
import axios from "axios";
const API_URL = `https://localhost:7253/gateway/Booking`;
 


// //Add booking using Axios
export const addBooking = async (newBooking: Booking): Promise<Booking> => {
  console.log(newBooking);
  
  
  const response = await axios.post(API_URL, newBooking);
  console.log(response.data);

  // After booking, update the availability slots
  // await updateSlotAvailability(slotId, slotAvailability - 1);
  
  return response.data;
};
 
 

 
 
 
 
 
 


export const updateSlotAvailability = async (slotId: number, updatedAvailability: number) => {
  try {
      const response = await axios.put(`https://localhost:7253/gateway/ParkingSlots/decrement/${slotId}`, {
        slotAvailability: updatedAvailability,
      });
      console.log(response.data);
      
      return response.data;
  } catch (error) {
      console.error("Failed to update slot availability:", error);
      throw error;
  }
};

export const updateSlotAvailability12 = async (slotId: number, updatedAvailability: number) => {
  try {
      const response = await axios.put(`https://localhost:7253/gateway/ParkingSlots/increment/${slotId}`, {
        slotAvailability: updatedAvailability,
      });
      console.log(response.data);
      
      return response.data;
  } catch (error) {
      console.error("Failed to update slot availability:", error);
      throw error;
  }
};


export const getBookingsByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`https://localhost:7253/gateway/Booking/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};
