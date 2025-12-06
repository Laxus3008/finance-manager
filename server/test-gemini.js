import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'Found' : 'NOT FOUND');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    console.log('Success!', response.text());
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();