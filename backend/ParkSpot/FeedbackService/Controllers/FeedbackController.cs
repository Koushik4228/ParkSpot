using FeedbackService.IRepository;
using FeedbackService.Modal;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {

        private readonly IFeedbackRepository _feedbackRepo;
        public FeedbackController(IFeedbackRepository feedbackRepo)
        {
            _feedbackRepo = feedbackRepo;
        }
        [HttpPost]
        public async Task<IActionResult> AddFeedback([FromBody] Feedback feedback)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var addedFeedback = await _feedbackRepo.AddFeedback(feedback);
                return Ok(addedFeedback); // Returns the added feedback data as the response
            }
            catch (System.Exception ex)
            {
                // Log the exception (ex) if necessary
                return StatusCode(500, "Internal server error. Failed to add feedback.");
            }
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks()
        {
            try
            {
                var feedbackList = await _feedbackRepo.GetAllFeedbacks();
                return Ok(feedbackList);
            }
            catch (System.Exception)
            {
                return StatusCode(500, "Internal server error. Failed to fetch feedback.");
            }
        }

    }
}
