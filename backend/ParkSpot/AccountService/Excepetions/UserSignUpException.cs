namespace AccountService.Exceptions
{
    public class UserSignUpException : Exception
    {
        public UserSignUpException() { }

        public UserSignUpException(string message) : base(message) { }

        public UserSignUpException(string message, Exception innerException)
            : base(message, innerException) { }

        public virtual int StatusCode => 500; // Default status code for server errors
    }

    // Exception for email already exists
    public class EmailAlreadyExistsException : UserSignUpException
    {
        public EmailAlreadyExistsException(string message) : base(message) { }

        public override int StatusCode => 409; // Conflict (email already taken)
    }

    // Exception for user creation failure (e.g., database failure)
    public class UserCreationException : UserSignUpException
    {
        public UserCreationException(string message) : base(message) { }

        public override int StatusCode => 500; // Internal Server Error (creation failure)
    }

    // Exception for role-related issues
    public class UserRoleException : UserSignUpException
    {
        public UserRoleException(string message) : base(message) { }

        public override int StatusCode => 404; // Not Found (role doesn't exist)
    }
}
