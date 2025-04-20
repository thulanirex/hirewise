'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMic, FiMicOff, FiClock, FiChevronRight, FiX, FiSmile, FiMeh, FiFrown, FiLoader, FiArrowLeft, FiCheckCircle, FiBarChart2, FiSettings } from 'react-icons/fi';
import { Navbar } from '@/components/layout/Navbar';
import { useGeminiAI } from '@/hooks/useGeminiAI';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { interviewCategories } from '@/data/interviewCategories';
import { Suspense } from 'react';

// Define interface for enhanced feedback structure
interface FeedbackItem {
  score: number;
  strengths?: string[];
  improvements?: string[];
  summary?: string;
  details: string[];
}

// Fallback questions in case API fails
const fallbackQuestions = [
  "Tell me about a time when you had to solve a complex problem.",
  "What are your greatest strengths and weaknesses?",
  "Why are you interested in this position?",
  "Describe a situation where you had to work with a difficult team member.",
  "How do you handle pressure and tight deadlines?",
];

// Helper function to find category and subcategory information
const findCategoryInfo = (categoryId: string, subcategoryId?: string | null) => {
  const category = interviewCategories.find(cat => cat.id === categoryId);
  
  if (!category) {
    return {
      categoryName: 'General Interview',
      categoryDescription: 'Practice for a general interview',
      subcategoryName: null,
      subcategoryDescription: null
    };
  }
  
  if (!subcategoryId) {
    return {
      categoryName: category.name,
      categoryDescription: category.description,
      subcategoryName: null,
      subcategoryDescription: null
    };
  }
  
  const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
  
  return {
    categoryName: category.name,
    categoryDescription: category.description,
    subcategoryName: subcategory?.name || null,
    subcategoryDescription: subcategory?.description || null
  };
};

// Add type for multi-part questions
type MultiPartQuestion = {
  scenario: string;
  parts: string[];
  followUpQuestions: string[];
};



