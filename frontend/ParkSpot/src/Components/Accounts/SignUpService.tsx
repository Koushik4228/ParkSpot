import React, { Component } from 'react'; 
import { Button, Form } from 'react-bootstrap'; 
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik'; 
import * as Yup from 'yup'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './SignupService.css'; 
import { addUser, requestOtp, verifyOtp } from '../Accounts/Service/user.service'; 
import Header from '../Header/header'; 
import Footer from '../Footer/footer'; 
import { notification } from 'antd'; 
import { useNavigate } from 'react-router-dom';

// Password strength component that shows a color-coded meter based on password strength
const PasswordStrengthMeter: React.FC<{ strength: string }> = ({ strength }) => {
    // Function to return the appropriate color for the password strength
    const getColor = () => {
        switch (strength) {
            case 'weak':
                return 'red'; // Red for weak password
            case 'medium':
                return 'orange'; // Orange for medium strength password
            case 'strong':
                return 'green'; // Green for strong password
            default:
                return 'transparent'; // Default transparent if no strength
        }
    };

    return <div style={{ height: '5px', width: '100%', backgroundColor: getColor() }} />;
};

// Define the types for Formik values
interface FormValues {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    otp: string; // OTP field added for email verification
}

// Props type for the SignUpService component
interface SignUpProps {
    navigate: (path: string) => void; // Used for navigation after successful signup
}

// State type for the SignUpService component
interface SignUpState {
    passwordStrength: string; // To track password strength
    isOtpSent: boolean; // Flag to track if OTP is sent
    otp: string; // The OTP entered by the user
    isOtpVerified: boolean; // Flag to track OTP verification status
}

// SignUpService class component for handling sign-up functionality
class SignUpService extends Component<SignUpProps, SignUpState> {
    state: SignUpState = {
        passwordStrength: '', // Initial password strength is empty
        isOtpSent: false, // OTP not sent initially
        otp: '', // Initial OTP is empty
        isOtpVerified: false, // OTP not verified initially
    };

