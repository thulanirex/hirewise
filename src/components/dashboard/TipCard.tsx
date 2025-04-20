'use client';

import { useState, useEffect } from 'react';
import { FiInfo } from 'react-icons/fi';

interface TipCardProps {
  tip?: string; // Make tip optional
}

const tips = [
  "When answering behavioral questions, use the STAR method: Situation, Task, Action, Result.",
  "Research the company before your interview to understand their values and culture.",
  "Prepare 3-5 questions to ask your interviewer at the end of the interview.",
  "Practice your answers out loud to improve delivery and confidence.",
  "Focus on specific achievements and quantify results when possible.",
  "Be prepared to discuss your strengths and weaknesses with concrete examples.",
  "Research common interview questions for your specific industry and role.",
  "Maintain good eye contact and positive body language during interviews.",
];

export const TipCard = ({ tip: initialTip }: TipCardProps) => {
  // Use useState with a callback to initialize the state
  // This ensures the random selection only happens on the client
  const [tip, setTip] = useState<string>(() => {
    // If an initial tip is provided, use it
    if (initialTip) return initialTip;
    
    // Otherwise, this will only run on the client
    return tips[Math.floor(Math.random() * tips.length)];
  });
  
  // Optional: Rotate tips periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newTip = tips[Math.floor(Math.random() * tips.length)];
      if (newTip !== tip) {
        setTip(newTip);
      }
    }, 60000); // Change tip every minute
    
    return () => clearInterval(interval);
  }, [tip]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start space-x-4">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
          <FiInfo className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tip of the Day</h3>
          <p className="text-gray-600 dark:text-gray-300">{tip}</p>
        </div>
      </div>
    </div>
  );
};
