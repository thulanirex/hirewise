'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiRepeat, FiPlay, FiBarChart2, FiMessageSquare, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { Navbar } from '@/components/layout/Navbar';

export default function Results() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for the results
  const mockResults = {
    overallScore: 82,
    categories: [
      { name: 'Communication', score: 85 },
      { name: 'Structure', score: 78 },
      { name: 'Clarity', score: 90 },
      { name: 'Technical Accuracy', score: 75 },
      { name: 'Problem Solving', score: 82 },
    ],
    strengths: [
      'Clear and concise communication',
      'Strong problem-solving approach',
      'Good use of specific examples',
      'Logical structure in responses',
    ],
    improvements: [
      'Provide more quantitative results in examples',
      'Elaborate more on technical implementations',
      'Consider alternative solutions to problems',
      'Improve time management for complex questions',
    ],
    questions: [
      {
        id: 1,
        text: 'Tell me about a time when you had to solve a complex problem.',
        score: 88,
        feedback: 'Great structure using the STAR method. Consider adding more specific metrics on the impact of your solution.',
      },
      {
        id: 2,
        text: 'What are your greatest strengths and weaknesses?',
        score: 75,
        feedback: 'Good self-awareness on strengths. When discussing weaknesses, focus more on concrete steps you\'re taking to improve.',
      },
      {
        id: 3,
        text: 'How do you handle pressure and tight deadlines?',
        score: 83,
        feedback: 'Strong example provided. Could improve by discussing your prioritization methodology in more detail.',
      },
    ],
  };
  
  const renderOverviewTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Performance</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Circular progress indicator */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  className="text-gray-200 dark:text-gray-700" 
                  strokeWidth="10" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                />
                <circle 
                  className="text-blue-600 dark:text-blue-500" 
                  strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - mockResults.overallScore / 100)}`}
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{mockResults.overallScore}%</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {mockResults.categories.map((category, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.score}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${category.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiCheckCircle className="mr-2 text-green-500" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {mockResults.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                <span className="text-gray-700 dark:text-gray-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiAlertCircle className="mr-2 text-amber-500" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {mockResults.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start">
                <span className="text-amber-600 dark:text-amber-400 mr-2">•</span>
                <span className="text-gray-700 dark:text-gray-300">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI-Generated Personalized Tips</h3>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <p className="text-gray-800 dark:text-gray-200 mb-3">
            Based on your performance, here are some personalized tips to help you improve:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">1.</span>
              <span className="text-gray-700 dark:text-gray-300">
                Practice quantifying your achievements with specific metrics and numbers to make your examples more impactful.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">2.</span>
              <span className="text-gray-700 dark:text-gray-300">
                When discussing technical concepts, try to balance depth with clarity to demonstrate your expertise while remaining accessible.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">3.</span>
              <span className="text-gray-700 dark:text-gray-300">
                Consider preparing a framework for answering different types of questions to ensure you cover all important aspects.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">4.</span>
              <span className="text-gray-700 dark:text-gray-300">
                For your next practice session, focus on time management and conciseness while maintaining the strong structure you already demonstrate.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
  
  const renderQuestionsTab = () => (
    <div className="space-y-6">
      {mockResults.questions.map((question) => (
        <div 
          key={question.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{question.text}</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              question.score >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              question.score >= 70 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
            }`}>
              {question.score}%
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Feedback:</h4>
            <p className="text-gray-600 dark:text-gray-400">{question.feedback}</p>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/40">
              <FiPlay className="mr-1.5 h-4 w-4" />
              Replay Answer
            </button>
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              <FiMessageSquare className="mr-1.5 h-4 w-4" />
              View Transcript
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Results</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Product Management Interview • April 20, 2025
            </p>
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm flex items-center"
            >
              <FiDownload className="mr-2 h-4 w-4" />
              Download Report
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-medium text-sm flex items-center"
            >
              <FiRepeat className="mr-2 h-4 w-4" />
              Practice Again
            </motion.button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center">
                  <FiBarChart2 className="mr-2 h-4 w-4" />
                  Overview
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('questions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'questions'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center">
                  <FiMessageSquare className="mr-2 h-4 w-4" />
                  Questions & Feedback
                </div>
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'overview' ? renderOverviewTab() : renderQuestionsTab()}
          </div>
        </div>
      </main>
    </>
  );
}
