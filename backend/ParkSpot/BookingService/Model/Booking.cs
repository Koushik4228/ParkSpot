using System.ComponentModel.DataAnnotations;

namespace BookingService.Model
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }
        public int SlotId { get; set; }
        public string UserName { get; set; }
        public string vehicleNumber { get; set; }
        public DateTime BookingDate { get; set; }
        public String StartTime { get; set; }
        public String Endtime { get; set; }
        public decimal Price { get; set; }
        public string ParkingSlotNumber { get; set; }

        public int CustomerId { get; set; }

        //public bool IsConfirmed { get; set; }
    }
}
