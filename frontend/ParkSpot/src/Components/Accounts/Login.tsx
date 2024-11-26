import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // Importing custom CSS styles for the login page
import { login, sendPasswordResetEmail } from './Service/user.service'; // Importing login and password reset service
import { jwtDecode } from 'jwt-decode'; // Importing JWT decoding utility
import { useNavigate } from 'react-router'; // React Router hook for navigation
import { notification } from 'antd'; // Ant Design notification component
import { useDispatch } from 'react-redux'; // Redux hook to dispatch actions
import { loginn, setRole } from './AppSlicer/userslicer'; // Importing actions to update Redux state
import Header from '../Header/header'; // Importing Header component
import { Link } from 'react-router-dom'; // React Router's Link component for navigation
import Footer from '../Footer/footer'; // Importing Footer component

// Functional component for Login
const Login: React.FC = () => {
    const [isForgotPassword, setIsForgotPassword] = useState(false); // State to toggle between login and forgot password forms
    const navigate = useNavigate(); // Hook for navigation to different pages
    const dispatch = useDispatch(); // Hook to dispatch Redux actions

    // Initial form values for email and password
    const initialValues = {
        email: '',
        password: ''
    };

    // Yup validation schema for form validation
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    });

    // Handle login form submission logic
    const handleSubmitLogin = async (values: any) => {
        try {
            const response = await login(values.email, values.password);
            const token = response.data; // Get token from response

            // Store token in local storage
            localStorage.setItem('token', token);
    
            const decodedToken = jwtDecode<any>(token);
            const userRole = decodedToken.role; // Extract user role from the decoded token

            // Dispatch Redux actions to update the global state with user details
            dispatch(loginn(decodedToken.nameid));
            dispatch(setRole(decodedToken.role));
    
            // Navigate based on user role
            if (userRole === 'service') {
                navigate('/servicelandingpage'); // Service user landing page
            } else if (userRole === 'user') {
                navigate('/userlandingpage'); // Regular user landing page
            } else {
                navigate('/admindashboard'); // Admin dashboard
            }
    
            notification.success({
                message: 'Login Success',
                description: 'You have successfully logged in!',
            });
        } catch (error: any) {
            // Check if the error has a response (i.e., it came from the backend)
            if (error.response) {
                // Check for specific error status codes or messages
                if (error.response.status === 400 || error.response.status === 401) {
                    // Handle custom login failure error
                    notification.error({
                        message: 'Login Failed',
                        description: error.response.data?.Message || 'Invalid username or password.',
                    });
                } else {
                    // For unexpected errors or server issues
                    notification.error({
                        message: 'Login Failed',
                        description: error.response.data?.Message || 'An unexpected error occurred. Please try again later.',
                    });
                }
            } else {
                // Handle network or other errors
                notification.error({
                    message: 'Login Failed',
                    description: 'Network error or unable to connect to the server.',
                });
            }
        }
    };

    // Handle forgot password form submission
    const handleForgotPassword = async (values: any) => {
        try {
            console.log("clicked")
            // Call API to send password reset email
            console.log(values.email);
            await sendPasswordResetEmail(values.email);
          

            // Show success notification
            notification.success({
                message: 'Password Reset Email Sent',
                description: 'If the email exists in our system, a reset link has been sent.',
            });

            // Optionally, redirect to login after the email is sent
            setIsForgotPassword(false); // Return to login form
        } catch (error) {
            // Show error notification if something goes wrong
            notification.error({
                message: 'Failed to Send Email',
                description: 'There was an issue sending the password reset email. Please try again.',
            });
        }
    };

    return (
        <>
            <Header /> {/* Render Header component */}

            <div className="login-page-container">
                {/* Main container for the login form */}
                <div className="login-form-container">
                    <h2 className="login-title">{isForgotPassword ? 'Forgot Password' : 'Login'}</h2>

                    {/* Formik form for handling form state and validation */}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={!isForgotPassword ? handleSubmitLogin :handleForgotPassword } // Conditionally handle form submission
                    >
                        {({ handleSubmit }) => (
                            <FormikForm onSubmit={handleSubmit}> {/* Form submission handler */}

                                {/* Email Input Field */}
                                <Form.Group>
                                    <Form.Label className="login-form-label">Email</Form.Label>
                                    <Field
                                        type="email"
                                        name="email"
                                        className="login-input"
                                        placeholder="Enter email"
                                    />
                                    {/* Error message for email field */}
                                    <ErrorMessage name="email" component="div" className="login-error-message" />
                                </Form.Group>

                                {/* Conditionally render password field if not in forgot password mode */}
                                {!isForgotPassword && (
                                    <Form.Group>
                                        <Form.Label className="login-form-label">Password</Form.Label>
                                        <Field
                                            type="password"
                                            name="password"
                                            className="login-input"
                                            placeholder="Enter password"
                                        />
                                        {/* Error message for password field */}
                                        <ErrorMessage name="password" component="div" className="login-error-message" />
                                    </Form.Group>
                                )}

                                {/* Link for Forgot Password */}
                                {!isForgotPassword && (
                                    <div className="login-link-container1">
                                        <Link to="" onClick={() => {setIsForgotPassword(true) ;}
                                        } className="forgot-password-link">Forgot Password?</Link>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="login-button-container">
                                    <Button variant="primary" className="login-submit-button" type="submit">
                                        {isForgotPassword ? 'Send Email' : 'Login'}
                                    </Button>
                                </div>
                            </FormikForm>
                        )}
                    </Formik>

                    {/* Register Link for users who don't have an account */}
                    {!isForgotPassword && (
                        <div className="register-link-container">
                            <label>Don't have an account? <Link to="/signupuser">Register</Link></label>
                        </div>
                    )}
                </div>
            </div>

            <Footer /> {/* Render Footer component */}
        </>
    );
};

export default Login;