    // Initial form values for Formik
    initialValues: FormValues = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: '', // Initial OTP is empty
    };

    // Validation schema for the form using Yup
    validationSchema = Yup.object({
        firstName: Yup.string()
            .matches(/^[A-Za-z]+$/, 'First Name must contain only letters') // Validate first name contains only letters
            .required('First Name is required'),
        lastName: Yup.string()
            .matches(/^[A-Za-z]+$/, 'Last Name must contain only letters') // Validate last name contains only letters
            .required('Last Name is required'),
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
            .oneOf([Yup.ref('password')], 'Passwords must match') // Ensure passwords match
            .required('Confirm Password is required'),
        otp: Yup.string()
            .required('OTP is required'), // Validate OTP
    });

    // Function to check password strength and update state
    checkPasswordStrength = (password: string) => {
        // Regular expressions to check for strong or medium passwords
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const mediumPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (strongPasswordRegex.test(password)) {
            this.setState({ passwordStrength: 'strong' }); // Strong password
        } else if (mediumPasswordRegex.test(password)) {
            this.setState({ passwordStrength: 'medium' }); // Medium password
        } else {
            this.setState({ passwordStrength: 'weak' }); // Weak password
        }
    };

    // Handle sending OTP to user's email
    handleSendOtp = async (email: string) => {
        try {
            const response = await requestOtp(email); // Make API call to request OTP
            if (response.data) {
                this.setState({ isOtpSent: true }); // Mark OTP as sent
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
            console.error('Error sending OTP', error); // Log error if OTP sending fails
            notification.error({
                message: 'Error',
                description: 'There was an error sending the OTP.',
            });
        }
    };

    // Handle verifying OTP entered by user
    handleVerifyOtp = async (email: string, otp: string) => {
        try {
            const response = await verifyOtp(email, otp); // Make API call to verify OTP
            if (response.data) {
                this.setState({ isOtpVerified: true }); // Mark OTP as verified
                notification.success({
                    message: 'OTP Verified',
                    description: 'OTP verified successfully. You can now complete the sign-up.',
                });
                return true;
            } else {
                notification.error({
                    message: 'Invalid OTP',
                    description: 'The OTP you entered is incorrect.',
                });
                return false;
            }
        } catch (error) {
            console.error('Error verifying OTP', error); // Log error if OTP verification fails
            notification.error({
                message: 'Error',
                description: 'There was an error verifying the OTP.',
            });
            return false;
        }
    };

    // Handle form submission (sign up process)
    handleSubmit = async (values: FormValues) => {
        const { otp, confirmPassword, ...userData } = values; // Extract OTP and confirmPassword for validation

        // Ensure OTP is verified before submitting form
        if (!this.state.isOtpVerified) {
            notification.error({
                message: 'Email Not Verified',
                description: 'Please verify your email by entering the OTP.',
            });
            return;
        }

        try {
            const userWithRole = { ...userData, role: 'service' }; // Add role to user data
            const response = await addUser(userWithRole); // Make API call to add the user
            console.log(response); // Log the response

            notification.success({
                message: 'Registration Successful',
                description: 'You have registered successfully!',
            });

            this.props.navigate('/login'); // Navigate to login page on success
        } catch (error) {
            console.error('There was an error saving the data!', error); // Log error if registration fails
            notification.error({
                message: 'Registration Failed',
                description: 'Error saving data: ' + error,
            });
        }
    };

    render() {
        const { passwordStrength, isOtpSent } = this.state;

        return (
            <>
                <Header /> {/* Header component */}
                <div className="form-box">
                    <h2 className="title-heading">Join Us as Service Provider</h2>
                    <div className="service-provider-area">
                        <h6 className="service-provider-label">
                            Are you a user? <a className="registerHere" href="/signupuser">Register Here</a>
                        </h6>
                    </div>
                    <Formik
                        initialValues={this.initialValues} // Initial values for the form
                        validationSchema={this.validationSchema} // Validation schema for the form
                        onSubmit={this.handleSubmit} // Form submit handler
                    >
                        {({ handleSubmit, setFieldValue, values }) => (
                            <FormikForm onSubmit={handleSubmit}>
                                {/* First Name */}
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
                                        onClick={() => this.handleSendOtp(values.email)} // Send OTP on button click
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
                                                onClick={() => this.handleVerifyOtp(values.email, values.otp)} // Verify OTP on button click
                                            >
                                                Submit OTP
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* Password Fields */}
                                <Form.Group>
                                    <Form.Label className="input-label">Password</Form.Label>
                                    <Field
                                        type="password"
                                        name="password"
                                        className="input-field"
                                        placeholder="Enter Password"
                                        onChange={(e: any) => {
                                            const { value } = e.target;
                                            setFieldValue('password', value); // Set password value in Formik state
                                            this.checkPasswordStrength(value); // Check password strength
                                        }}
                                    />
                                    <ErrorMessage name="password" component="div" className="error-message" />
                                    <PasswordStrengthMeter strength={passwordStrength} /> {/* Display password strength meter */}
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

                                {/* Submit Button */}
                                <div className="button-area">
                                    <Button variant="primary" className="btn-action" type="submit">
                                        Sign Up
                                    </Button>
                                </div>

                                {/* Link to login page */}
                                <div className="already">
                                    <label htmlFor="">
                                        Already have an account? <a href="/login">login here</a>
                                    </label>
                                </div>
                            </FormikForm>
                        )}
                    </Formik>
                </div>
                <Footer /> {/* Footer component */}
            </>
        );
    }
}

// Wrap SignUpService component with useNavigate for routing
const SignUpServiceWithNavigate = (props: any) => {
    const navigate = useNavigate(); // Get the navigate function
    return <SignUpService {...props} navigate={navigate} />; // Pass navigate as a prop
};

export default SignUpServiceWithNavigate; // Export the wrapped component
