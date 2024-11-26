using System.ComponentModel.DataAnnotations;

namespace AccountService.DTO
{
    public class UserDetailsDTO
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string? PhoneNumber { get; set; }

        //public string Email { get; set; }

        //public string Password { get; set; }
    }
}
