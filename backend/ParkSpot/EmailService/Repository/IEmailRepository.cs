using EmailService.Model;

namespace EmailService.Repository
{
    public interface IEmailRepository
    {

        Task SendEmailAsync(Email emailRequest);

    }
}
