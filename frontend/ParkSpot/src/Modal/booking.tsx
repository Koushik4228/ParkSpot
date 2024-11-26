// models/Booking.ts
export interface Booking {
    slotId:number;
    bookingId: number;
    userName: string;
    vehicleNumber: string;
    bookingDate: Date;       // Date for the full date value
    startTime: string;       // Time only, formatted as "HH:mm" or "HH:mm:ss"
    endTime: string;         // Time only, formatted as "HH:mm" or "HH:mm:ss"
    price: number;
    parkingSlotNumber:string;
    customerId:number;
  }