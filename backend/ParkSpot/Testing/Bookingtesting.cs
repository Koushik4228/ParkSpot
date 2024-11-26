using BookingService.DBContext;
using BookingService.Model;
using BookingService.Services;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Testing
{
    [TestFixture]
    public class Bookingtesting
    {
        private BookingServices _bookingServices;
        private BookingDBContext _dbContext;

        // Setup before each test
        [SetUp]
        public void Setup()
        {
            // Create a new in-memory database for each test
            var options = new DbContextOptionsBuilder<BookingDBContext>()
                .UseInMemoryDatabase(databaseName: "BookingTestDb")
                .EnableSensitiveDataLogging() // Enables detailed logging to show the missing entity properties
                .Options;

            // Initialize the context and the service
            _dbContext = new BookingDBContext(options);
            _bookingServices = new BookingServices(_dbContext);

            // Ensure the in-memory database is cleared between tests
            _dbContext.Database.EnsureDeleted();
            _dbContext.Database.EnsureCreated();

            // Add mock bookings data, ensuring all required properties are set
            var bookings = new List<Booking>
            {
                new Booking
                {
                    BookingId = 1,
                    CustomerId = 101,
                    UserName = "John",
                    vehicleNumber = "ABC123",
                    BookingDate = DateTime.Now,
                    StartTime = "10:00 AM", // Required field
                    Endtime = "11:00 AM",   // Required field
                    ParkingSlotNumber = "A1", // Required field
                    Price = 20.50m
                },
                new Booking
                {
                    BookingId = 2,
                    CustomerId = 102,
                    UserName = "Jane",
                    vehicleNumber = "XYZ456",
                    BookingDate = DateTime.Now,
                    StartTime = "2:00 PM", // Required field
                    Endtime = "3:00 PM",   // Required field
                    ParkingSlotNumber = "B2", // Required field
                    Price = 25.00m
                }
            };

            // Adding the bookings to the in-memory database
            _dbContext.Bookings.AddRange(bookings);
            _dbContext.SaveChanges();
        }

        // TearDown after each test
        [TearDown]
        public void TearDown()
        {
            // Dispose of the DbContext after each test
            _dbContext.Dispose();
        }

        // Test for GetAllBookingsAsync
        [Test]
        public async Task GetAllBookingsAsync_ShouldReturnAllBookings()
        {
            // Act: Call GetAllBookingsAsync
            var result = await _bookingServices.GetAllBookingsAsync();

            // Assert: Verify that result is not null and has expected number of bookings
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());  // Should return 2 bookings
        }

        // Test for GetAllBookingsByCustomerId
        [Test]
        
        public async Task GetAllBookingsByCustomerId_ShouldReturnBookingsForSpecificCustomer()
        {
            // Act: Call GetAllBookingsByCustomerId for customer ID 101
            var result = await _bookingServices.GetAllBookingsByCustomerId(101);

            // Assert: Verify that the result contains bookings for CustomerId = 101
            Assert.IsNotNull(result);  // Ensure result is not null
            Assert.AreEqual(1, result.Count());  // Verify that there are exactly 2 bookings for customer 101
        }

        // Test for GetBookingById
        [Test]
        public async Task GetBookingById_ShouldReturnCorrectBooking()
        {
            // Act: Call GetBookingById for BookingId = 1
            var result = await _bookingServices.GetBookingById(1);

            // Assert: Verify that the result contains only one booking with BookingId = 1
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count());  // Should return one booking
            Assert.AreEqual(1, result.First().BookingId);  // Verify the booking ID is correct
        }

        // Test for GetBookingById when booking is not found
        [Test]
        public async Task GetBookingById_ShouldReturnEmptyWhenBookingNotFound()
        {
            // Act: Call GetBookingById for an ID that doesn't exist
            var result = await _bookingServices.GetBookingById(999);  // ID that doesn't exist

            // Assert: Verify that the result is empty since the booking doesn't exist
            Assert.IsEmpty(result);  // Should return an empty list
        }

    }
}
