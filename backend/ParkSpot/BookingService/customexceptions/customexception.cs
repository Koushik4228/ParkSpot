namespace BookingService.CustomExceptions
{
    // Base class for all exceptions in BookingService
    public class BookingsExceptions : Exception
    {
        public BookingsExceptions() { }

        // Constructor with a custom message
        public BookingsExceptions(string message) : base(message) { }

        // Constructor with a custom message and inner exception
        public BookingsExceptions(string message, Exception innerException)
            : base(message, innerException) { }

        // Default status code for general booking-related errors
        public virtual int StatusCode => 500; // Default to Internal Server Error
    }

    // Custom exception for "No Bookings Found" scenario
    public class NoBookingsFoundException : BookingsExceptions
    {
        public NoBookingsFoundException(string message = "No bookings found.") : base(message) { }

        // Override the status code to 404 (Not Found) for this specific case
        public override int StatusCode => 404; // Not Found
    }

    // Custom exception for database errors (e.g., SQL issues)
    public class DatabaseException : BookingsExceptions
    {
        public DatabaseException(string message = "An error occurred while accessing the database.") : base(message) { }

        // Override the status code to 500 for database errors
        public override int StatusCode => 500; // Internal Server Error
    }
                                                                        
    // Custom exception for unexpected null reference scenarios
    public class NullReferenceCustomException : BookingsExceptions
    {
        public NullReferenceCustomException(string message = "An unexpected error occurred: Null reference.") : base(message) { }

        // Override the status code to 500 for null reference issues
        public override int StatusCode => 500; // Internal Server Error
    }
}
