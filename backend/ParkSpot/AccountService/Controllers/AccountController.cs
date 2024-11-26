using AccountService.DTO;
using AccountService.Excepetions;
using AccountService.Exceptions;
using AccountService.Modal;
using AccountService.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AccountService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository _accountRepository;

        public AccountController(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        [HttpGet]
      //  [Authorize(Roles = "admin")]
        //[Authorize(Roles = "admin")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAllUsers()
        {
            try
            {
                var res = await _accountRepository.GetAllUsersAsync();
                if (res == null || !res.Any())
                {
                    return NotFound("No users found.");
                }

                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("Register")]
        public async Task<ActionResult> RegisterUser([FromBody] User userModel)
        {
            if (userModel == null)
            {
                return BadRequest("User model is null.");
            }

            try
            {
                var (statusCode, message) = await _accountRepository.Registeration(userModel);

                if (statusCode == 400)
                {
                    return BadRequest(message);  // Return BadRequest (400) for client-side issues
                }
                else if (statusCode == 201)
                {
                    return CreatedAtAction(nameof(RegisterUser), new { message });  // User registered successfully
                }

                return StatusCode(statusCode, message);  // Handle other statuses
            }
            catch (EmailAlreadyExistsException ex)
            {
                // Return 409 Conflict for email already exists
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (UserCreationException ex)
            {
                // Return 500 Internal Server Error for user creation issues
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (UserRoleException ex)
            {
                // Return 404 Not Found for role-related issues
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (UserSignUpException ex)
            {
                // General catch for other user sign-up exceptions
                return StatusCode(ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                // General catch for unforeseen exceptions
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("GetById/{id}")]
        public async Task<ActionResult<UserDTO>> GetUserById(int id)
        {
            try
            {
                var res = await _accountRepository.GetUserByIdAsync(id);
                if (res == null)
                {
                    return NotFound($"User with id {id} not found.");
                }

                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("GetRoleById/{id}")]
        public async Task<ActionResult<string>> GetRoleById(int id)
        {
            try
            {
                var res = await _accountRepository.GetRolesByUserIdAsync(id);
                if (res == null)
                {
                    return NotFound($"Role for user with id {id} not found.");
                }

                return Ok(res);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            try
            {
                var (statusCode, message) = await _accountRepository.DeleteUserAsync(id);
                if (statusCode == 404)
                {
                    return NotFound(message);
                }

                return Ok(message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPost("Login")]
        public async Task<ActionResult> LoginUser([FromBody] LoginDTO userLogin)
        {
            if (userLogin == null)
            {
                return BadRequest("Login model is null.");
            }

            try
            {
                var res = await _accountRepository.Login(userLogin);

                if (res == null)
                {
                    // Throw custom exception for login failure
                    throw new UserLoginException("Invalid username or password.");
                }

                return Ok(res);
            }
            catch (UserLoginException ex)
            {
                // Handle custom login exception with specified status code
                return StatusCode(ex.StatusCode, new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                // Handle any other unexpected exceptions
                return StatusCode(500, new { Message = "Internal server error.", Details = ex.Message });
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser([FromBody] UserDTO userModel)
        {
            if (userModel == null)
            {
                return BadRequest("User model is null.");
            }

            try
            {
                var (statusCode, message) = await _accountRepository.UpdateUserDetailsAsync(userModel);
                if (statusCode == 404)
                {
                    return NotFound(message);
                }

                return Ok(message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("UpdateServiceProviderRole/{id}")]
        public async Task<ActionResult> UpdateServiceProviderRole(int id)
        {
            try
            {
                var message = await _accountRepository.UpdateServiceProviderRole(id);
                if (message == "No user found")
                {
                    return NotFound(message);
                }

                return Ok(message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpPut("UpdateUser/{id}")]
        public async Task<ActionResult> UpdateUserById(int id, [FromBody] UserDetailsDTO userModel)
        {
            if (userModel == null)
            {
                return BadRequest("User model is null.");
            }

            try
            {
                // Assuming that the repository method takes the user ID and the updated user details
                var (statusCode, message) = await _accountRepository.UpdateUserByIdAsync(id, userModel);
                if (statusCode == 404)
                {
                    return NotFound($"User with id {id} not found.");
                }

                return Ok(message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error.");
            }
        }

        // Endpoint to check if the email exists
        [HttpPost("check-email")]
        public async Task<IActionResult> CheckEmail([FromBody] EmailDTO emailDto)
        {
            if (string.IsNullOrEmpty(emailDto.Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            bool exists = await _accountRepository.EmailExistsAsync(emailDto.Email);
            return Ok(new { exists });
        }

        // Endpoint to update the password if the email exists
        //[HttpPost("update-password")]
        //public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDTO updatePasswordDto)
        //{
        //    if (string.IsNullOrEmpty(updatePasswordDto.Email) || string.IsNullOrEmpty(updatePasswordDto.Password))
        //    {
        //        return BadRequest(new { message = "Email and password are required." });
        //    }

        //    bool success = await _accountRepository.UpdatePasswordAsync(updatePasswordDto.Email, updatePasswordDto.Token, updatePasswordDto.Password);

        //    if (success)
        //        return Ok(new { success = true });
        //    else
        //        return NotFound(new { success = false, message = "User not found or invalid token." });
        //}


        [HttpPost("generate")]
        public async Task<IActionResult> GenerateOtp([FromBody] OtpDTO otpRequest)
        {
            if (otpRequest == null || string.IsNullOrEmpty(otpRequest.Email))
            {
                return BadRequest(new { Message = "Email is required." });
            }

            // Call to the repository to send the OTP
            var result = await _accountRepository.SendOtpAsync(otpRequest.Email);

            if (result)
            {
                return Ok(new { Message = "OTP sent successfully." });
            }

            return BadRequest(new { Message = "Failed to send OTP." });
        }

        [HttpPost("verify")]
        public IActionResult VerifyOtp([FromBody] OtpDTO otpVerify)
        {
            if (otpVerify == null || string.IsNullOrEmpty(otpVerify.Email) || string.IsNullOrEmpty(otpVerify.OtpCode))
            {
                return BadRequest(new { Message = "Invalid request. Email and OTP code are required." });
            }

            var isValid = _accountRepository.ValidateOtp(otpVerify.Email, otpVerify.OtpCode);
            if (isValid)
            {
                return Ok(new { Message = "OTP verified successfully" });
            }

            return BadRequest(new { Message = "Invalid OTP" });
        }


        [HttpPost("request-password-reset")]

        public async Task<IActionResult> RequestPasswordReset([FromBody] RequestReset requestdto)

        {

            bool result = await _accountRepository.SendPasswordResetEmailAsync(requestdto.Email);

            if (!result)

            {

                return BadRequest(new { Message = "User with the specified email address does not exist." });

            }

            return Ok(new { Message = "Password reset link sent successfully." });

        }

        // Reset user password

        [HttpPost("reset-password")]

        public async Task<IActionResult> ResetPassword([FromBody]UpdatePasswordDTO resetPasswordDto)

        {

            if (!ModelState.IsValid)

            {

                return BadRequest(ModelState);

            }

            var result = await _accountRepository.ResetPasswordAsync(resetPasswordDto.Email, resetPasswordDto.Token, resetPasswordDto.NewPassword);

            if (result)

            {

                return Ok(new { Message = "Password has been reset successfully." });

            }

            else

            {

                return BadRequest(new { Message = "Password reset failed. Please check the token or try again." });

            }

        }


    }




}


