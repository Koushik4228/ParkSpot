using FeedbackService.Modal;

namespace FeedbackService.IRepository
{
    public interface IFeedbackRepository // to define methods 
    {
        Task<Feedback> AddFeedback(Feedback feedback);
        Task<IEnumerable<Feedback>> GetAllFeedbacks(); // Method to fetch all feedback
    }
}
