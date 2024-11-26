using Moq;
using NUnit.Framework;
using ParkingProvider.Services;
using ParkingProvider.Models;
using ParkingProvider.DTO;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ParkingProvider.Data_Context;
using FeedbackService.DataAccess;

namespace Testing
{
    [TestFixture]
    public class SlotServiceTests
    {
        private ParkingSlotDbContext _context; // Declare _context as a class-level field
        private SlotService _slotService;

        [SetUp]
        public void Setup()
        {
            // Create a unique database name for each test to ensure isolation
            var databaseName = $"ParkingSlotTestDb_{System.Guid.NewGuid()}"; // Add a GUID for uniqueness

            // Set up in-memory database for unit tests
            var options = new DbContextOptionsBuilder<ParkingSlotDbContext>()
                .UseInMemoryDatabase(databaseName)  // Unique DB name for each test run
                .EnableSensitiveDataLogging()  // Enable logging for debugging (optional)
                .Options;

            // Initialize the context and service
            _context = new ParkingSlotDbContext(options); // Initialize _context properly here
            _slotService = new SlotService(_context); // Use the _context for initializing SlotService

            // Seed data with unique primary keys
            _context.Slots.AddRange(new List<ParkingSlots>
            {
                new ParkingSlots
                {
                    SlotId = 1,  // Unique SlotId
                    Location = "Location 1",
                    Status = SlotStatus.Approved,
                    OwnerId = 1,
                    SlotAvailability = 5,
                    SlotPrice = 20,
                    Latitude = 12.34f,
                    Longitude = 56.78f,
                    Address = "123 Main St",
                    VehicleType = "Sedan"
                },
                new ParkingSlots
                {
                    SlotId = 2,  // Unique SlotId
                    Location = "Location 2",
                    Status = SlotStatus.Rejected,
                    OwnerId = 1,
                    SlotAvailability = 3,
                    SlotPrice = 15,
                    Latitude = 12.35f,
                    Longitude = 56.79f,
                    Address = "456 Elm St",
                    VehicleType = "SUV"
                },
                new ParkingSlots
                {
                    SlotId = 3,  // Unique SlotId
                    Location = "Location 3",
                    Status = SlotStatus.Pending,
                    OwnerId = 2,
                    SlotAvailability = 10,
                    SlotPrice = 25,
                    Latitude = 12.36f,
                    Longitude = 56.80f,
                    Address = "789 Pine St",
                    VehicleType = "Truck"
                }
            });

            _context.SaveChanges(); // Save the seeded data to in-memory database
        }
        [TearDown]
        public void TearDown()
        {
            // Dispose of _context after each test run to ensure cleanup
            _context.Dispose();
        }

        [Test]
      
        public async Task GetAllSlots_ShouldReturnAllSlots()
        {
            // Act
            var result = await _slotService.GetAllSlots();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(3, result.Count());  // There are 3 slots in the mock data
        }

        [Test]
        public async Task GetAvailableSlots_ShouldReturnSlotsMatchingLocation()
        {
            // Act
            var result = await _slotService.GetAvailableSlots("Location 1");

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count());  // Only 1 slot matches "Location 1"
            Assert.AreEqual("Location 1", result.First().Location);  // Ensure location matches
        }

        [Test]
        public async Task GetSlotsByOwner_ShouldReturnSlotsForSpecificOwner()
        {
            // Act
            var result = await _slotService.GetSlotsByOwner(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());  // OwnerId 1 has 2 slots
            Assert.AreEqual(1, result.First().OwnerId);  // Ensure OwnerId matches
        }

        [Test]
        public async Task GetApprovedSlots_ShouldReturnApprovedSlots()
        {
            // Act
            var result = await _slotService.GetApprovedSlots();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count());  // Only 1 slot has Approved status
            Assert.AreEqual(SlotStatus.Approved, result.First().Status);  // Ensure status is Approved
        }

        [Test]
        public async Task GetRejectedSlots_ShouldReturnRejectedSlots()
        {
            // Act
            var result = await _slotService.GetRejectedSlots();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count());  // Only 1 slot has Rejected status
            Assert.AreEqual(SlotStatus.Rejected, result.First().Status);  // Ensure status is Rejected
        }

        [Test]
        public async Task GetSlotCostById_ShouldReturnCorrectCostForSlot()
        {
            // Act
            var result = await _slotService.GetSlotCostById(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(20, result);  // Slot 1 has a cost of 20
        }

        [Test]
        public async Task GetSlotsById_ShouldReturnCorrectSlot()
        {
            // Act
            var result = await _slotService.GetSlotsById(2);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.SlotId);  // Should return the slot with SlotId = 2
            Assert.AreEqual("Location 2", result.Location);  // Ensure location matches
        }

        [Test]
        public async Task GetAllLatLongsAsync_ShouldReturnAllLatLongs()
        {
            // Act
            var result = await _slotService.GetAllLatLongsAsync();

            // Assert
            Assert.IsNotNull(result, "Result should not be null");
            Assert.AreEqual(3, result.Count(), "Expected 3 results, but got a different count.");

            // Additional checks to ensure the first item has the correct Latitude and Longitude
            var firstSlot = result.First();
            Assert.AreEqual(12.34f, firstSlot.Latitude, "First slot's Latitude is incorrect.");
            Assert.AreEqual(56.78f, firstSlot.Longitude, "First slot's Longitude is incorrect.");

            // You can also add checks for the second and third items if needed
            var secondSlot = result.Skip(1).First();
            Assert.AreEqual(12.35f, secondSlot.Latitude, "Second slot's Latitude is incorrect.");
            Assert.AreEqual(56.79f, secondSlot.Longitude, "Second slot's Longitude is incorrect.");
        }
    }
}
