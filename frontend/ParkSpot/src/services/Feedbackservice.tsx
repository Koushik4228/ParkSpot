// services/FeedbackService.ts

import axios from 'axios';
import { Feedback } from '../Modal/feedbackmodal';

const BASE_URL = `https://localhost:7253/gateway/Feedback`; // Replace with your actual API endpoint

// Function to add feedback using Axios
export const addFeedback = async (feedback: Feedback): Promise<Feedback> => {
    try {
        const response = await axios.post(BASE_URL, feedback, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'Failed to add feedback');
        } else {
            throw new Error('Failed to add feedback');
        }
    }
};

// Function to fetch all feedbacks
export const getAllFeedbacks = async (): Promise<Feedback[]> => {
    try {
        const response = await axios.get<Feedback[]>(BASE_URL);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'Failed to fetch feedbacks');
        } else {
            throw new Error('Failed to fetch feedbacks');
        }
    }
};
