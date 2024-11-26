using ParkingProvider.DTO;
using ParkingProvider.Models;
using static System.Reflection.Metadata.BlobBuilder;

namespace ParkingProvider.IRepository
{
    public interface ISlotRepository
    {

        Task<LocationDTO> GetSlotLocationByIdAsync(int slotId);
        Task<IEnumerable<ParkingSlots>> GetAllSlots();
        Task<ParkingSlots> GetSlotsById(int id);
        Task<ParkingSlots> AddSlots(ParkingSlots slot);
        Task<ParkingSlots> UpdateSlots(int id, ParkingSlots slot);
        Task<bool> DeleteSlots(int id);

        Task<IEnumerable<ParkingSlots>> GetSlotsByOwner(int ownerId);

        Task<IEnumerable<LocationDTO>> GetAllLatLongsAsync();

        Task<IEnumerable<ParkingSlots>> GetAvailableSlots(string SlotLocation);

        Task<int?> GetSlotCostById(int id);

        // New methods for managing slot availability
        Task<bool> DecrementSlotAvailability(int id);

        Task<bool> IncrementSlotAvailability(int id);

        Task<IEnumerable<ParkingSlots>> GetApprovedSlots();
        Task<IEnumerable<ParkingSlots>> GetRejectedSlots();


        // For Approval and Reject ss

        Task<bool> ApproveSlotAsync(int slotId); 
        Task<bool> RejectSlotAsync(int slotId);
    }
}
