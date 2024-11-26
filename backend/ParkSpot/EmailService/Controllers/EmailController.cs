using EmailService.Model;
using EmailService.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmailService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {

        private readonly IEmailRepository _emailService;

        public EmailController(IEmailRepository emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] Email emailRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid email request");

            await _emailService.SendEmailAsync(emailRequest);
            return Ok("Email sent successfully");
        }
    }
}
