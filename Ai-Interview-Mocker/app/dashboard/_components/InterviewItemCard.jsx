"use client";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import icons

function InterviewItemCard({ interview }) {
    const router = useRouter();

    const onStart = () => {
        router.push(`/dashboard/interview/${interview?.mockId}`);
    };

    const onFeedbackPress = () => {
        router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
    };

    return (
        <div className='border shadow-sm rounded-lg p-3 mb-4'>
            {/* Display job position */}
            <h2 className='font-bold text-blue-500'>{interview?.jobPosition} Job Position</h2>
            <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years Of Experience</h2>
            <h2 className='text-xs text-gray-400'>Created At: {interview?.createdAt ? new Date(interview.createdAt).toLocaleString() : 'Unknown'}</h2>

            {/* Buttons */}
            <div className='flex justify-between mt-2'>
                <Button size="sm" variant="outline" className='w-full' onClick={onFeedbackPress}>
                    Feedback
                </Button>
                <Button size="sm" className="bg-blue-500 w-full" onClick={onStart}>
                    Start
                </Button>
            </div>

            
        </div>
    );
}

export default InterviewItemCard;
