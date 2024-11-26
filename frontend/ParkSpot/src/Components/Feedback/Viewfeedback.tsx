import React, { useEffect, useState } from 'react';
import { Feedback } from '../../Modal/feedbackmodal';
import { getAllFeedbacks } from '../../services/Feedbackservice';
import './Viewfeedback.css'; // Optional CSS for styling
import { useSelector } from 'react-redux';
import { RootState } from '../Accounts/Store/mystore';

const FeedbackList: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const userId = useSelector((state: RootState) => state.user.userId); // Use RootState here

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const feedbackList = await getAllFeedbacks();
                setFeedbacks(feedbackList);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch feedbacks.');
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    if (loading) {
        return <p className="loading-message">Loading feedbacks...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <>
            <h1 style={{ marginTop: '100px', marginLeft: '400px' }} className="feedback-title">All Feedbacks</h1>
            <div className="feedback-list-container">
                <table className="feedback-table table-striped">
                    <thead className="feedback-table-header">
                        <tr className="feedback-table-row">
                            <th className="feedback-table-header-cell">User ID</th>
                            <th className="feedback-table-header-cell">Message</th>
                            <th className="feedback-table-header-cell">Rating</th>
                            <th className="feedback-table-header-cell">Slot ID</th>
                        </tr>
                    </thead>
                    <tbody className="feedback-table-body">
                        {feedbacks.length > 0 ? (
                            feedbacks.map((feedback) => (
                                <tr key={feedback.userId + feedback.slotId} className="feedback-table-body-row">
                                    <td className="feedback-table-body-cell">{feedback.userId}</td>
                                    <td className="feedback-table-body-cell">{feedback.message}</td>
                                    <td className="feedback-table-body-cell">{feedback.rating}</td>
                                    <td className="feedback-table-body-cell">{feedback.slotId}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="no-feedback-row">
                                <td colSpan={4} className="no-feedback-cell">No feedbacks available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default FeedbackList;
