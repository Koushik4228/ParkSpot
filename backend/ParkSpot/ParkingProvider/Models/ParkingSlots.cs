using System.ComponentModel.DataAnnotations;

namespace ParkingProvider.Models
{



    public enum SlotStatus
    {
        Pending,   // The slot is pending approval
        Approved,  // The slot has been approved
        Rejected   // The slot has been rejected
    }


    public class ParkingSlots
    {

        [Key]
        public int SlotId { get; set; }
          
        public string Location { get; set; }     // Location of the parking slot
        public int SlotPrice { get; set; }

        public int OwnerId { get; set; }

        public string VehicleType { get; set; }

        public int TotalSlots { get; set; }

        public int SlotAvailability { get; set; }

        public string Address { get; set; }

        public float Longitude { get; set; }

        public float Latitude { get; set; }

        public SlotStatus Status { get; set; } // Add status property

    }
}
