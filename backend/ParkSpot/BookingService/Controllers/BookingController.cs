using BookingService.CustomExceptions;
using BookingService.IRepository;
using BookingService.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingRepository _bookingRepository;

        public BookingController(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        [HttpPost]
        public async Task<ActionResult<Booking>> AddBooking([FromBody] Booking booking)
        {
            if (booking == null)
            {
                return BadRequest("Invalid booking data");
            }
            var createdBooking = await _bookingRepository.AddBooking(booking);
            return Ok(createdBooking);
        }

        [HttpGet("BookingId")]
        public async Task<ActionResult> GetBookingById(int id)
        {
            var booking = await _bookingRepository.GetBookingById(id);
            if (booking == null || !booking.Any())
            {
                return NotFound("No bookings found for the given user");
            }
            return Ok(booking);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Booking>> UpdateBooking(int id, [FromBody] Booking booking)
        {
            if (id != booking.BookingId)
            {
                return BadRequest("Booking ID mismatch.");
            }

            var updatedBooking = await _bookingRepository.UpdateBooking(booking);
            if (updatedBooking == null)
            {
                return NotFound($"Booking with ID {id} not found.");
            }

            return Ok(updatedBooking);
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllBookings()
        {
            try
            {
                // Attempt to fetch the bookings from the repository
                var bookings = await _bookingRepository.GetAllBookingsAsync();

                // Check if bookings is null or empty and throw a custom exception
                if (bookings == null || !bookings.Any())
                {
                    throw new NoBookingsFoundException();
                }

                // Return the bookings if everything goes well
                return Ok(bookings);
            }
            catch (NoBookingsFoundException ex)
            {
                // Handle the "No Bookings Found" exception
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (DatabaseException ex)
            {
                // Handle database-related errors
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (NullReferenceCustomException ex)
            {
                // Handle unexpected null reference errors
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                // Catch any other unexpected exceptions
                return StatusCode(500, "An unexpected error occurred.");
            }
        }


        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllBookingsByCustomerId(int customerId)
        {
            var bookings = await _bookingRepository.GetAllBookingsByCustomerId(customerId);

            if (bookings == null || !bookings.Any())
            {
                return NotFound($"No bookings found for customer with ID {customerId}");
            }

            return Ok(bookings);
        }
    }
}
