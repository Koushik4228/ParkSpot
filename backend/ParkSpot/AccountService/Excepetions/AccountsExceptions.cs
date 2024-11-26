namespace AccountService.Excepetions
{
    public class AccountsExceptions:Exception

    {

        public AccountsExceptions() { }

        // Constructor with a custom message
        public AccountsExceptions(string message) : base(message) { }

        // Constructor with a custom message and inner exception
        public AccountsExceptions(string message, Exception innerException)
            : base(message, innerException) { }

        // Optionally, you can provide a default HTTP status code
        public virtual int StatusCode => 500; // Default to Internal Server Error
    }

    // Custom exception for login failures (specific for login issues)
    public class UserLoginException : AccountsExceptions
    {
        public UserLoginException(string message) : base(message) { }

        // Override the default status code for unauthorized errors (HTTP 401)
        public override int StatusCode => 401; // Unauthorized
    }

   
}

