using System.ComponentModel.DataAnnotations;

namespace AccountService.DTO
{
    public class EmailDTO
    {
        [Required]
        public string Email { get; set; }
    }
}
