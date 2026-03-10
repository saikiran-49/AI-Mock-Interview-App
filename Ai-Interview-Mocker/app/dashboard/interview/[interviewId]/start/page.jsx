"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ Import useRouter
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";

function StartInterview() {
  const { interviewId } = useParams();
  const router = useRouter(); // ✅ Initialize Router
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewData, setMockInterviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (result.length === 0) {
        throw new Error("Interview not found.");
      }

      let jsonMockResp = result[0].jsonMockResp;
      if (typeof jsonMockResp === "string") {
        jsonMockResp = JSON.parse(jsonMockResp);
      }

      const interviewQuestions = jsonMockResp?.interviewQuestions || [];
      if (!Array.isArray(interviewQuestions) || interviewQuestions.length === 0) {
        throw new Error("No valid questions found.");
      }

      setMockInterviewData(interviewQuestions);
      setInterviewData(result[0]);
    } catch (err) {
      console.error("Error fetching interview details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterview = () => {
    console.log("🎤 Interview Ended");
    alert("Interview Ended");

    // ✅ Redirect to feedback page after interview ends
    router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center mt-10 px-5">
        {loading ? (
          <p>Loading interview details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <QuestionsSection 
              mockInterviewQuestion={mockInterviewData} 
              activeQuestionIndex={activeQuestionIndex}
              setActiveQuestionIndex={setActiveQuestionIndex} 
            />
            <RecordAnswerSection 
              mockInterviewQuestion={mockInterviewData} 
              activeQuestionIndex={activeQuestionIndex}
              interviewData={interviewData}
            />
          </>
        )}
      </div>

      {/* ✅ Navigation Buttons */}
      <div className="flex justify-end gap-6 mt-5">
        {activeQuestionIndex > 0 && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          >
            Previous Question
          </button>
        )}

        {/* ❌ Hide "Next Question" button on Question 5 (Index 4) */}
        {activeQuestionIndex < 4 && (
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
          >
            Next Question
          </button>
        )}

        {/* ✅ Show "End Interview" Button on Question 5 (Index 4) */}
        {activeQuestionIndex === 4 && (
          <button 
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            onClick={handleEndInterview} // ✅ Calls router.push()
          >
            End Interview
          </button>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
