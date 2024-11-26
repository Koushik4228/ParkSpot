using EmailService.EmailConfiguration;
using EmailService.Model;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit;
using static EmailService.Repository.EmailRepository;
using MailKit.Net.Smtp;

namespace EmailService.Repository
{
   
        public class EmailRepository : IEmailRepository
        {
            private readonly EmailConfig _emailConfig;

            public EmailRepository(IOptions<EmailConfig> emailConfig)
            {
                _emailConfig = emailConfig.Value;
            }


            public async Task SendEmailAsync(Email emailRequest)
            {
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(_emailConfig.SenderName, _emailConfig.SenderEmail));
                email.To.Add(MailboxAddress.Parse(emailRequest.To));
                email.Subject = emailRequest.Subject;
                email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = emailRequest.Body };

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_emailConfig.Username, _emailConfig.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

            }
        }
    }

