using Microsoft.EntityFrameworkCore;
using ParkingProvider.Models;

namespace ParkingProvider.Data_Context
{
    public class ParkingSlotDbContext : DbContext
    {
        public ParkingSlotDbContext(DbContextOptions options) : base(options)
        {
        }

       public  DbSet<ParkingSlots> Slots { get; set; }
    }
}
