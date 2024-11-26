using FeedbackService.Modal;
using Microsoft.EntityFrameworkCore;

namespace FeedbackService.DataAccess
{
    public class FeedbackDbContext:DbContext
    {
      public FeedbackDbContext(DbContextOptions<FeedbackDbContext> options) : base(options) { }

        public DbSet<Feedback> Feedbacks { get; set; }
    }
}
