"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function Feedback() {
  const params = useParams();
  const interviewId = params?.interviewId;
  const [feedbackData, setFeedbackData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (interviewId) {
      GetFeedback(interviewId);
    } else {
      setError("⚠ Interview ID is missing.");
      setLoading(false);
    }
  }, [interviewId]);

  const GetFeedback = async (interviewId) => {
    try {
      const result = await db
        .select({
          id: UserAnswer.id,
          question: UserAnswer.question,
          correctAns: UserAnswer.correctAns,
          userAns: UserAnswer.userAns,
          feedback: UserAnswer.feedback,
          rating: UserAnswer.rating,
        })
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.id);

      if (result.length === 0) {
        setError("⚠ No feedback found for the provided interview ID.");
      } else {
        setFeedbackData(result);
      }
    } catch (error) {
      setError("⚠ Failed to fetch feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const averageRating = feedbackData.length
    ? (feedbackData.reduce((sum, item) => sum + Number(item.rating), 0) / feedbackData.length).toFixed(1)
    : "N/A";

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">🎉 Congratulations!</h2>
      <h2 className="font-bold text-2xl">Here is your Interview Feedback</h2>
      <h2 className="text-blue-500 text-lg my-3">
        Your overall Rating is: <strong>{averageRating}</strong>/5
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <div className="spinner">⏳ Loading...</div>
      ) : feedbackData.length === 0 ? (
        <h2 className="font-bold text-xl text-gray-500">No interview record found</h2>
      ) : (
        <ul className="mt-5">
          {feedbackData.map((item, index) => (
            <Collapsible key={index} className="mt-7">
              <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 flex justify-between text-left gap-7 w-full">
                {item.question || "❓ Question not found"} <ChevronsUpDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-2">
                <p className="p-2 border rounded-lg text-red-500">
                  <strong>Rating:</strong> {item.rating ? item.rating : "⚠ No rating provided"}/5
                </p>
                <p className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                  <strong>Your Answer:</strong> {item.userAns ? <audio controls src={item.userAns}></audio> : "❌ No answer provided"}
                </p>
                <p className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                  <strong>Correct Answer:</strong>{" "}
                  {item.correctAns && item.correctAns !== "Not provided" ? item.correctAns : "⚠ AI-generated answer not available"}
                </p>
                <p className="p-2 border rounded-lg bg-blue-50 text-sm text-blue-500">
                  <strong>Feedback:</strong> {item.feedback || "ℹ No feedback provided"}
                </p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </ul>
      )}

      <Button className="bg-blue-400 mt-5" onClick={() => router.replace("/dashboard")}>
        🏠 Go Home
      </Button>
    </div>
  );
}

export default Feedback;
