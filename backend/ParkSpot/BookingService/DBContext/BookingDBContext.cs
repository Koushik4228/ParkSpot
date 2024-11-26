using BookingService.Model;
using Microsoft.EntityFrameworkCore;

namespace BookingService.DBContext
{
    public class BookingDBContext : DbContext
    {
        public BookingDBContext(DbContextOptions<BookingDBContext> options) : base(options)
        {
        }
        public DbSet<Booking> Bookings { get; set; }
    }
}
