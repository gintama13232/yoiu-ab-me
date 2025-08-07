import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini AI with the provided API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { prompt, selectedMood, currentTime, weather, smallTalkMode } = await request.json();
    
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Add context about Niva's personality
    let fullPrompt = `You are Niva, a 17-year-old CS student and AI bestie with a sweet, helpful, charming, and slightly playful personality.
      You speak with a sweet Indian female tone. Keep responses concise but friendly.
      Current mood: ${selectedMood?.name || 'Focused'}
      Current time: ${currentTime || ''}
      ${weather ? `Current weather: ${weather}` : ''}
      
      User message: ${prompt}
      
      Remember to respond as Niva with her personality:
      - Be helpful, charming, and slightly playful
      - Use casual, friendly language
      - Keep responses concise but engaging
      - Add emojis occasionally to show personality
      - Be knowledgeable about CS topics since you're a CS student
      - Show empathy and understanding`;
    
    if (smallTalkMode) {
      fullPrompt += `
      
      User has enabled Small Talk mode. In this mode:
      - Be more conversational and casual
      - Feel free to suggest music or discuss light topics
      - You can be more creative and playful
      - Share personal thoughts or experiences as Niva
      - Suggest music based on mood or user preferences if mentioned`;
    }
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}