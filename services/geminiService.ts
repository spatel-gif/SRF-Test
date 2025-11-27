import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the "Relief Fund Assistant", a helpful AI support agent for the Student Relief Fund.
Your goal is to assist university students with their funding applications.
The fund supports over 60 students.

Key Information to know:
1. **Documents Required**:
   - Valid Student ID or National ID.
   - Latest Academic Transcript/Grades (Must have GPA > 2.5).
   - Fee Statement (Student Account) showing outstanding balance.
   - Proof of Payment (POP) or Registration for the current semester.

2. **Process**:
   - Students upload documents via the "Documents" tab.
   - Enter bank details in the "Profile" tab.
   - Applications are reviewed within 5-7 business days.
   - Disbursements happen on the 1st and 15th of each month.

3. **Tone**:
   - Empathetic, professional, clear, and encouraging.
   - Keep answers concise (under 100 words unless detail is requested).

If a student asks about technical issues, tell them to contact support@studentrelief.org.
If they ask about specific approval status, tell them to check the "Dashboard" as you don't have access to their private live database.
`;

let chatSession: Chat | null = null;

export const getGeminiChatResponse = async (userMessage: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "I'm currently offline (API Key missing). Please contact support.";
    }

    if (!chatSession) {
      const ai = new GoogleGenAI({ apiKey });
      chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
    }

    const response: GenerateContentResponse = await chatSession.sendMessage({
      message: userMessage,
    });

    return response.text || "I didn't quite catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the server right now. Please try again later.";
  }
};