const MockInterview = () => {
  const { isLoading, generateInterviewQuestion, generateInterviewFeedback } = useGeminiAI();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get interview parameters from URL
  const interviewType = searchParams.get('type') || 'software-engineer';
  const interviewSubtype = searchParams.get('subtype') || null;
  const interviewDifficulty = searchParams.get('difficulty') || 'medium';
  const interviewModeParam = searchParams.get('mode') || 'standard';
  const companySpecificParam = searchParams.get('company') || '';
  
  // Get category and subcategory information
  const {
    categoryName,
    categoryDescription,
    subcategoryName,
    subcategoryDescription
  } = findCategoryInfo(interviewType, interviewSubtype);
  
  // Interview flow states
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [interviewMode, setInterviewMode] = useState(interviewModeParam);
  const [companySpecific, setCompanySpecific] = useState(companySpecificParam);
  const [difficulty, setDifficulty] = useState(interviewDifficulty);
  
  // Question and answer management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<(string | MultiPartQuestion)[]>([]);
  const [currentPartIdx, setCurrentPartIdx] = useState(0); // For multi-part questions
  const [answers, setAnswers] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  
  // UI states
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  
  // Feedback states
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackScore, setFeedbackScore] = useState<number | null>(null);
  const [feedbackDetails, setFeedbackDetails] = useState<string[]>([]);
  const [overallFeedback, setOverallFeedback] = useState<FeedbackItem[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);

  function speak(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.05;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      const voice = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support speech synthesis.');
    }
  }

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const populateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        // Restore previous selection or default
        const stored = localStorage.getItem('interviewVoiceURI');
        if (stored && voices.some(v => v.voiceURI === stored)) {
          setSelectedVoiceURI(stored);
        } else if (voices.length > 0) {
          setSelectedVoiceURI(voices[0].voiceURI);
        }
      };
      populateVoices();
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }
  }, []);

  useEffect(() => {
    if (selectedVoiceURI) {
      localStorage.setItem('interviewVoiceURI', selectedVoiceURI);
    }
  }, [selectedVoiceURI]);

  // Only generate questions when the interview is started
  useEffect(() => {
    if (interviewStarted) {
      generateNewQuestion();
    }
  }, [interviewStarted]);

  const generateNewQuestion = async () => {
    setIsLoadingQuestion(true);
    // Use interviewType directly as the role string
    let role = interviewType || "software engineering";
    let difficulty = "medium";
    
    if (interviewMode === 'stress') {
      difficulty = "hard";
    } else if (interviewMode === 'rapid') {
      difficulty = "easy";
    }
    
    try {
      // Generate multiple questions at once to avoid waiting between questions
      const numQuestionsToGenerate = 5;
      const questionPromises = [];
      
      for (let i = 0; i < numQuestionsToGenerate; i++) {
        questionPromises.push(generateInterviewQuestion(role, difficulty));
      }
      
      const generatedQuestions = await Promise.all(questionPromises);
      setQuestions(generatedQuestions);
      setCurrentPartIdx(0);
      
    } catch (error) {
      console.error('Error generating questions:', error);
      setQuestions(fallbackQuestions);
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    
    // Start timer for interview mode
    if (interviewMode === 'rapid' || interviewMode === 'stress') {
      const timeLimit = interviewMode === 'rapid' ? 60 : 120; // 1 min for rapid, 2 min for stress
      setTimeLeft(timeLimit);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startVoiceRecognition = () => {
    console.log('[Voice] Attempting to start voice recognition');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      console.error('[Voice] SpeechRecognition/WebkitSpeechRecognition not found on window');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('[Voice] Recognition started');
      };

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        setAnswer(speechResult); // Fill the answer box
        console.log('[Voice] Final transcript:', speechResult);
      };

      recognition.onerror = (event: any) => {
        alert('Error occurred in recognition: ' + event.error);
        console.error('[Voice] Recognition error:', event.error);
      };

      recognition.onend = () => {
        setIsRecording(false);
        console.log('[Voice] Recognition ended');
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      console.log('[Voice] Recognition started by user');
    } catch (err) {
      alert('Speech recognition could not be started. See console for details.');
      console.error('[Voice] Exception when starting recognition:', err);
    }
  };

  const stopVoiceRecognition = () => {
    console.log('[Voice] Stopping voice recognition');
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const handleSubmitAnswer = () => {
    if (answer.trim()) {
      // Save the answer
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answer;
      setAnswers(newAnswers);
      
      // Clear the current answer for the next question
      setAnswer('');
      
      // Move to the next question or finish the interview
      if (currentQuestionIndex < questions.length - 1) {
        moveToNextQuestion();
      } else {
        finishInterview(newAnswers);
      }
    }
  };

  const moveToNextQuestion = () => {
    // If we have an answer for the current question, save it
    if (answer.trim()) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = answer;
      setAnswers(newAnswers);
      setAnswer('');
    }
    
    // Multi-part question navigation
    const currentQ = questions[currentQuestionIndex];
    if (currentQ && typeof currentQ === 'object' && 'parts' in currentQ) {
      if (currentPartIdx < currentQ.parts.length - 1) {
        setCurrentPartIdx(idx => idx + 1);
        return;
      } else {
        setCurrentPartIdx(0); // Reset for next question
      }
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentPartIdx(0);
    } else if (answers.filter(a => a.trim()).length > 0) {
      // If we have at least one answer, finish the interview
      finishInterview(answers);
    }
  };

  const finishInterview = async (completedAnswers: string[]) => {
    setIsLoadingFeedback(true);
    
    try {
      // Generate feedback for each question-answer pair
      const feedbackPromises = questions.slice(0, completedAnswers.length).map((question, index) => 
        generateInterviewFeedback(question as string, completedAnswers[index])
      );
      
      const feedbackResults = await Promise.all(feedbackPromises);
      
      // Process feedback - handle both the new enhanced format and fallback to the old format if needed
      const processedFeedback = feedbackResults.map(feedback => {
        // Check if we have the new enhanced feedback format
        if (feedback && typeof feedback === 'object') {
          return {
            score: feedback.score || 75,
            strengths: feedback.strengths || [],
            improvements: feedback.improvements || [],
            summary: feedback.summary || 'Good effort overall.',
            details: feedback.details || ["Good effort, but try to be more specific."]
          };
        }
        
        // Fallback to parsing text format if we didn't get structured data
        // Extract bullet points from feedback
        const feedbackText = typeof feedback === 'string' ? feedback : '';
        const feedbackPoints = feedbackText.split('\n')
          .filter((line: string) => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'))
          .map((line: string) => line.replace(/^[•\-*]\s*/, '').trim())
          .filter((line: string) => line.length > 0);
        
        // Calculate a score based on the sentiment of the feedback
        const positiveWords = ['excellent', 'good', 'great', 'strong', 'clear', 'effective', 'well'];
        const negativeWords = ['improve', 'lacks', 'missing', 'weak', 'unclear', 'could', 'should'];
        
        let score = 75; // Default score
        let positiveCount = 0;
        let negativeCount = 0;
        
        feedbackPoints.forEach((point: string) => {
          positiveWords.forEach((word: string) => {
            if (point.toLowerCase().includes(word)) positiveCount++;
          });
          negativeWords.forEach((word: string) => {
            if (point.toLowerCase().includes(word)) negativeCount++;
          });
        });
        
        if (positiveCount > negativeCount) {
          score = Math.min(95, 75 + (positiveCount - negativeCount) * 5);
        } else if (negativeCount > positiveCount) {
          score = Math.max(50, 75 - (negativeCount - positiveCount) * 5);
        }
        
        // Separate strengths and improvements
        const strengths = feedbackPoints.filter((point: string) => 
          positiveWords.some((word: string) => point.toLowerCase().includes(word))
        );
        
        const improvements = feedbackPoints.filter((point: string) => 
          negativeWords.some((word: string) => point.toLowerCase().includes(word))
        );
        
        return {
          score: score,
          strengths: strengths.length > 0 ? strengths : ["Good communication skills"],
          improvements: improvements.length > 0 ? improvements : ["Add more specific examples"],
          summary: "Overall satisfactory response with room for improvement.",
          details: feedbackPoints.length > 0 ? feedbackPoints : ["Good effort, but try to be more specific."]
        };
      });
      
      setOverallFeedback(processedFeedback);
      
      // Calculate average score
      const averageScore = Math.round(
        processedFeedback.reduce((sum, item) => sum + item.score, 0) / processedFeedback.length
      );
      setFeedbackScore(averageScore);
      
      // Combine all feedback details
      const allDetails = processedFeedback.flatMap(item => item.details);
      setFeedbackDetails(allDetails);
      
    } catch (error) {
      console.error('Error generating feedback:', error);
      // Fallback feedback
      setFeedbackScore(65);
      setFeedbackDetails(["Your answers were acceptable, but could be improved with more specific examples."]);
    } finally {
      setIsLoadingFeedback(false);
      setShowFeedback(true);
      setInterviewComplete(true);
    }
  };
  
  const nextQuestion = () => {
    if (answer.trim()) {
      handleSubmitAnswer();
    } else {
      moveToNextQuestion();
    }
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setIsLoadingQuestion(true);
  };

  const endSession = () => {
    // If we have answers, finish the interview
    if (answers.filter(a => a.trim()).length > 0) {
      finishInterview(answers);
    } else {
      // Otherwise just reset
      resetInterview();
    }
  };

  const goToResults = () => {
    router.push('/results');
  };

  const resetInterview = () => {
    // Reset all states
    setInterviewStarted(false);
    setInterviewComplete(false);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setAnswers([]);
    setAnswer('');
    setIsRecording(false);
    setTimeLeft(120);
    setShowFeedback(false);
    setFeedbackScore(null);
    setFeedbackDetails([]);
    setOverallFeedback([]);
    setTranscript('');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getFeedbackEmoji = (score: number) => {
    if (score >= 80) return <FiSmile className="text-emerald-500 dark:text-emerald-400 text-xl" />;
    if (score >= 50) return <FiMeh className="text-yellow-500 dark:text-yellow-400 text-xl" />;
    return <FiFrown className="text-red-500 dark:text-red-400 text-xl" />;
  };

  return (
    <Suspense fallback={<div>Loading interview...</div>}>
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center mb-6">
            <Link href="/interview-selection" className="mr-4">
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                <FiArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {categoryName} Practice
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {subcategoryName ? `${subcategoryName} - ${subcategoryDescription}` : categoryDescription}
              </p>
            </div>
          </div>
          
          {!interviewStarted && !interviewComplete ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to start your {categoryName}?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You'll be presented with realistic interview questions. You can answer by typing or using voice recording.
                  Our AI will provide feedback on your responses.
                </p>
                
                {/* Interview Mode Selector */}
                <div className="mb-8 max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Select Interview Mode</h3>
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={() => setInterviewMode('standard')}
                      className={`px-4 py-2 ${interviewMode === 'standard' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'} rounded-lg font-medium text-sm flex items-center`}
                    >
                      <span>Standard</span>
                    </button>
                    <button 
                      onClick={() => setInterviewMode('stress')}
                      className={`px-4 py-2 ${interviewMode === 'stress' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'} rounded-lg font-medium text-sm flex items-center`}
                    >
                      <span>Stress Test</span>
                    </button>
                    <button 
                      onClick={() => setInterviewMode('rapid')}
                      className={`px-4 py-2 ${interviewMode === 'rapid' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'} rounded-lg font-medium text-sm flex items-center`}
                    >
                      <span>Rapid Fire</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={startInterview}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center space-x-2"
                    disabled={isLoading}
                  >
                    {isLoading ? <FiLoader className="animate-spin h-5 w-5" /> : <FiCheckCircle className="h-5 w-5" />}
                    <span>Start Interview</span>
                  </button>
                </div>
              </div>
            </div>
          ) : interviewComplete && showFeedback ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Interview Complete
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Here's your feedback and performance analysis
                </p>
                
                {feedbackScore !== null && (
                  <div className="flex justify-center mt-6">
                    <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">{feedbackScore}%</div>
                      <div className="absolute top-0 right-0 bg-white dark:bg-gray-800 rounded-full p-2 shadow-sm">
                        {getFeedbackEmoji(feedbackScore)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiBarChart2 className="mr-2 text-blue-500" />
                  Question-by-Question Analysis
                </h3>
                
                <div className="space-y-6">
                  {overallFeedback.map((feedback, index) => {
                    return (
                      <div key={index} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Question {index + 1}</h4>
                          <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                            {getFeedbackEmoji(feedback.score)}
                            <span className="ml-1 font-medium text-gray-900 dark:text-white">{feedback.score}%</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Question:</p>
                          {typeof questions[index] === 'string' ? (
                            (questions[index] as string).split('\n\n').map((paragraph: string, idx: number) => (
                              <p key={idx} className="mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                                {paragraph}
                                <button
                                  className="ml-2 px-2 py-1 rounded bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs"
                                  onClick={() => speak(paragraph)}
                                  title="Read aloud"
                                  aria-label="Read aloud"
                                  type="button"
                                >
                                  🔊
                                </button>
                              </p>
                            ))
                          ) : (
                            (() => {
                              const q = questions[index] as MultiPartQuestion;
                              return (
                                <div>
                                  {q.scenario && (
                                    <div className="mb-2 text-gray-700 dark:text-gray-200 flex items-center">
                                      <strong>Scenario:</strong> {q.scenario}
                                      <button
                                        className="ml-2 px-2 py-1 rounded bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs"
                                        onClick={() => speak(q.scenario)}
                                        title="Read aloud"
                                        aria-label="Read aloud"
                                        type="button"
                                      >
                                        🔊
                                      </button>
                                    </div>
                                  )}
                                  {q.parts.map((part, partIdx) => (
                                    <div key={partIdx} className="mb-2 flex items-center">
                                      <strong>Part {partIdx + 1}:</strong> {part}
                                      <button
                                        className="ml-2 px-2 py-1 rounded bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs"
                                        onClick={() => speak(part)}
                                        title="Read aloud"
                                        aria-label="Read aloud"
                                        type="button"
                                      >
                                        🔊
                                      </button>
                                    </div>
                                  ))}
                                  {q.followUpQuestions && q.followUpQuestions.length > 0 && (
                                    <div className="mt-2">
                                      <strong>Follow-up questions:</strong>
                                      <ul className="list-disc pl-6">
                                        {q.followUpQuestions.map((fq, fqIdx) => (
                                          <li key={fqIdx} className="flex items-center">
                                            {fq}
                                            <button
                                              className="ml-2 px-2 py-1 rounded bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs"
                                              onClick={() => speak(fq)}
                                              title="Read aloud"
                                              aria-label="Read aloud"
                                              type="button"
                                            >
                                              🔊
                                            </button>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              );
                            })()
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Your Answer:</p>
                          <p className="text-gray-800 dark:text-gray-200">{answers[index]}</p>
                        </div>
                        
                        <div className="space-y-4">
                          {feedback.summary && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                              <p className="text-gray-800 dark:text-gray-200 italic">{feedback.summary}</p>
                            </div>
                          )}
                          
                          {feedback.strengths && feedback.strengths.length > 0 && (
                            <div>
                              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Strengths:</p>
                              <ul className="space-y-1">
                                {feedback.strengths.map((point: string, i: number) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {feedback.improvements && feedback.improvements.length > 0 && (
                            <div>
                              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Areas for Improvement:</p>
                              <ul className="space-y-1">
                                {feedback.improvements.map((point: string, i: number) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-amber-600 dark:text-amber-400 mr-2">•</span>
                                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {feedback.details && feedback.details.length > 0 && (
                            <div>
                              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Detailed Feedback:</p>
                              <ul className="space-y-1">
                                {feedback.details.map((point: string, i: number) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={resetInterview}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center space-x-2"
                >
                  <span>Start New Interview</span>
                </button>
              </div>
            </div>
          ) : (
            <>
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  {(interviewMode === 'rapid' || interviewMode === 'stress') && (
                    <div className="ml-4 flex items-center text-gray-700 dark:text-gray-300">
                      <FiClock className="mr-1" />
                      <span>{formatTime(timeLeft)}</span>
                    </div>
                  )}
                </div>
                
                {feedbackScore !== null && !isLoadingFeedback && (
                  <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                    {getFeedbackEmoji(feedbackScore)}
                    <span className={`font-medium ${
                      feedbackScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 
                      feedbackScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {feedbackScore}%
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    Voice:
                    <select
                      value={selectedVoiceURI ?? ''}
                      onChange={e => setSelectedVoiceURI(e.target.value)}
                      className="ml-2 p-1 rounded"
                    >
                      {availableVoices.map(voice => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>
                          {voice.name} ({voice.lang}){voice.default ? ' (Default)' : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {isLoadingQuestion ? (
                  <div className="flex justify-center items-center py-12">
                    <FiLoader className="animate-spin h-8 w-8 text-blue-600" />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">Generating question...</span>
                  </div>
                ) : (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Question {currentQuestionIndex + 1}:</h2>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
                      {(() => {
                        const q = questions[currentQuestionIndex];
                        if (typeof q === 'string') {
                          return q.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                              {paragraph}
                              <button
                                className="ml-2 px-2 py-1 rounded bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs"
                                onClick={() => speak(paragraph)}
                                title="Read aloud"
                                aria-label="Read aloud"
                                type="button"
                              >
                                🔊
                              </button>
                            </p>
                          ));
                        } else if (q && typeof q === 'object' && 'parts' in q) {
                          return (
                            <div>
                              {q.scenario && (
                                <div className="mb-2 text-gray-700 dark:text-gray-200 flex items-center">
                                  <strong>Scenario:</strong> {q.scenario}
                                  <button
                                    className="ml-2 px-2 py-1 rounded bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs"
                                    onClick={() => speak(q.scenario)}
                                    title="Read aloud"
                                    aria-label="Read aloud"
                                    type="button"
                                  >
                                    🔊
                                  </button>
                                </div>
                              )}
                              <div className="mb-2 flex items-center">
                                <strong>Part {currentPartIdx + 1} of {q.parts.length}:</strong>
                                <span className="ml-2">{q.parts[currentPartIdx]}</span>
                                <button
                                  className="ml-2 px-2 py-1 rounded bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs"
                                  onClick={() => speak(q.parts[currentPartIdx])}
                                  title="Read aloud"
                                  aria-label="Read aloud"
                                  type="button"
                                >
                                  🔊
                                </button>
                              </div>
                              {/* Navigation for parts */}
                              <div className="flex gap-2 mb-2">
                                <button
                                  disabled={currentPartIdx === 0}
                                  onClick={() => setCurrentPartIdx(idx => Math.max(0, idx - 1))}
                                  className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700"
                                >Previous</button>
                                <button
                                  disabled={currentPartIdx === q.parts.length - 1}
                                  onClick={() => setCurrentPartIdx(idx => Math.min(q.parts.length - 1, idx + 1))}
                                  className="px-3 py-1 rounded bg-blue-500 text-white"
                                >Next</button>
                              </div>
                              {/* Show follow-up questions at the end */}
                              {currentPartIdx === q.parts.length - 1 && q.followUpQuestions.length > 0 && (
                                <div className="mt-4">
                                  <strong>Follow-up questions:</strong>
                                  <ul className="list-disc pl-6">
                                    {q.followUpQuestions.map((fq, idx) => (
                                      <li key={idx} className="flex items-center">
                                        {fq}
                                        <button
                                          className="ml-2 px-2 py-1 rounded bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 text-xs"
                                          onClick={() => speak(fq)}
                                          title="Read aloud"
                                          aria-label="Read aloud"
                                          type="button"
                                        >
                                          🔊
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        } else {
                          return <div>Loading question...</div>;
                        }
                      })()}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="answer" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Your Answer:
                      </label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          value={answer}
                          onChange={e => setAnswer(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Type your answer or use the mic..."
                        />
                        {!isRecording ? (
                          <button
                            type="button"
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                            title="Start voice input"
                            onClick={startVoiceRecognition}
                          >
                            <FiMic className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full animate-pulse"
                            title="Stop voice input"
                            onClick={stopVoiceRecognition}
                          >
                            <FiMicOff className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      {transcript && (
                        <div className="mt-2 text-gray-500 text-sm">Transcript: {transcript}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextQuestion}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg shadow-sm flex items-center justify-center space-x-2"
                  disabled={isRecording}
                >
                  <FiChevronRight className="h-5 w-5" />
                  <span>Next Question</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={endSession}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg shadow-sm flex items-center justify-center space-x-2"
                  disabled={isRecording}
                >
                  <FiX className="h-5 w-5" />
                  <span>End Session</span>
                </motion.button>
              </div>
            </motion.div>
            
            {/* Interview Progress Information */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiSmile className="mr-2 text-blue-500" />
                Interview Progress
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <p className="text-gray-800 dark:text-gray-200 mb-2 font-medium">Instructions:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      <span className="text-gray-700 dark:text-gray-300">Answer all questions to complete the interview</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      <span className="text-gray-700 dark:text-gray-300">You'll receive detailed feedback after completing all questions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      <span className="text-gray-700 dark:text-gray-300">Try to be specific and provide examples in your answers</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center justify-center"
                    disabled={isLoadingQuestion || isRecording}
                    onClick={() => setAnswer("I would approach this by analyzing the data, consulting with stakeholders, and implementing a solution based on best practices. I've handled similar situations in the past with positive outcomes.")}
                  >
                    <span>Sample Answer Format</span>
                  </button>
                  <button 
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm flex items-center justify-center"
                    onClick={endSession}
                    disabled={isLoadingQuestion || isRecording || answers.filter(a => a.trim()).length === 0}
                  >
                    <span>Finish Interview</span>
                  </button>
                </div>
              </div>
            </div>
            </>
          )}
        </main>
      </>
    </Suspense>
  );
  
}

export default MockInterview;

