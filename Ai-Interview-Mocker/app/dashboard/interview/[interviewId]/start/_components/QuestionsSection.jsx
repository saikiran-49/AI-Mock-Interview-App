import { Lightbulb, Volume2 } from "lucide-react";
import React, { useEffect } from "react";

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex }) {
  // Debugging logs
  console.log("📢 Received Questions:", mockInterviewQuestion);
  console.log("📌 Active Question Index:", activeQuestionIndex);

  useEffect(() => {
    if (!mockInterviewQuestion || !Array.isArray(mockInterviewQuestion) || mockInterviewQuestion.length === 0) {
      console.error("❌ No interview questions found!");
    }
  }, [mockInterviewQuestion]);

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("❌ Your browser does not support text-to-speech.");
    }
  };

  // Ensure valid questions are available
  if (!mockInterviewQuestion || !Array.isArray(mockInterviewQuestion) || mockInterviewQuestion.length === 0) {
    return <p className="text-red-500 font-bold">⚠ No questions available.</p>;
  }

  const currentQuestion = mockInterviewQuestion[activeQuestionIndex]?.question || "⚠ No question available.";

  return (
    <div className="p-5 border rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion.slice(0, 5).map((question, index) => (
          <h2
            key={index}
            className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer transition-all 
              ${activeQuestionIndex === index ? "bg-blue-600 text-white" : "bg-green-500 text-white"}`}
            onClick={() => setActiveQuestionIndex(index)}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      <h2 className="my-5 text-md md:text-lg font-bold">{currentQuestion}</h2>

      <Volume2 className="cursor-pointer inline-block" onClick={() => textToSpeech(currentQuestion)} />

      <div className="border rounded-lg p-5 bg-blue-100 mt-10">
        <h2 className="flex gap-2 items-center text-blue-600">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <p className="text-sm text-blue-600 mt-2">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE || "ℹ No note available."}
        </p>
      </div>
    </div>
  );
}

export default QuestionsSection;
