import React, { useState } from 'react';
import "./Faq.css";
import Header from '../Header/header';
import Footer from '../Footer/footer';

const Faq: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAnswer = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "What is ParkSpot?",
            answer: "ParkSpot solves the problem of finding or booking available parking slots nearby. We aim to enhance convenience, security, and create additional income opportunities."
        },
        {
            question: "How do I reserve a parking spot?",
            answer: "To reserve a spot, visit our website, enter your desired location and time, view available spots, and complete your booking with payment details."
        },
        {
            question: "What if I can't find my reserved parking spot?",
            answer: "If you can't locate your reserved spot, please contact support through the app or website. We’ll help you find it right away."
        },
        {
            question: "Are there any additional fees?",
            answer: "All fees are displayed during booking. Some locations may include additional service fees or taxes in the total cost."
        },
        {
            question: "Is my reservation guaranteed?",
            answer: "Yes, your reservation is guaranteed once you receive a confirmation email for the selected time and location."
        }
    ];

    return (
        <div className="faq-page">
            <Header />
            <div className="faq-container">
                <h1 className="faq-title">Frequently Asked Questions</h1>
                {faqData.map((item, index) => (
                    <div key={index} className="faq-item">
                        <h2 onClick={() => toggleAnswer(index)} className="faq-question">
                            {item.question}
                            <span className="faq-icon">{openIndex === index ? '-' : '+'}</span>
                        </h2>
                        {openIndex === index && (
                            <div className="faq-answer">
                                <p>{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Footer/>
        </div>
    );
};

export default Faq;
