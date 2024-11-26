using System.ComponentModel.DataAnnotations;

namespace AccountService.DTO
{
    public class UpdatePasswordDTO
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string NewPassword { get; set; }

        public string Token { get; set; }
    }
}
