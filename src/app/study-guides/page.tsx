'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiBookmark, FiFilter, FiCheck, FiStar, FiBookOpen, FiCode, FiDatabase, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { Navbar } from '@/components/layout/Navbar';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  questionCount: number;
  completedCount: number;
}

interface Question {
  id: string;
  category: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isBookmarked: boolean;
  isCompleted: boolean;
}

export default function StudyGuides() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  
  const categories: Category[] = [
    { 
      id: 'product-management', 
      name: 'Product Management', 
      icon: <FiTrendingUp className="h-5 w-5" />, 
      questionCount: 20, 
      completedCount: 8 
    },
    { 
      id: 'software-engineering', 
      name: 'Software Engineering', 
      icon: <FiCode className="h-5 w-5" />, 
      questionCount: 30, 
      completedCount: 12 
    },
    { 
      id: 'data-science', 
      name: 'Data Science', 
      icon: <FiDatabase className="h-5 w-5" />, 
      questionCount: 25, 
      completedCount: 5 
    },
    { 
      id: 'leadership', 
      name: 'Leadership', 
      icon: <FiUsers className="h-5 w-5" />, 
      questionCount: 15, 
      completedCount: 3 
    },
  ];
  
  const questions: Question[] = [
    {
      id: '1',
      category: 'product-management',
      text: 'How would you prioritize features for a new product?',
      difficulty: 'medium',
      isBookmarked: true,
      isCompleted: true
    },
    {
      id: '2',
      category: 'product-management',
      text: 'Describe a time when you had to make a difficult product decision with limited data.',
      difficulty: 'hard',
      isBookmarked: false,
      isCompleted: true
    },
    {
      id: '3',
      category: 'software-engineering',
      text: 'Explain the difference between REST and GraphQL APIs.',
      difficulty: 'medium',
      isBookmarked: true,
      isCompleted: false
    },
    {
      id: '4',
      category: 'software-engineering',
      text: 'How would you design a URL shortening service?',
      difficulty: 'hard',
      isBookmarked: false,
      isCompleted: false
    },
    {
      id: '5',
      category: 'data-science',
      text: 'Explain the bias-variance tradeoff in machine learning.',
      difficulty: 'hard',
      isBookmarked: true,
      isCompleted: true
    },
    {
      id: '6',
      category: 'leadership',
      text: 'Describe a situation where you had to lead a team through a challenging project.',
      difficulty: 'medium',
      isBookmarked: false,
      isCompleted: false
    },
  ];
  
  const filteredQuestions = questions.filter(question => {
    // Filter by search query
    if (searchQuery && !question.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory && question.category !== selectedCategory) {
      return false;
    }
    
    // Filter by difficulty
    if (selectedDifficulty && question.difficulty !== selectedDifficulty) {
      return false;
    }
    
    // Filter by bookmarked
    if (showBookmarkedOnly && !question.isBookmarked) {
      return false;
    }
    
    return true;
  });
  
  const toggleBookmark = (id: string) => {
    // In a real app, this would update the state and backend
    console.log(`Toggling bookmark for question ${id}`);
  };
  
  const toggleCompleted = (id: string) => {
    // In a real app, this would update the state and backend
    console.log(`Toggling completed for question ${id}`);
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Guides & Question Bank</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Browse interview questions by category and track your progress.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiBookOpen className="mr-2" />
                Categories
              </h2>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  All Categories
                </button>
                
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      {category.icon}
                      <span className="ml-2">{category.name}</span>
                    </div>
                    <div className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {category.completedCount}/{category.questionCount}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiFilter className="mr-2" />
                Filters
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setSelectedDifficulty(null)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedDifficulty === null
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      All Difficulties
                    </button>
                    
                    {['easy', 'medium', 'hard'].map(difficulty => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedDifficulty === difficulty
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={showBookmarkedOnly}
                      onChange={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bookmarked Only
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <FiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input 
                  type="search" 
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="Search questions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {filteredQuestions.length} Questions
                </h2>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {questions.filter(q => q.isCompleted).length}/{questions.length} Completed
                </div>
              </div>
              
              {filteredQuestions.length > 0 ? (
                <div className="space-y-4">
                  {filteredQuestions.map(question => (
                    <div 
                      key={question.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                            </span>
                            
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {categories.find(c => c.id === question.category)?.name}
                            </span>
                          </div>
                          
                          <p className={`text-gray-900 dark:text-white ${question.isCompleted ? 'line-through opacity-70' : ''}`}>
                            {question.text}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button 
                            onClick={() => toggleBookmark(question.id)}
                            className={`p-2 rounded-full ${
                              question.isBookmarked 
                                ? 'text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300' 
                                : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                            }`}
                            aria-label="Bookmark question"
                          >
                            <FiBookmark className={`h-5 w-5 ${question.isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                          
                          <button 
                            onClick={() => toggleCompleted(question.id)}
                            className={`p-2 rounded-full ${
                              question.isCompleted 
                                ? 'text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300' 
                                : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                            }`}
                            aria-label="Mark as completed"
                          >
                            <FiCheck className={`h-5 w-5 ${question.isCompleted ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiSearch className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
