namespace AccountService.DTO
{
    public class OtpDTO
    {
        public string Email { get; set; }
        public string? OtpCode { get; set; }
        public DateTime ExpirationTime { get; set; }
    }
}
