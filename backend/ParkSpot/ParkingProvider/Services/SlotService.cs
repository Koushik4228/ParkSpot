using ParkingProvider.Data_Context;
using ParkingProvider.IRepository;
using ParkingProvider.Models;
using Microsoft.EntityFrameworkCore;
using ParkingProvider.DTO;

namespace ParkingProvider.Services
{
    public class SlotService : ISlotRepository
    {

        private readonly ParkingSlotDbContext _context;

        public SlotService(ParkingSlotDbContext context)
        {
            _context = context;
        }

        public async  Task<ParkingSlots> AddSlots(ParkingSlots slot)
        {

            _context.Slots.Add(slot);
            await _context.SaveChangesAsync();
            return slot;
        }

        public async Task<bool> ApproveSlotAsync(int slotId)
        {
            var slot = await _context.Slots.FindAsync(slotId);
            if (slot == null || slot.Status != SlotStatus.Pending)
            {
                return false;
            }

            slot.Status = SlotStatus.Approved;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DecrementSlotAvailability(int id)
        {
            var slot = await _context.Slots.FindAsync(id);
            if (slot != null && slot.SlotAvailability > 0)
            {
                slot.SlotAvailability--;
                await _context.SaveChangesAsync();
                return true; // Decrement successful
            }
            return false; // Decrement failed (slot not found or no availability
        }

        public async  Task<bool> DeleteSlots(int id)
        {
            var slot = await _context.Slots.FindAsync(id);
            if (slot == null)
            {
                // Slot not found, return false or throw an exception
                return false; // or throw new KeyNotFoundException("Slot not found");
            }

            _context.Slots.Remove(slot);
            await _context.SaveChangesAsync();

            return true; // Indicate that the deletion was successful
        }

        public async Task<IEnumerable<ParkingSlots>> GetAllSlots()
        {
            return await _context.Slots.ToListAsync();
        }

        public async  Task<IEnumerable<ParkingSlots>> GetAvailableSlots(string location)
        {
            return await _context.Slots
                                   .Where(slot => slot.Location.ToLower().Contains(location.ToLower())) // Partial match
                                   .ToListAsync();
        }

        public async  Task<int?> GetSlotCostById(int id)
        {
            var slot = await _context.Slots.FindAsync(id);
            if (slot != null)
            {
                return slot.SlotPrice; // Assuming SlotPrice is an integer
            }
            return null; // If the slot is not found, return null
        }

        public async Task<ParkingSlots> GetSlotsById(int id)
        {
            return await _context.Slots.FindAsync(id);
        }

        // New method to get slots by owner
        public async Task<IEnumerable<ParkingSlots>> GetSlotsByOwner(int ownerId)
        {
            return await _context.Slots
                                 .Where(slot => slot.OwnerId == ownerId) // Assuming OwnerId is a property of ParkingSlots
                                 .ToListAsync();
        }



      

        public async  Task<bool> IncrementSlotAvailability(int id)
        {
            var slot = await _context.Slots.FindAsync(id);
            if (slot != null)
            {
                slot.SlotAvailability++;
                await _context.SaveChangesAsync();
                return true; // Increment successful
            }
            return false; // Increment failed (slot not found)
        }

        public async Task<bool> RejectSlotAsync(int slotId)
        {
            var slot = await _context.Slots.FindAsync(slotId);
            if (slot == null || slot.Status != SlotStatus.Pending)
            {
                return false;
            }

            slot.Status = SlotStatus.Rejected;
            await _context.SaveChangesAsync();
            return true;
        }



        public async Task<IEnumerable<ParkingSlots>> GetApprovedSlots()
        {
            return await _context.Slots
                                 .Where(slot => slot.Status == SlotStatus.Approved)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<ParkingSlots>> GetRejectedSlots()
        {
            return await _context.Slots
                                 .Where(slot => slot.Status == SlotStatus.Rejected)
                                 .ToListAsync();
        }





        public async Task<ParkingSlots> UpdateSlots(int id, ParkingSlots slot)
        {

            var existingSlot = await _context.Slots.FindAsync(id);
            if (existingSlot != null)
            {

              
                existingSlot.Location = slot.Location;
               
                existingSlot.SlotPrice = slot.SlotPrice;
                existingSlot.VehicleType = slot.VehicleType;
                existingSlot.TotalSlots = slot.TotalSlots;
                existingSlot.SlotAvailability = slot.SlotAvailability;
                existingSlot.Address = slot.Address;
                existingSlot.Longitude = slot.Longitude;
                existingSlot.Latitude = slot.Latitude;



                // Mark the entity as modified
                _context.Entry(existingSlot).State = EntityState.Modified;

                await _context.SaveChangesAsync(); // Save changes to the database 

                return existingSlot; // Return the updated doctor
            }
            return null; // Return null if the doctor was not found
        }

        public async Task<IEnumerable<LocationDTO>> GetAllLatLongsAsync()
        {
            var slots = await _context.Slots
                .Select(slot => new LocationDTO
                {
                    Latitude = slot.Latitude,
                    Longitude = slot.Longitude
                })
                .ToListAsync();

            return slots;
        }

        public async Task<LocationDTO> GetSlotLocationByIdAsync(int slotId)
        {
            var slotLocation = await _context.Slots
                .Where(s => s.SlotId == slotId)
                .Select(s => new LocationDTO
                {
                    Latitude = s.Latitude,
                    Longitude = s.Longitude
                })
                .FirstOrDefaultAsync();

            return slotLocation;
        }



    }
}
