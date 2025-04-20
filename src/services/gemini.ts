// Gemini AI API service

const GEMINI_API_KEY = 'AIzaSyDQAOh4iwZFT3HH8lz5apY2WlUSuDkkT9c';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export async function generateResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }
  } catch (error) {
    console.error('Error generating response from Gemini:', error);
    return 'Sorry, I encountered an error generating a response. Please try again.';
  }
}

// Specialized functions for interview scenarios
// Define interface for structured interview question
export interface StructuredQuestion {
  mainQuestion: string;
  context?: string;
  aspectsToAddress: string[];
  followUpQuestions?: string[];
}

export async function generateInterviewQuestion(category: string, difficulty: string, subcategory?: string | null, company?: string): Promise<any> {
  // Build a more specific prompt based on the provided parameters
  let promptContent = `Generate a realistic ${difficulty}-level interview question for a ${category} role`;
  
  if (subcategory) {
    promptContent += ` focused specifically on ${subcategory}`;
  }
  if (company) {
    promptContent += ` in the style of ${company} interviews`;
  }
  promptContent += ` designed to be challenging and relevant.`;

  // NEW: Ask Gemini to break the question into scenario, parts, and follow-ups
  const prompt = `
    ${promptContent}
    
    Break the scenario into a series of smaller, focused sub-questions ("parts") that can be answered one at a time. Each part should be clear and answerable, and the overall scenario/context should be explained at the top. After the main parts, provide a list of follow-up questions for deeper discussion.

    Return your response in the following JSON format:
    {
      "scenario": "Background context for the question",
      "parts": [
        "First focused sub-question",
        "Second focused sub-question",
        ...
      ],
      "followUpQuestions": [
        "First follow-up question",
        ...
      ]
    }
  `;

  try {
    const response = await generateResponse(prompt);
    // Try to parse the response as JSON
    try {
      let jsonContent = response;
      // Extract JSON from markdown code blocks if present
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonContent = jsonMatch[1].trim();
      }
      const parsedResponse = JSON.parse(jsonContent);
      if (parsedResponse.scenario && Array.isArray(parsedResponse.parts)) {
        return parsedResponse; // Return the structured object for the UI
      }
    } catch (e) {
      console.log('Failed to parse JSON response for multi-part question, using text fallback', e);
    }
    // Fallback: Return the response as a single string if parsing fails
    return { scenario: '', parts: [response], followUpQuestions: [] };
  } catch (err) {
    console.error('Error generating interview question:', err);
    return { scenario: '', parts: ['Unable to generate question. Please try again.'], followUpQuestions: [] };
  }
}

