using FeedbackService.DataAccess;
using FeedbackService.IRepository;
using FeedbackService.Modal;
using Microsoft.EntityFrameworkCore;

namespace FeedbackService.Repository
{
    public class UserFeedback : IFeedbackRepository
    {

        private readonly FeedbackDbContext _context;
        public UserFeedback(FeedbackDbContext context)
        {
            _context = context;
        }
        public async Task<Feedback> AddFeedback(Feedback feedback)
        {
            await _context.Feedbacks.AddAsync(feedback);
            await _context.SaveChangesAsync();
            return feedback;
        }

        public async Task<IEnumerable<Feedback>> GetAllFeedbacks()
        {
            return await _context.Feedbacks.ToListAsync();
        }
    }
}
