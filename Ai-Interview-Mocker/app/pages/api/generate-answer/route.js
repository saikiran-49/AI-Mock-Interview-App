import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Make sure this is set in your .env file
  dangerouslyAllowBrowser: true, // Only for development
});

const generateCorrectAnswer = async (question) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use a suitable model
      messages: [{ role: "system", content: "You are an expert interviewer providing correct answers to questions." },
                 { role: "user", content: question }],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating answer:", error);
    return "Error fetching AI answer.";
  }
};
