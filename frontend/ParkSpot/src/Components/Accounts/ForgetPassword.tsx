import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./ForgotPassword.css"

function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const token = queryParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePassword = (password:any) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigits = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!hasDigits) {
            return 'Password must contain at least one digit';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character';
        }
        return '';
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const passwordValidationMessage = validatePassword(newPassword);
        if (passwordValidationMessage) {
            setError(passwordValidationMessage);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('https://localhost:7210/api/Account/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, newPassword }),
            });

            if (response.ok) {
                setSuccess('Password reset successful!');
                setTimeout(() => navigate('/login'), 2000); // Redirect to login page
            } else {
                const errorResponse = await response.json();
                setError(errorResponse.message || 'Invalid token or email.');
            }
        } catch (error) {
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (!email || !token) {
        return (
            <div>
                <h2>Error</h2>
                <p>Invalid or missing email or token. Please try again with a valid link.</p>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            <h2 className="reset-password-title">Reset Password</h2>
            {error && <p className="reset-password-error">{error}</p>}
            {success && <p className="reset-password-success">{success}</p>}

            <form className="reset-password-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="newPassword" className="input-label">New Password</label>
                    <input
                        id="newPassword"
                        type="password"
                        className="input-field"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="input-field"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="reset-password-button" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
