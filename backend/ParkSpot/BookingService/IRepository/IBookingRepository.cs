using BookingService.Model;

namespace BookingService.IRepository
{
    public interface IBookingRepository
    {

        Task<Booking> AddBooking(Booking booking);
        Task<Booking> UpdateBooking(Booking booking);
        Task<IEnumerable<Booking>> GetBookingById(int id);

      

        //Task<Booking> AprroveBooking(int bookingid);
        //Task<IEnumerable<Booking>> GetApprovedBookings();
        Task<IEnumerable<Booking>> GetAllBookingsAsync();

        Task<IEnumerable<Booking>> GetAllBookingsByCustomerId(int customerId);

    }

}

