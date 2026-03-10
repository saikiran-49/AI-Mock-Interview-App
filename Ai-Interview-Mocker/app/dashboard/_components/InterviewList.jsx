"use client";
import { db } from '@/utils/db';  // Ensure correct path
import { MockInterview } from '@/utils/schema';  // Ensure correct path
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewItemCard from './InterviewItemCard';  

function InterviewList() {
  const { user } = useUser();  
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    try {
      if (!db) {
        console.error("DB is not initialized.");
        return;
      }

      const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(MockInterview.id));

      setInterviewList(result);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  return (
    <div>
      <h2 className='font-medium text-xl mb-4'>Previous Mock Interviews</h2>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewList.length === 0 ? (
          <p className="text-gray-500">No interviews found.</p>
        ) : (
          interviewList.map((interview, index) => (
            <InterviewItemCard key={interview.id || index} interview={interview} />
          ))
        )}
      </div>
    </div>
  );
}

export default InterviewList;
