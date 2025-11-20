import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

export const initializeChat = async () => {
  if (!apiKey) {
    console.warn("No API Key found for Gemini.");
    return;
  }
  
  try {
    ai = new GoogleGenAI({ apiKey });
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  } catch (error) {
    console.error("Failed to initialize Gemini:", error);
  }
};

export const sendMessageToLibrarian = async (message: string): Promise<string> => {
  if (!chatSession) {
    if (!apiKey) return "The archives are currently sealed (Missing API Key).";
    await initializeChat();
  }

  if (!chatSession) return "The Librarian is currently unavailable.";

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "...";
  } catch (error) {
    console.error("Error consulting the librarian:", error);
    return "The ink has smudged; I cannot read your request.";
  }
};