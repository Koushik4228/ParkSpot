using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ParkingProvider.DTO;
using ParkingProvider.IRepository;
using ParkingProvider.Models;
using ParkingProvider.Services;
using static System.Reflection.Metadata.BlobBuilder;

namespace ParkingProvider.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParkingSlotsController : ControllerBase
    {
        private readonly ISlotRepository _slotRepository;

        public ParkingSlotsController(ISlotRepository slotRepository)
        {
            _slotRepository = slotRepository;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<ParkingSlots>>> GetAllSlot()
        {
            var slots = await _slotRepository.GetAllSlots();
            return Ok(slots);
        }

        [HttpGet("latlongs")]
        public async Task<IActionResult> GetAllLatLongs()
        {
            var latLongs = await _slotRepository.GetAllLatLongsAsync();
            return Ok(latLongs);
        }

        [HttpGet("location/{slotId}")]
        public async Task<ActionResult<LocationDTO>> GetSlotLocationAsync(int slotId)
        {
            try
            {
                var slotLocation = await _slotRepository.GetSlotLocationByIdAsync(slotId);
                if (slotLocation == null)
                {
                    return NotFound(); // Slot not found
                }
                return Ok(slotLocation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<ParkingSlots>> GetSlotById(int id)
        {
            var slot = await _slotRepository.GetSlotsById(id);
            if (slot == null)
            {
                return NotFound();
            }
            return Ok(slot);
        }

        // POST: api/slot
        [HttpPost]
        public async Task<ActionResult<ParkingSlots>> AddSlot([FromBody] ParkingSlots slot)
        {
            if (slot == null)
            {
                return BadRequest("Slot cannot be null.");
            }

            var createdSlot = await _slotRepository.AddSlots(slot);
            return CreatedAtAction(nameof(GetSlotById), new { id = createdSlot.SlotId }, createdSlot);
        }


       


        // GET: api/slot/available?location={location}
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<ParkingSlots>>> GetAvailableSlot([FromQuery] string location)
        {
            var slots = await _slotRepository.GetAvailableSlots(location);
            return Ok(slots);
        }


        // DELETE: api/slot/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSlot(int id)
        {
            var existingSlot = await _slotRepository.GetSlotsById(id);
            if (existingSlot == null)
            {
                return NotFound();
            }

            await _slotRepository.DeleteSlots(id);
            return NoContent();
        }


        // PUT: api/slot/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Updateslot(int id, ParkingSlots slot)
        {
            if (id != slot.SlotId)
            {
                return BadRequest(); // Return HTTP 400 if the ID in the request does not match the Slot ID
            }

            var updatedSlot = await _slotRepository.UpdateSlots(id, slot);
            if (updatedSlot == null)
            {
                return NotFound(); // Return HTTP 404 if the Slot is not found
            }

            return Ok(updatedSlot); // Return HTTP 200 with the updated doctor

        }


        [HttpGet("cost/{id}")]
        public async Task<ActionResult<int?>> GetSlotCostById(int id)
        {
            var cost = await _slotRepository.GetSlotCostById(id);
            if (cost == null)
            {
                return NotFound("Slot cost not found.");
            }
            return Ok(cost);
        }



        // GET: api/parkingSlots/owner/{ownerId}
        [HttpGet("owner/{ownerId}")]
        public async Task<ActionResult<IEnumerable<ParkingSlots>>> GetSlotsByOwner(int ownerId)
        {
            var slots = await _slotRepository.GetSlotsByOwner(ownerId);
            if (slots == null || !slots.Any())
            {
                return NotFound(); // Return 404 if no slots found
            }

            return Ok(slots); // Return 200 with the list of slots
        }




        // PUT: api/slots/decrement/{id}
        [HttpPut("decrement/{id}")]
        public async Task<IActionResult> DecrementAvailableSlots(int id)
        {
            var slot = await _slotRepository.GetSlotsById(id);
            if (slot == null || slot.SlotAvailability <= 0)
            {
                return NotFound("Slot not found or no available slots.");
            }

            slot.SlotAvailability--;
            await _slotRepository.UpdateSlots(id, slot); // Update the slot with the new availability

            return Ok(slot);
        }

        // PUT: api/slots/increment/{id}
        [HttpPut("increment/{id}")]
        public async Task<IActionResult> IncrementAvailableSlots(int id)
        {
            var slot = await _slotRepository.GetSlotsById(id);
            if (slot == null)
            {
                return NotFound("Slot not found.");
            }

            // Ensure SlotAvailability does not exceed TotalSlots
            if (slot.SlotAvailability < slot.TotalSlots)
            {  
                slot.SlotAvailability++;
                await _slotRepository.UpdateSlots(id, slot); // Update the slot with the new availability
            }
            else
            {
                return BadRequest("Cannot increment availability beyond total slots.");
            }

            return Ok(slot);
        }


        [HttpPut("approve/{slotId}")]
        public async Task<IActionResult> ApproveSlotAsync(int slotId)
        {
            var result = await _slotRepository.ApproveSlotAsync(slotId);
            if (result)
            {
                return Ok(new { message = "Slot approved successfully." });
            }

            return NotFound(new { message = "Slot not found or not pending approval." });
        }

        [HttpPut("reject/{slotId}")]
        public async Task<IActionResult> RejectSlotAsync(int slotId)
        {
            var result = await _slotRepository.RejectSlotAsync(slotId);
            if (result)
            {
                return Ok(new { message = "Slot rejected successfully." });
            }

            return NotFound(new { message = "Slot not found or not pending approval." });
        }



        [HttpGet("approved")]
        public async Task<ActionResult<IEnumerable<ParkingSlots>>> GetAllSlotsApproved()
        {
            var approvedSlots = await _slotRepository.GetApprovedSlots();
            return Ok(approvedSlots);
        }

        [HttpGet("rejected")]
        public async Task<ActionResult<IEnumerable<ParkingSlots>>> GetAllSlotsRejected()
        {
            var rejectedSlots = await _slotRepository.GetRejectedSlots();
            return Ok(rejectedSlots);
        }


    }
}