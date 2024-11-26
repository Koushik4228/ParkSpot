import React from 'react';
import './Feedback.css';
import { Feedback } from '../../Modal/feedbackmodal';
import { addFeedback } from '../../services/Feedbackservice';
import { useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '../Accounts/Store/mystore';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Userheader from '../UserForm/UserDashboardheader/Userheader';

const validationSchema = Yup.object({
    message: Yup.string().required('Feedback message is required'),
    rating: Yup.number().required('Rating is required').min(1).max(5),
});

const FeedbackForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.user.userId);
    const { slotId } = location.state || {};

    const initialValues: Feedback = {
        userId: userId || 0,
        message: '',
        rating: 0,
        slotId,
    };

    const handleSubmit = async (values: Feedback) => {
        try {
            await addFeedback(values);
            console.log("from redux", userId)
            console.log(slotId)
            alert('Feedback submitted successfully!');
            navigate('/'); // Navigate after successful submission
        } catch (error) {
            alert('Failed to submit feedback. Please try again.');
        }
    };

    return (
        <>
            <Userheader></Userheader>
            <div className="container10">
                <h2>Feedback Form</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleSubmit, setFieldValue, values }) => (
                        <div className="feedback-form-structure">
                            <div className="form-group">
                                <label htmlFor="message" className="feedback-message">Send Us Your Feedback</label>
                                <Field
                                    as="textarea"
                                    id="message"
                                    name="message"
                                    className="feedback-textarea"
                                    required />
                                <ErrorMessage name="message" component="div" className="feedback-error" />
                            </div>

                            <div className="form-group">
                                <label>Satisfaction Level</label>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <span
                                            key={value}
                                            className={`star ${values.rating >= value ? 'checked' : ''}`}
                                            onClick={() => setFieldValue('rating', value)} // Dynamically set rating value
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <ErrorMessage name="rating" component="div" className="feedback-error" />
                            </div>

                            <button
                                type="button"
                                className="feedback-button"
                                onClick={() => handleSubmit()} // Trigger Formik handleSubmit
                            >
                                Submit Feedback
                            </button>
                        </div>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default FeedbackForm;