export async function generateInterviewFeedback(question: string, answer: string): Promise<any> {
  const prompt = `
    Analyze this interview answer to the following question and provide detailed, constructive feedback:
    
    QUESTION: "${question}"
    
    ANSWER: "${answer}"
    
    Provide comprehensive feedback on the following aspects:
    
    1. Content Quality (depth of knowledge, accuracy, completeness)
    2. Structure and Organization (logical flow, clarity of thought)
    3. Communication Effectiveness (clarity of expression, conciseness)
    4. Problem-Solving Approach (methodology, creativity, consideration of alternatives)
    5. Technical Accuracy (if applicable - correctness of technical concepts)
    6. Specific Examples/Evidence (use of relevant examples to support points)
    
    For each strength identified, explain why it's effective.
    For each area of improvement, provide a specific suggestion on how to enhance it.
    
    Return your response in the following JSON format:
    {
      "score": (a number between 0-100 representing the overall quality of the answer),
      "strengths": ["specific strength 1", "specific strength 2", ...],
      "improvements": ["specific improvement suggestion 1", "specific improvement suggestion 2", ...],
      "summary": "A brief 1-2 sentence overall assessment",
      "details": ["detailed feedback point 1", "detailed feedback point 2", "detailed feedback point 3", ...]
    }
  `;
  
  try {
    const response = await generateResponse(prompt);
    // Attempt to parse the JSON response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                     response.match(/\{[\s\S]*\}/);
                     
    if (jsonMatch) {
      let jsonStr = jsonMatch[1] || jsonMatch[0];
      // Clean up common issues
      jsonStr = jsonStr
        .replace(/^[^{]*{/, '{') // Remove anything before the first '{'
        .replace(/}[^}]*$/, '}') // Remove anything after the last '}'
        .replace(/\\n/g, '') // Remove literal \n
        .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
        .replace(/[“”‘’]/g, '"'); // Replace curly quotes with straight quotes
      try {
        const parsed = JSON.parse(jsonStr);
        return {
          score: parsed.score || 70,
          details: parsed.details || ["Good effort, but try to be more specific."],
          strengths: parsed.strengths || [],
          improvements: parsed.improvements || [],
          summary: parsed.summary || "",
        };
      } catch (parseErr) {
        console.error('Raw Gemini feedback (malformed JSON):', jsonStr);
        throw parseErr;
      }
    }
    
    // If JSON parsing fails, extract feedback points manually
    const feedbackPoints = response
      .split('\n')
      .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[•\-*]\s*/, '').trim())
      .filter(line => line.length > 0);
    
    // Calculate a score based on the sentiment of the response
    const positiveWords = ['excellent', 'good', 'great', 'strong', 'clear', 'effective', 'well'];
    const negativeWords = ['improve', 'lacks', 'missing', 'weak', 'unclear', 'could', 'should'];
    
    let score = 75; // Default score
    let positiveCount = 0;
    let negativeCount = 0;
    
    response.toLowerCase().split(' ').forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) {
      score = Math.min(95, 75 + (positiveCount - negativeCount) * 2);
    } else if (negativeCount > positiveCount) {
      score = Math.max(50, 75 - (negativeCount - positiveCount) * 2);
    }
    
    return {
      score: score,
      details: feedbackPoints.length > 0 ? 
        feedbackPoints : 
        ["Good structure", "Clear communication", "Could add more specific examples"]
    };
  } catch (error) {
    console.error('Error parsing interview feedback:', error);
    // Return fallback data
    return {
      score: 70,
      details: ["Good structure", "Clear communication", "Could add more specific examples"]
    };
  }
}

export async function generateResumeAnalysis(resume: string, jobDescription: string): Promise<{
  matchPercentage: number;
  strengths: string[];
  improvements: string[];
  keywordsMissing: string[];
}> {
  const prompt = `
    Analyze this resume against the job description and provide detailed feedback:
    
    RESUME:
    ${resume}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    Provide the following in JSON format:
    1. A match percentage (number between 0-100)
    2. An array of strengths (maximum 5)
    3. An array of suggested improvements (maximum 5)
    4. An array of keywords from the job description missing in the resume (maximum 5)
  `;
  
  try {
    const response = await generateResponse(prompt);
    // Attempt to parse the JSON response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                      response.match(/\{[\s\S]*\}/);
                      
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      
      return {
        matchPercentage: parsed.matchPercentage || 65,
        strengths: parsed.strengths || [],
        improvements: parsed.improvements || [],
        keywordsMissing: parsed.keywordsMissing || []
      };
    }
    
    // Fallback if JSON parsing fails
    return {
      matchPercentage: 65,
      strengths: ["Good experience section", "Clear education background"],
      improvements: ["Add more quantifiable achievements", "Include relevant keywords"],
      keywordsMissing: ["collaboration", "leadership", "project management"]
    };
  } catch (error) {
    console.error('Error parsing resume analysis:', error);
    // Return fallback data
    return {
      matchPercentage: 65,
      strengths: ["Good experience section", "Clear education background"],
      improvements: ["Add more quantifiable achievements", "Include relevant keywords"],
      keywordsMissing: ["collaboration", "leadership", "project management"]
    };
  }
}
