﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace AccountService.Modal
{
    public class User
    {
        [Key]
        [Required]
        public int UserId { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string? PhoneNumber { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [DefaultValue("user")]
        public string Role { get; set; } = "user";
    }
}


