using AccountService.DTO;
using AccountService.Modal;

namespace AccountService.Repository
{
    public interface IAccountRepository
    {
        Task<(int, string)> Registeration(User newUser);

        Task<string> Login(LoginDTO loginDTO);

        Task<UserDTO> GetUserByIdAsync(int id);
        Task<IEnumerable<UserDTO>> GetAllUsersAsync();
        //Task<List<User>> GetUsersByRoleAsync(string role);
        Task<string> GetRolesByUserIdAsync(int userId);
        Task<(int, string)> DeleteUserAsync(int id);
        Task<string> UpdateServiceProviderRole(int id);
        Task<(int statusCode, string message)> UpdateUserByIdAsync(int id, UserDetailsDTO userModel);
        Task<bool> SendOtpAsync(string email);
        string GenerateOtp();
        bool ValidateOtp(string email, string otp);


        Task<bool> SendPasswordResetEmailAsync(string email);
        Task<bool> ResetPasswordAsync(string email, string token, string newPassword);

        Task<bool> EmailExistsAsync(string email);
        Task<bool> UpdatePasswordAsync(string email, string token, string newPassword);



        Task<(int, string)> UpdateUserDetailsAsync(UserDTO updateuser);
        //Task<bool> RoleExistsAsync(string role);
    }
}
