"use client";
import React, { useState, useEffect, useRef } from "react";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useParams, useRouter } from "next/navigation";

function RecordAnswerSection() {
  const { interviewId } = useParams();  // Assuming mockId is in the URL (you may adjust if it's passed differently)
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const [error, setError] = useState("");

  // Ensure mockId is available
  useEffect(() => {
    if (!interviewId) {
      setError("❌ Missing interview ID (mockId). Cannot submit answer.");
    }
  }, [interviewId]);

  // Start recording
  const startRecording = async () => {
    if (!window.MediaRecorder) {
      alert("Your browser does not support audio recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const recordedBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(recordedBlob));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("❌ Error accessing microphone:", error);
      alert("Microphone access is required.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Submit answer and save to database
  const submitAnswer = async () => {
    if (!audioUrl || !interviewId) {
      setError("❌ Missing answer or interview ID.");
      return;
    }

    const currentQuestion = "Sample question here"; // Replace with actual question logic
    const aiGeneratedCorrectAnswer = "Sample AI generated answer"; // Replace with actual AI answer

    const aiGeneratedFeedback = {
      question: currentQuestion,
      userAns: audioUrl,
      correctAns: aiGeneratedCorrectAnswer,
      rating: Math.floor(Math.random() * 5) + 1,
      feedback: "Your answer is relevant but could use more depth.",
    };

    try {
      await db.insert(UserAnswer).values({
        mockIdRef: interviewId, // Ensure interviewId is used properly
        question: aiGeneratedFeedback.question,
        userAns: aiGeneratedFeedback.userAns,
        correctAns: aiGeneratedFeedback.correctAns,
        feedback: aiGeneratedFeedback.feedback,
        rating: aiGeneratedFeedback.rating,
        userEmail: "user@example.com", // Replace with actual user email
        createdAt: new Date().toISOString(),
      });

      setFeedback(aiGeneratedFeedback); // Set feedback after submission
    } catch (error) {
      console.error("❌ Error submitting answer:", error);
      setError("❌ Error submitting your answer.");
    }
  };
  
  return (
    <div className="p-5 border rounded-lg">
      <h2 className="text-lg font-bold mb-3">🎤 Answer Recording</h2>

      {error && <p className="text-red-500">{error}</p>}

      {isRecording ? (
        <p className="text-red-500 font-bold">🔴 Recording...</p>
      ) : audioUrl ? (
        <p className="text-green-500 font-bold">✅ Recording Saved!</p>
      ) : (
        <p className="text-gray-500">Press start to record your answer.</p>
      )}

      <div className="mt-3 flex gap-2">
        <button onClick={startRecording} disabled={isRecording} className="p-2 bg-blue-600 text-white rounded-md">
          🎙️ Start Recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording} className="p-2 bg-red-600 text-white rounded-md">
          ⏹️ Stop Recording
        </button>
        <button onClick={submitAnswer} disabled={!audioUrl} className="p-2 bg-green-600 text-white rounded-md">
          ✅ Submit Answer
        </button>
      </div>

      {audioUrl && (
        <div className="mt-3">
          <h3 className="text-lg font-bold">🎧 Playback Your Answer</h3>
          <audio controls src={audioUrl} className="w-full mt-2"></audio>
        </div>
      )}

      {feedback && (
        <div className="border rounded-lg p-3 mt-5 bg-gray-100">
          <h3 className="text-blue-600 font-bold">💡 AI Feedback:</h3>
          <p><strong>Question:</strong> {feedback.question}</p>
          <p><strong>Correct Answer:</strong> {feedback.correctAns}</p>
          <p><strong>Rating:</strong> ⭐ {feedback.rating} / 5</p>
          <p><strong>Feedback:</strong> {feedback.feedback}</p>
          <p><strong>Your Recorded Answer:</strong></p>
          <audio controls src={feedback.userAns} className="w-full mt-2"></audio>
        </div>
      )}
    </div>
  );
}

export default RecordAnswerSection;
