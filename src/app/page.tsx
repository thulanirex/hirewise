'use client';

import Link from 'next/link';
import { FiBarChart2, FiCalendar, FiCheckCircle, FiClock, FiTarget, FiTrendingUp, FiVideo, FiMic, FiFileText, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { StatCard } from '@/components/dashboard/StatCard';
import { TipCard } from '@/components/dashboard/TipCard';

export default function Home() {
  const userName = "Thulani";

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Welcome back, {userName}!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 mt-2"
          >
            Ready to ace your next interview? Let's continue your practice.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/interview-selection" className="col-span-1 md:col-span-3">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg p-6 flex items-center justify-between cursor-pointer"
            >
              <div>
                <h2 className="text-xl font-bold mb-2">Start Mock Interview</h2>
                <p className="text-blue-100">Practice with AI-powered interview simulations</p>
              </div>
              <div className="flex space-x-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <FiMic className="h-6 w-6" />
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <FiVideo className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Unique Feature: Interview Mode Selection */}
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interview Modes</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors">
                <span className="font-medium">Standard</span>
                <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded-full">Recommended</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                <span className="font-medium">Stress Test</span>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">Advanced</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                <span className="font-medium">Rapid Fire</span>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">Quick</span>
              </button>
            </div>
          </div>

          {/* Unique Feature: Company-Specific Prep */}
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company-Specific Prep</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search company..." 
                className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <img src="https://logo.clearbit.com/google.com" alt="Google" className="w-8 h-8 rounded mr-3" />
                <span className="text-gray-800 dark:text-gray-200">Google</span>
              </div>
              <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <img src="https://logo.clearbit.com/microsoft.com" alt="Microsoft" className="w-8 h-8 rounded mr-3" />
                <span className="text-gray-800 dark:text-gray-200">Microsoft</span>
              </div>
            </div>
          </div>

          {/* Unique Feature: Resume Analyzer */}
          <Link href="/cv-comparison" className="col-span-1">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resume Analyzer</h3>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <FiFileText className="h-5 w-5" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Compare your resume with job descriptions and get AI-powered recommendations.</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Last analysis: 65% match</div>
            </motion.div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Last Performance" 
            value="85%" 
            icon={<FiBarChart2 className="h-5 w-5" />}
            description="Product Management Interview"
            color="blue"
          />
          <StatCard 
            title="Interviews Completed" 
            value="12" 
            icon={<FiCheckCircle className="h-5 w-5" />}
            color="green"
          />
          <StatCard 
            title="Upcoming Goal" 
            value="90%" 
            icon={<FiTarget className="h-5 w-5" />}
            description="Score in Technical Interviews"
            color="purple"
          />
          <StatCard 
            title="Practice Time" 
            value="8.5 hrs" 
            icon={<FiClock className="h-5 w-5" />}
            description="This month"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Progress</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      <FiTrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Communication Skills</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Improved by 12% this month</p>
                    </div>
                  </div>
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                      <FiTrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Technical Knowledge</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Improved by 8% this month</p>
                    </div>
                  </div>
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                      <FiCalendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Next Scheduled Practice</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Reschedule</button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <TipCard />
          </div>
        </div>
      </main>
    </>
  );
}
