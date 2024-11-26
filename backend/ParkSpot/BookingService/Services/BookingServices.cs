using BookingService.DBContext;
using BookingService.IRepository;
using BookingService.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingService.Services
{
    public class BookingServices : IBookingRepository
    {
        private readonly BookingDBContext _dbContext;

        public BookingServices(BookingDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Booking> AddBooking(Booking booking)
        {
            _dbContext.Bookings.Add(booking);
            await _dbContext.SaveChangesAsync();
            return booking;
        }

        public async Task<IEnumerable<Booking>> GetAllBookingsAsync()
        {
            return await _dbContext.Bookings.ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetAllBookingsByCustomerId(int customerId)
        {
            return await _dbContext.Bookings
                                   .Where(b => b.CustomerId == customerId)
                                   .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingById(int id)
        {
            return await _dbContext.Bookings
                                   .Where(b => b.BookingId == id)
                                   .ToListAsync();
        }

        public async Task<Booking> UpdateBooking(Booking booking)
        {
            var existingBooking = await _dbContext.Bookings.FindAsync(booking.BookingId);
            if (existingBooking != null)
            {
                _dbContext.Entry(existingBooking).CurrentValues.SetValues(booking);
                await _dbContext.SaveChangesAsync();
                return existingBooking;
            }
            return null;
        }


    }
}
