import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';
import { addUser, requestOtp, verifyOtp } from '../Accounts/Service/user.service'; // Importing services for user registration and OTP handling
import Header from '../Header/header'; // Importing Header component
import Footer from '../Footer/footer'; // Importing Footer component
import { notification } from 'antd'; // Importing notification for success/error messages
import { useNavigate } from 'react-router-dom'; // Importing hook to navigate to other pages

// Password Strength Meter Component to visualize password strength
const PasswordStrengthMeter: React.FC<{ strength: string }> = ({ strength }) => {
    // Determine color based on password strength
    const getColor = () => {
        switch (strength) {
            case 'weak':
                return 'red';
            case 'medium':
                return 'orange';
            case 'strong':
                return 'green';
            default:
                return 'transparent';
        }
    };

    // Render the strength indicator with color
    return <div style={{ height: '5px', width: '100%', backgroundColor: getColor() }} />;
};

// Define the shape of the form data with TypeScript interface
interface FormValues {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    otp: string;
}
const SignUpService = () => {
    // State hooks for managing password strength, OTP sent status, and OTP verification status
    const [passwordStrength, setPasswordStrength] = useState<string>('');
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
    const navigate = useNavigate(); // Hook to handle page navigation

    // Initial values for the sign-up form fields
    const initialValues: FormValues = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: '',
    };

    // Form validation schema using Yup
    const validationSchema = Yup.object({
        firstName: Yup.string()
            .matches(/^[A-Za-z]+$/, 'First Name must contain only letters') // Ensure only letters
            .required('First Name is required'), // Required field
        lastName: Yup.string()
            .matches(/^[A-Za-z]+$/, 'Last Name must contain only letters') // Ensure only letters
            .required('Last Name is required'), // Required field
        phoneNumber: Yup.string()
          .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
          .required('Phone number is required'),
        email: Yup.string()
          .email('Invalid email address')
          .matches(/^([a-z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, 'Invalid email format') // More strict email validation
          .required('Email is required'),
        password: Yup.string()
          .min(8, 'Password must be at least 8 characters') // Increased minimum password length
          .max(20, 'Password cannot exceed 20 characters') // Max password length
          .matches(/[A-Z]/, 'Password must contain at least one uppercase letter') // Uppercase letter requirement
          .matches(/[a-z]/, 'Password must contain at least one lowercase letter') // Lowercase letter requirement
          .matches(/[0-9]/, 'Password must contain at least one number') // Number requirement
          .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character') // Special character requirement
          .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match') // Password confirmation must match password
            .required('Confirm Password is required'), // Required field
        otp: Yup.string().required('OTP is required'), // OTP is required after it's sent
    });

    // Function to check password strength (weak, medium, strong)
    const checkPasswordStrength = (password: string) => {
        // Regular expressions to check password strength
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const mediumPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (strongPasswordRegex.test(password)) {
            setPasswordStrength('strong'); // Strong password
        } else if (mediumPasswordRegex.test(password)) {
            setPasswordStrength('medium'); // Medium password
        } else {
            setPasswordStrength('weak'); // Weak password
        }
    };

    // Function to send OTP to the user's email
    const handleSendOtp = async (email: string) => {
        try {
            const response = await requestOtp(email); // Send OTP request to backend
            if (response.data) {
                setIsOtpSent(true); // Set OTP sent status to true
                notification.success({
                    message: 'OTP Sent',
                    description: 'We have sent an OTP to your email. Please check and enter it.',
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to send OTP. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error sending OTP', error);
            notification.error({
                message: 'Error',
                description: 'There was an error sending the OTP.',
            });
        }
    };

    // Function to verify OTP entered by the user
    const handleVerifyOtp = async (email: string, otp: string) => {
        try {
            const response = await verifyOtp(email, otp); // Verify OTP with backend
            if (response.data) {
                setIsOtpVerified(true); // Set OTP verification status to true
                notification.success({
                    message: 'OTP Verified',
                    description: 'OTP verified successfully. You can now complete the sign-up.',
                });
                return true; // OTP verified
            } else {
                notification.error({
                    message: 'Invalid OTP',
                    description: 'The OTP you entered is incorrect.',
                });
                return false; // Invalid OTP
            }
        } catch (error) {
            console.error('Error verifying OTP', error);
            notification.error({
                message: 'Error',
                description: 'There was an error verifying the OTP.',
            });
            return false; // OTP verification failed
        }
    };

    // Function to handle the form submission after OTP verification
    const handleSubmit = async (values: FormValues) => {
        const { otp, confirmPassword, ...userData } = values;
    
        // Verify OTP if it's sent
        if (!isOtpVerified) {
            notification.error({
                message: 'Email Not Verified',
                description: 'Please verify your email by entering the OTP.',
            });
            return; // Prevent form submission if OTP is not verified
        }
    
        try {
            const userWithRole = { ...userData, role: 'user' };
            
            // Call the backend API to register the user
            const response = await addUser(userWithRole);
    
            if (response.status === 201) {
                // Successfully registered
                notification.success({
                    message: 'Registration Successful',
                    description: 'You have registered successfully! Please log in.',
                });
    
                // Navigate to login page after successful registration
                navigate('/login');
            } else {
                // Handle other status codes if necessary
                notification.error({
                    message: 'Registration Failed',
                    description: response.data?.Message || 'An error occurred during registration. Please try again.',
                });
            }
        } catch (error: any) {
            // Handle errors from the backend
            if (error.response) {
                // Handle specific error codes or messages from backend
                if (error.response.status === 400) {
                    // BadRequest (Invalid input or missing data)
                    notification.error({
                        message: 'Registration Failed',
                        description: error.response.data?.Message || 'Please check your input and try again.',
                    });
                } else if (error.response.status === 409) {
                    // Conflict (Email already exists)
                    notification.error({
                        message: 'Registration Failed',
                        description: error.response.data?.Message || 'The email address is already registered.',
                    });
                } else if (error.response.status === 500) {
                    // InternalServerError (Server-side issue)
                    notification.error({
                        message: 'Registration Failed',
                        description: error.response.data?.Message || 'There was an error creating your account. Please try again later.',
                    });
                } else {
                    // Other server errors or unexpected response
                    notification.error({
                        message: 'Registration Failed',
                        description: error.response.data?.Message || 'An unexpected error occurred. Please try again later.',
                    });
                }
            } else {
                // Handle network or unexpected errors
                notification.error({
                    message: 'Registration Failed',
                    description: 'Network error or unable to connect to the server.',
                });
            }
        }
    };
    

    return (
        <>
            <Header /> {/* Render the Header component */}
            <div className="form-box">
                <h2 className="title-heading">Join Us </h2> {/* Title for the form */}
                <div className="service-provider-area">
                    <h6 className="service-provider-label">
                        Are you a Service Provider? <a className="registerHere" href="/signupservice">Register Here</a> {/* Link to user sign-up */}
                    </h6>
                </div>

                {/* Formik form for handling the sign-up form */}
                <Formik
                    initialValues={initialValues} // Initialize form values
                    validationSchema={validationSchema} // Apply validation schema
                    onSubmit={handleSubmit} // Form submit handler
                >
                    {({ handleSubmit, setFieldValue, values }) => (
                        <FormikForm onSubmit={handleSubmit}>
                            {/* Form Fields */}
                            <Form.Group>
                                <Form.Label className="input-label">First Name</Form.Label>
                                <Field
                                    type="text"
                                    name="firstName"
                                    className="input-field"
                                    placeholder="Enter First Name"
                                />
                                <ErrorMessage name="firstName" component="div" className="error-message" />
                            </Form.Group>

                            {/* Last Name */}
                            <Form.Group>
                                <Form.Label className="input-label">Last Name</Form.Label>
                                <Field
                                    type="text"
                                    name="lastName"
                                    className="input-field"
                                    placeholder="Enter Last Name"
                                />
                                <ErrorMessage name="lastName" component="div" className="error-message" />
                            </Form.Group>

                            {/* Email */}
                            <Form.Group>
                                <Form.Label className="input-label">Email</Form.Label>
                                <Field
                                    type="email"
                                    name="email"
                                    className="input-field"
                                    placeholder="Enter Email"
                                />
                                <ErrorMessage name="email" component="div" className="error-message" />
                                <Button
                                    variant="secondary"
                                    onClick={() => handleSendOtp(values.email)} // Send OTP on button click
                                    disabled={isOtpSent} // Disable button if OTP has been sent
                                >
                                    {isOtpSent ? 'OTP Sent' : 'Verify Email'}
                                </Button>
                            </Form.Group>

                            {/* OTP verification */}
                            {isOtpSent && (
                                <>
                                    <Form.Group>
                                        <Form.Label className="input-label">Enter OTP</Form.Label>
                                        <Field
                                            type="text"
                                            name="otp"
                                            className="input-field"
                                            placeholder="Enter OTP sent to your email"
                                        />
                                        <ErrorMessage name="otp" component="div" className="error-message" />
                                    </Form.Group>
                                    <div className="button-area">
                                        <Button
                                            variant="primary"
                                            onClick={() => handleVerifyOtp(values.email, values.otp)} // Verify OTP on button click
                                        >
                                            Submit OTP
                                        </Button>
                                    </div>
                                </>
                            )}

                            {/* Password */}
                            <Form.Group>
                                <Form.Label className="input-label">Password</Form.Label>
                                <Field
                                    type="password"
                                    name="password"
                                    className="input-field"
                                    placeholder="Enter Password"
                                    onChange={(e: any) => {
                                        const { value } = e.target;
                                        setFieldValue('password', value); // Update password field value
                                        checkPasswordStrength(value); // Check password strength
                                    }}
                                />
                                <ErrorMessage name="password" component="div" className="error-message" />
                                <PasswordStrengthMeter strength={passwordStrength} /> {/* Show password strength */}
                            </Form.Group>

                            {/* Confirm Password */}
                            <Form.Group>
                                <Form.Label className="input-label">Confirm Password</Form.Label>
                                <Field
                                    type="password"
                                    name="confirmPassword"
                                    className="input-field"
                                    placeholder="Confirm Password"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                            </Form.Group>

                            {/* Phone Number */}
                            <Form.Group>
                                <Form.Label className="input-label">Phone Number</Form.Label>
                                <Field
                                    type="text"
                                    name="phoneNumber"
                                    className="input-field"
                                    placeholder="Enter Phone Number"
                                />
                                <ErrorMessage name="phoneNumber" component="div" className="error-message" />
                            </Form.Group>

                            {/* Submit button */}
                            <div className="button-area">
                                <Button variant="primary" className="btn-action" type="submit">
                                    Sign Up
                                </Button>
                            </div>

                            {/* Login redirect */}
                            <div className="already">
                                <label htmlFor="">
                                    Already have an account? <a href="/login">login here</a> {/* Link to login page */}
                                </label>
                            </div>
                        </FormikForm>
                    )}
                </Formik>
            </div>
            <Footer /> {/* Render Footer component */}
        </>
    );
};

export default SignUpService; 
