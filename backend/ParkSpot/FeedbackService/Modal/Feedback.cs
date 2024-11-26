using System.ComponentModel.DataAnnotations;

namespace FeedbackService.Modal
{
    public class Feedback
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public string Message { get; set; }
        public int Rating { get; set; }
        public int SlotId { get; set; }
    }
}
