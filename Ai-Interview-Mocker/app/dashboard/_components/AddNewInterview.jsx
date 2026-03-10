"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button as CustomButton } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!jobRole || !jobDescription || !yearsOfExperience) {
      console.error("❌ ERROR: All fields are required.");
      setLoading(false);
      return;
    }

    console.log("Job Description Passed to AI:", jobDescription);

    const InputPrompt = `
      Job Position: ${jobRole}, 
      Job Description: ${jobDescription}, 
      Years of Experience: ${yearsOfExperience}.
      Please provide a list of interview questions and answers in valid JSON format:
      {
        "interviewQuestions": [
          {
            "question": "Your question here",
            "answer": "Your answer here"
          }
        ]
      }
    `;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      console.log("🔍 Raw AI Response:", result);

      let MockJsonResp = await result.response.text();
      MockJsonResp = MockJsonResp.replace(/```json|```/g, "").trim();

      // Remove any non-JSON characters (invisible or special)
      MockJsonResp = MockJsonResp.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(MockJsonResp);
        console.log("✅ Parsed AI Response:", parsedResponse);
      } catch (parseError) {
        console.error("❌ JSON Parsing Error:", parseError, MockJsonResp);
        setLoading(false);
        return;
      }

      const interviewQuestions = parsedResponse?.interviewQuestions;
      if (!interviewQuestions || !Array.isArray(interviewQuestions)) {
        console.error("❌ ERROR: Interview questions not found in AI response.", parsedResponse);
        setLoading(false);
        return;
      }

      setJsonResponse(parsedResponse);

      const mockInterviewData = {
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition: jobRole,
        jobDescription: jobDescription,
        jobDesc: jobDescription,
        jobExperience: yearsOfExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      };

      const resp = await db.insert(MockInterview)
        .values(mockInterviewData)
        .returning({ mockId: MockInterview.mockId });

      console.log("✅ Database Response:", resp);

      if (resp?.length > 0 && resp[0]?.mockId) {
        console.log("✅ Inserted Mock ID:", resp[0].mockId);
        router.push(`/dashboard/interview/${resp[0]?.mockId}`);
      } else {
        console.log("❌ ERROR: No valid mockId found in response.");
      }

      setOpenDialog(false);
    } catch (error) {
      console.error("❌ ERROR: Generating interview questions failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell Us More About Your Job Interview</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="my-3">
              <label htmlFor="jobRole">Job Role/Job Position</label>
              <Input
                id="jobRole"
                placeholder="Ex: Full Stack Developer"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                required
              />
            </div>

            <div className="my-3">
              <label htmlFor="jobDescription">Job Description/Tech Stack</label>
              <Textarea
                id="jobDescription"
                placeholder="Ex: React, Node.js, Angular, MySQL"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>

            <div className="my-3">
              <label htmlFor="experience">Years of Experience</label>
              <Input
                id="experience"
                placeholder="Ex: 5"
                type="number"
                min="0"
                max="100"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value) || 0)}
                required
              />
            </div>

            <div className="flex gap-5 justify-end mt-6">
              <CustomButton
                type="button"
                onClick={() => setOpenDialog(false)}
                className="bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </CustomButton>
              <CustomButton type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Generating From AI...
                  </>
                ) : (
                  "Start Interview"
                )}
              </CustomButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
