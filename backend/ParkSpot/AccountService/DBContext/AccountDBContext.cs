using AccountService.Modal;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AccountService.DBContext
{
    public class AccountDBContext : IdentityDbContext<ApplicationUser>
    {
        public AccountDBContext(DbContextOptions<AccountDBContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }


    }
}
