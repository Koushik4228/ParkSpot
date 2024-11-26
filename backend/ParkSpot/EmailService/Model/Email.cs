namespace EmailService.Model
{
    public class Email
    {
        public string To { get; set; }          // Recipient email
        public string Subject { get; set; }     // Email subject
        public string Body { get; set; }
    }
}
