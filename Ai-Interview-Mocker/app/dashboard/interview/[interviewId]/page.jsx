"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 
import Link from "next/link"; // ✅ Import Link from Next.js
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm"; 
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import WebCam from "react-webcam";
import { useUser } from "@clerk/nextjs";

function Interview() {
  const params = useParams();
  const interviewId = params?.interviewId;
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [webCamError, setWebCamError] = useState(null); // To handle webcam error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUser();

  useEffect(() => {
    if (interviewId) {
      console.log("Interview ID:", interviewId);
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

      if (result.length > 0) {
        setInterviewData(result[0]);
      } else {
        setError("Interview not found.");
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
      setError("Failed to load interview data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle WebCam Access and Permission Error
  const handleWebCam = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          setWebCamEnabled(true); // Webcam access granted
          setWebCamError(null); // Clear previous errors
        })
        .catch((err) => {
          setWebCamEnabled(false); // Failed to enable webcam
          // Handle permission denied error and provide feedback
          if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            setWebCamError("Permission denied. Please allow webcam access in your browser settings.");
          } else {
            setWebCamError("Failed to access webcam. Please check your webcam settings.");
          }
          console.error("Webcam Error:", err);
        });
    } else {
      setWebCamEnabled(false);
      setWebCamError("Your browser does not support webcam access.");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-red-500 text-xl font-semibold">Authentication Required</h2>
        <p>Please log in to access this interview.</p>
      </div>
    );
  }

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10"> {/* Adjusted grid */}
        <div className="flex flex-col items-center">
          {loading ? (
            <p>Loading interview details...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="text-center">
              <div>
                <div className="flex flex-col mt-5 gap-5 p-5 rounded-lg border shadow-md">
                  <h2 className="text-lg"><strong>Job Role:</strong> {interviewData?.jobPosition}</h2>
                  <h2 className="text-lg"><strong>Job Description/Tech Stack:</strong> {interviewData?.jobDesc || "Not Provided"}</h2>
                  <h2 className="text-lg"><strong>Experience Required:</strong> {interviewData?.jobExperience} years</h2>
                </div>
                <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-50 mt-5 shadow-md">
                   <h2 className="flex gap-2 items-center text-yellow-500"><Lightbulb/><strong>Information</strong></h2>
                   <h2 className="mt-3 text-yellow-500">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                  </div>
              </div>
            </div>
          )}
        </div>

        {/* Webcam section on the right */}
        <div className="flex flex-col items-center">
          {webCamEnabled ? (
            <WebCam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              style={{
                height: 300,
                width: 300,
                borderRadius: "10px",
                marginTop: "20px",
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button variant="ghost" onClick={handleWebCam} className="text-lg mt-5">
                Enable WebCam and MicroPhone
              </Button>
              {/* Show error message if webcam access fails */}
              {webCamError && <p className="text-red-500 mt-2">{webCamError}</p>}
            </>
          )}
        </div>
      </div>

      {/* Optional "Start" button */}
      <div className="flex justify-end items-end mt-10">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button onClick={() => alert("Starting Interview...")} className="bg-blue-500 hover:bg-blue-600 text-white">
            Start Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
