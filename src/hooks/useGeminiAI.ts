'use client';

import { useState } from 'react';
import * as geminiService from '@/services/gemini';

export function useGeminiAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await geminiService.generateResponse(prompt);
      setIsLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  const generateInterviewQuestion = async (category: string, difficulty: string, subcategory?: string | null, company?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const question = await geminiService.generateInterviewQuestion(category, difficulty, subcategory, company);
      setIsLoading(false);
      return question;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  const generateInterviewFeedback = async (question: string, answer: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const feedback = await geminiService.generateInterviewFeedback(question, answer);
      setIsLoading(false);
      return feedback;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  const analyzeResume = async (resume: string, jobDescription: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const analysis = await geminiService.generateResumeAnalysis(resume, jobDescription);
      setIsLoading(false);
      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  return {
    isLoading,
    error,
    generateResponse,
    generateInterviewQuestion,
    generateInterviewFeedback,
    analyzeResume
  };
}
