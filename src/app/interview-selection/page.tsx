'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { FiArrowRight, FiCode, FiClipboard, FiActivity, FiDollarSign, FiHeart, FiTrendingUp, FiSearch, FiChevronDown, FiChevronUp, FiCheckCircle, FiSettings } from 'react-icons/fi';
import { interviewCategories, InterviewCategory, InterviewSubcategory } from '@/data/interviewCategories';

interface InterviewSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  mode: 'standard' | 'stress' | 'rapid';
  companySpecific: string;
}

export default function InterviewSelection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Interview settings
  const [settings, setSettings] = useState<InterviewSettings>({
    difficulty: 'medium',
    mode: 'standard',
    companySpecific: ''
  });
  
  // Map category IDs to icons
  const categoryIcons: Record<string, React.ReactNode> = {
    'software-engineer': <FiCode className="h-6 w-6" />,
    'product-management': <FiTrendingUp className="h-6 w-6" />,
    'data-science': <FiActivity className="h-6 w-6" />,
    'ux-design': <FiSettings className="h-6 w-6" />,
    'marketing': <FiTrendingUp className="h-6 w-6" />,
    'project-management': <FiClipboard className="h-6 w-6" />,
    'accounting': <FiDollarSign className="h-6 w-6" />,
    'healthcare': <FiHeart className="h-6 w-6" />
  };
  
  // Filter categories based on search query
  const filteredCategories = interviewCategories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.subcategories.some(sub => 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  const toggleCategoryExpansion = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };
  
  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null); // Reset subcategory when changing category
    setExpandedCategory(categoryId); // Expand the selected category
  };
  
  const selectSubcategory = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  };
  
  const handleStartInterview = () => {
    if (selectedCategory) {
      const queryParams = new URLSearchParams();
      queryParams.append('type', selectedCategory);
      
      if (selectedSubcategory) {
        queryParams.append('subtype', selectedSubcategory);
      }
      
      queryParams.append('difficulty', settings.difficulty);
      queryParams.append('mode', settings.mode);
      
      if (settings.companySpecific) {
        queryParams.append('company', settings.companySpecific);
      }
      
      router.push(`/mock-interview?${queryParams.toString()}`);
    }
  };
  
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interview Preparation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Select a category and specific topic to practice your interview skills
          </p>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search interview categories or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-8">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <motion.div
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                className={`p-6 cursor-pointer ${selectedCategory === category.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                onClick={() => toggleCategoryExpansion(category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 mr-4">
                      {categoryIcons[category.id] || <FiActivity className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {selectedCategory === category.id && !selectedSubcategory && (
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                        <FiCheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {expandedCategory === category.id ? (
                      <FiChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <button 
                    className={`text-sm px-3 py-1 rounded-full ${selectedCategory === category.id && !selectedSubcategory ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectCategory(category.id);
                    }}
                  >
                    General {category.name} Interview
                  </button>
                </div>
              </motion.div>
              
              {expandedCategory === category.id && (
                <div className="px-6 pb-6">
                  <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Specific Topics</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {category.subcategories.map((subcategory) => (
                        <motion.div
                          key={subcategory.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 rounded-lg border ${selectedSubcategory === subcategory.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700'} cursor-pointer relative`}
                          onClick={() => {
                            selectCategory(category.id);
                            selectSubcategory(subcategory.id);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">{subcategory.name}</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{subcategory.description}</p>
                            </div>
                            {selectedSubcategory === subcategory.id && (
                              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                <FiCheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {(selectedCategory || selectedSubcategory) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interview Settings</h3>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showSettings ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
            
            {showSettings && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty Level</label>
                  <div className="flex space-x-4">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <button
                        key={level}
                        className={`px-4 py-2 rounded-lg ${settings.difficulty === level ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                        onClick={() => setSettings({...settings, difficulty: level as 'easy' | 'medium' | 'hard'})}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interview Mode</label>
                  <div className="flex flex-wrap gap-4">
                    <button
                      className={`px-4 py-2 rounded-lg ${settings.mode === 'standard' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      onClick={() => setSettings({...settings, mode: 'standard'})}
                    >
                      Standard
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg ${settings.mode === 'stress' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      onClick={() => setSettings({...settings, mode: 'stress'})}
                    >
                      Stress Test (Timed)
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg ${settings.mode === 'rapid' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      onClick={() => setSettings({...settings, mode: 'rapid'})}
                    >
                      Rapid Fire
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Specific (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Google, Amazon, Microsoft"
                    value={settings.companySpecific}
                    onChange={(e) => setSettings({...settings, companySpecific: e.target.value})}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter a company name to get questions tailored to their interview style</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartInterview}
            disabled={!selectedCategory}
            className={`px-8 py-4 rounded-lg shadow-md flex items-center space-x-2 font-medium text-lg ${
              selectedCategory 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Start Interview</span>
            <FiArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </main>
    </>
  );
}
