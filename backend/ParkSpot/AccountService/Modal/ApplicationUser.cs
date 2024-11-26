using Microsoft.AspNetCore.Identity;

namespace AccountService.Modal
{
    public class ApplicationUser : IdentityUser
    {
        public string AppUserName { get; set; }
    }
}
