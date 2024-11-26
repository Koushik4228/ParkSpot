using AccountService.DBContext;
using AccountService.DTO;
using AccountService.Modal;
using AccountService.Repository;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Testing
{
    [TestFixture]
    public class AccountsTesting
    {
        private AccountDBContext _context;
        private AccountRepository _accountRepository;
        private IMapper _mapper;
        private UserManager<ApplicationUser> _userManager;
        private RoleManager<IdentityRole> _roleManager;
        private IConfiguration _configuration;

        [SetUp]
        public void Setup()
        {
            // Configure in-memory database with a unique name to avoid data conflicts
            var options = new DbContextOptionsBuilder<AccountDBContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase_" + Guid.NewGuid().ToString())
                .Options;
            _context = new AccountDBContext(options);

            // Set up mocks for UserManager and RoleManager
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            _userManager = new UserManager<ApplicationUser>(userStoreMock.Object, null, null, null, null, null, null, null, null);

            var roleStoreMock = new Mock<IRoleStore<IdentityRole>>();
            _roleManager = new RoleManager<IdentityRole>(roleStoreMock.Object, null, null, null, null);

            // Configure JWT settings
            var configValues = new Dictionary<string, string>
            {
                { "JWT:secret", "your_jwt_secret_key" },
                { "JWT:validIssuer", "your_issuer" },
                { "JWT:validAudience", "your_audience" }
            };
            _configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(configValues)
                .Build();

            // Configure AutoMapper
            var mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<User, UserDTO>();
            });
            _mapper = mapperConfig.CreateMapper();

            // Create repository instance with mocks
            var httpClientFactoryMock = new Mock<IHttpClientFactory>(); // Mock IHttpClientFactory
            _accountRepository = new AccountRepository(_context, _userManager, _roleManager, _mapper, _configuration, httpClientFactoryMock.Object);

            // Seed data for testing
            SeedData();
        }

        private void SeedData()
        {
            var users = new List<User>
            {
                new User { UserId = 1, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com", PhoneNumber = "1234567890", Password = "Password123" },
                new User { UserId = 2, FirstName = "Jane", LastName = "Smith", Email = "jane.smith@example.com", PhoneNumber = "0987654321", Password = "Password123" },
                new User { UserId = 3, FirstName = "Bob", LastName = "Brown", Email = "bob.brown@example.com", PhoneNumber = "1122334455", Password = "Password123" }
            };
            _context.Users.AddRange(users);
            _context.SaveChanges();
        }

        [Test]
        public async Task GetUserByIdAsync_ShouldReturnCorrectUser()
        {
            // Act
            var result = await _accountRepository.GetUserByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("John", result.FirstName);
            Assert.AreEqual("Doe", result.LastName);
        }

        [Test]
        public async Task GetUserByIdAsync_ShouldReturnNullForNonExistingUser()
        {
            // Act
            var result = await _accountRepository.GetUserByIdAsync(999); // ID that doesn't exist

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task GetAllUsersAsync_ShouldReturnAllUsers()
        {
            // Act
            var result = await _accountRepository.GetAllUsersAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(3, result.Count()); // Expecting 3 users based on seeded data
        }

        [TearDown]
        public void TearDown()
        {
            // Clear data to ensure no duplication issues in the next test run
            _context.Users.RemoveRange(_context.Users);
            _context.SaveChanges();

            // Dispose the context after each test
            _context.Dispose();

            // Dispose UserManager and RoleManager if they implement IDisposable
            if (_userManager is IDisposable disposableUserManager)
            {
                disposableUserManager.Dispose();
            }

            if (_roleManager is IDisposable disposableRoleManager)
            {
                disposableRoleManager.Dispose();
            }
        }
    }
}
