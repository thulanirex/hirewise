// Interview categories organized by domain
export interface InterviewCategory {
  id: string;
  name: string;
  description: string;
  subcategories: InterviewSubcategory[];
}

export interface InterviewSubcategory {
  id: string;
  name: string;
  description: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export const interviewCategories: InterviewCategory[] = [
  {
    id: 'product-management',
    name: 'Product Management',
    description: 'Product strategy, prioritization, and execution',
    subcategories: [
      {
        id: 'product-strategy',
        name: 'Product Strategy',
        description: 'Vision, roadmap, and market fit questions'
      },
      {
        id: 'execution',
        name: 'Execution',
        description: 'Shipping products and feature implementation'
      },
      {
        id: 'analytics-metrics',
        name: 'Analytics & Metrics',
        description: 'KPIs, success metrics, and data-driven decisions'
      },
      {
        id: 'product-design',
        name: 'Product Design',
        description: 'User experience and design thinking'
      },
      {
        id: 'estimation',
        name: 'Estimation',
        description: 'Sizing markets and forecasting impact'
      },
      {
        id: 'behavioral-pm',
        name: 'Behavioral',
        description: 'Leadership, collaboration, and problem-solving'
      },
      {
        id: 'go-to-market',
        name: 'Go-to-Market',
        description: 'Launch strategies and market entry'
      },
      {
        id: 'prioritization',
        name: 'Prioritization',
        description: 'Feature prioritization frameworks and tradeoffs'
      },
      {
        id: 'stakeholder-management',
        name: 'Stakeholder Management',
        description: 'Working with cross-functional teams'
      }
    ]
  },
  {
    id: 'software-engineer',
    name: 'Software Engineering',
    description: 'Technical coding questions, system design, and problem-solving',
    subcategories: [
      {
        id: 'data-structures',
        name: 'Data Structures & Algorithms',
        description: 'Problem-solving with optimal data structures'
      },
      {
        id: 'system-design',
        name: 'System Design',
        description: 'Designing scalable systems and architecture'
      },
      {
        id: 'coding',
        name: 'Coding',
        description: 'Language-specific implementation questions'
      },
      {
        id: 'debugging',
        name: 'Debugging',
        description: 'Finding and fixing issues in code'
      },
      {
        id: 'api-design',
        name: 'API Design',
        description: 'Creating effective and usable APIs'
      },
      {
        id: 'devops',
        name: 'DevOps & Deployment',
        description: 'CI/CD, infrastructure, and operations'
      },
      {
        id: 'security',
        name: 'Security Fundamentals',
        description: 'Secure coding practices and threat modeling'
      },
      {
        id: 'behavioral-swe',
        name: 'Behavioral',
        description: 'Teamwork, communication, and problem-solving'
      },
      {
        id: 'technical-communication',
        name: 'Technical Communication',
        description: 'Explaining complex concepts clearly'
      },
      {
        id: 'architecture',
        name: 'Architecture & Scalability',
        description: 'Building systems that scale and perform'
      }
    ]
  },
  {
    id: 'data-science',
    name: 'Data Science / Machine Learning',
    description: 'Statistical analysis, machine learning, and data visualization',
    subcategories: [
      {
        id: 'statistics',
        name: 'Statistics & Probability',
        description: 'Statistical methods and probability theory'
      },
      {
        id: 'ml-algorithms',
        name: 'Machine Learning Algorithms',
        description: 'Understanding and implementing ML models'
      },
      {
        id: 'data-manipulation',
        name: 'Data Manipulation',
        description: 'SQL, Pandas, and data processing'
      },
      {
        id: 'experimental-design',
        name: 'Experimental Design & A/B Testing',
        description: 'Setting up and analyzing experiments'
      },
      {
        id: 'business-case',
        name: 'Business Case / Product Sense',
        description: 'Applying data science to business problems'
      },
      {
        id: 'data-visualization',
        name: 'Data Visualization',
        description: 'Effectively communicating insights through visuals'
      },
      {
        id: 'deep-learning',
        name: 'Deep Learning / NLP / CV',
        description: 'Advanced ML techniques and applications'
      },
      {
        id: 'coding-ds',
        name: 'Coding (Python, R, etc.)',
        description: 'Implementing data science solutions'
      },
      {
        id: 'behavioral-ds',
        name: 'Behavioral',
        description: 'Collaboration, communication, and problem-solving'
      },
      {
        id: 'model-evaluation',
        name: 'Model Evaluation & Metrics',
        description: 'Measuring and improving model performance'
      }
    ]
  },
  {
    id: 'ux-design',
    name: 'UX/UI & Product Design',
    description: 'User experience, interface design, and design thinking',
    subcategories: [
      {
        id: 'design-thinking',
        name: 'Design Thinking',
        description: 'Problem-solving through user-centered design'
      },
      {
        id: 'wireframing',
        name: 'Wireframing & Prototyping',
        description: 'Creating low and high-fidelity prototypes'
      },
      {
        id: 'usability-testing',
        name: 'Usability Testing',
        description: 'Evaluating designs with real users'
      },
      {
        id: 'visual-design',
        name: 'Visual Design & Aesthetics',
        description: 'Creating visually appealing interfaces'
      },
      {
        id: 'ux-research',
        name: 'UX Research',
        description: 'Understanding user needs and behaviors'
      },
      {
        id: 'accessibility',
        name: 'Accessibility',
        description: 'Designing for all users regardless of ability'
      },
      {
        id: 'behavioral-ux',
        name: 'Behavioral',
        description: 'Collaboration, communication, and problem-solving'
      },
      {
        id: 'design-systems',
        name: 'Design Systems',
        description: 'Creating consistent design languages'
      },
      {
        id: 'developer-collaboration',
        name: 'Collaboration with Developers',
        description: 'Working effectively with engineering teams'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing / Growth',
    description: 'Market research, campaign execution, and customer acquisition',
    subcategories: [
      {
        id: 'market-research',
        name: 'Market Research',
        description: 'Understanding market trends and customer needs'
      },
      {
        id: 'campaign-execution',
        name: 'Campaign Execution',
        description: 'Planning and implementing marketing campaigns'
      },
      {
        id: 'performance-metrics',
        name: 'Performance Metrics',
        description: 'Measuring marketing effectiveness and ROI'
      },
      {
        id: 'channel-strategy',
        name: 'Channel Strategy',
        description: 'Selecting and optimizing marketing channels'
      },
      {
        id: 'content-seo',
        name: 'Content & SEO',
        description: 'Creating effective content and optimizing for search'
      },
      {
        id: 'ab-testing-marketing',
        name: 'A/B Testing',
        description: 'Testing and optimizing marketing materials'
      },
      {
        id: 'customer-acquisition',
        name: 'Customer Acquisition',
        description: 'Strategies for acquiring and retaining customers'
      },
      {
        id: 'behavioral-marketing',
        name: 'Behavioral',
        description: 'Collaboration, communication, and problem-solving'
      }
    ]
  },
  {
    id: 'project-management',
    name: 'Project / Program Management',
    description: 'Planning, execution, and stakeholder management',
    subcategories: [
      {
        id: 'planning',
        name: 'Planning & Scheduling',
        description: 'Creating and managing project timelines'
      },
      {
        id: 'risk-management',
        name: 'Risk Management',
        description: 'Identifying and mitigating project risks'
      },
      {
        id: 'stakeholder-communication',
        name: 'Stakeholder Communication',
        description: 'Effectively communicating with stakeholders'
      },
      {
        id: 'cross-functional',
        name: 'Cross-functional Collaboration',
        description: 'Working with diverse teams and departments'
      },
      {
        id: 'metrics-reporting',
        name: 'Metrics & Reporting',
        description: 'Tracking and communicating project progress'
      },
      {
        id: 'agile-scrum',
        name: 'Agile / Scrum',
        description: 'Implementing agile methodologies'
      },
      {
        id: 'resource-allocation',
        name: 'Resource Allocation',
        description: 'Managing team members and budgets'
      },
      {
        id: 'behavioral-pm',
        name: 'Behavioral',
        description: 'Leadership, communication, and problem-solving'
      }
    ]
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Financial reporting, tax compliance, and accounting principles',
    subcategories: [
      {
        id: 'financial-reporting',
        name: 'Financial Reporting',
        description: 'Preparing and analyzing financial statements'
      },
      {
        id: 'tax-compliance',
        name: 'Tax Compliance',
        description: 'Understanding tax laws and regulations'
      },
      {
        id: 'auditing',
        name: 'Auditing',
        description: 'Examining financial records and controls'
      },
      {
        id: 'accounting-principles',
        name: 'Accounting Principles',
        description: 'GAAP, IFRS, and accounting fundamentals'
      },
      {
        id: 'financial-analysis',
        name: 'Financial Analysis',
        description: 'Analyzing financial data for decision-making'
      },
      {
        id: 'behavioral-accounting',
        name: 'Behavioral',
        description: 'Ethics, communication, and problem-solving'
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Clinical knowledge, patient care, and medical ethics',
    subcategories: [
      {
        id: 'clinical-knowledge',
        name: 'Clinical Knowledge',
        description: 'Medical expertise and diagnosis'
      },
      {
        id: 'patient-care',
        name: 'Patient Care',
        description: 'Treatment planning and patient interaction'
      },
      {
        id: 'medical-ethics',
        name: 'Medical Ethics',
        description: 'Ethical considerations in healthcare'
      },
      {
        id: 'healthcare-regulations',
        name: 'Healthcare Regulations',
        description: 'Understanding healthcare laws and policies'
      },
      {
        id: 'behavioral-healthcare',
        name: 'Behavioral',
        description: 'Communication, teamwork, and problem-solving'
      }
    ]
  }
];
