using FeedbackService.DataAccess;
using FeedbackService.IRepository;
using FeedbackService.Modal;
using FeedbackService.Repository;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Testing
{
    [TestFixture]
    public class UserFeedbackRepositoryTests
    {
        private FeedbackDbContext _context;
        private UserFeedback _userFeedbackRepository;

        [SetUp]
        public void Setup()
        {
            // Use an in-memory database with a unique name for each test run
            var options = new DbContextOptionsBuilder<FeedbackDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new FeedbackDbContext(options);
            _userFeedbackRepository = new UserFeedback(_context);

            // Seed data for testing
            _context.Feedbacks.AddRange(
                new Feedback { Id = 1, UserId = 101, Message = "Great product!", Rating = 5, SlotId = 1 },
                new Feedback { Id = 2, UserId = 102, Message = "Good service.", Rating = 4, SlotId = 2 },
                new Feedback { Id = 3, UserId = 103, Message = "Could be better.", Rating = 3, SlotId = 3 }
            );
            _context.SaveChanges();
        }

        [Test]
        public async Task GetAllFeedbacks_ShouldReturnAllFeedbacks()
        {
            // Act: Call the GetAllFeedbacks method
            var feedbacks = await _userFeedbackRepository.GetAllFeedbacks();

            // Assert: Verify that the result is not null and contains the expected number of items
            Assert.IsNotNull(feedbacks);
            Assert.AreEqual(3, feedbacks.Count()); // We expect 3 feedbacks based on the seeded data
        }

        [TearDown]
        public void TearDown()
        {
            // Dispose of the database context after each test
            _context.Dispose();
        }
    }
}
