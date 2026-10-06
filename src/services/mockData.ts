import { Job, CandidateProfile, Application, User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-cand-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 555-0192',
    role: 'CANDIDATE',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-emp-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@cloudscale.io',
    phone: '+1 555-0144',
    role: 'EMPLOYER',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-emp-2',
    name: 'Marcus Vance',
    email: 'm.vance@finflow.tech',
    phone: '+1 555-0189',
    role: 'EMPLOYER',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-emp-3',
    name: 'Elena Rostova',
    email: 'elena@novamed.ai',
    phone: '+1 555-0131',
    role: 'EMPLOYER',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-admin-1',
    name: 'System Administrator',
    email: 'admin@careerai.io',
    phone: '+1 555-9999',
    role: 'ADMIN',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_CANDIDATE: CandidateProfile = {
  id: 'cand-profile-1',
  userId: 'user-cand-1',
  firstName: 'Alex',
  lastName: 'Rivera',
  headline: 'Senior Full-Stack & Cloud Engineer | React, TypeScript, Node.js, Python',
  summary: 'Passionate software engineer with 5 years building scalable distributed web applications, cloud-native microservices, and AI integrations.',
  location: 'San Francisco, CA',
  preferredWorkMode: 'REMOTE',
  yearsOfExperience: 5,
  educationLevel: 'bachelors',
  skills: [
    'React',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Python',
    'FastAPI',
    'PostgreSQL',
    'Docker',
    'Tailwind CSS',
    'Git',
    'REST APIs'
  ],
  isOpenToWork: true
};

export const INITIAL_RESUME_TEXT = `ALEX RIVERA
San Francisco, CA | alex.rivera@example.com | (555) 019-2831 | github.com/alexrivera

SUMMARY
Full-Stack Software Engineer with 5+ years of experience designing scalable microservices, responsive web architectures, and RESTful APIs using TypeScript, React, Python, and PostgreSQL.

SKILLS
• Languages: TypeScript, JavaScript, Python, SQL, Go (Beginner)
• Frontend: React, Next.js, Tailwind CSS, Redux Toolkit, TanStack Query
• Backend & DB: Node.js, Express, FastAPI, PostgreSQL, Redis, SQLAlchemy
• DevOps & Cloud: Docker, AWS (ECS, S3), Git, CI/CD GitHub Actions

EXPERIENCE
Senior Software Engineer | FinScale Technologies (2022 - Present)
• Architected high-throughput ledger microservices in FastAPI and PostgreSQL, processing 1.2M transactions/day with sub-50ms latency.
• Redesigned customer portal in React and TypeScript, boosting core web vitals by 42% and user retention by 18%.
• Implemented automated Docker CI/CD pipelines reducing deployment lead time from 4 hours to 12 minutes.

Full-Stack Engineer | Nexus Digital (2019 - 2022)
• Built customer analytics dashboards in React, Node.js, and Redis caching.
• Designed and maintained 25+ RESTful endpoints with OpenAPI/Swagger specifications.

EDUCATION
B.S. in Computer Science | University of California, Berkeley (2015 - 2019)`;

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    companyId: 'comp-1',
    companyName: 'CloudScale Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    title: 'Senior Full-Stack Engineer (React & TypeScript)',
    description: 'We are seeking a Senior Full-Stack Engineer to architect mission-critical customer interfaces and resilient microservices for our multi-cloud deployment orchestrator.',
    responsibilities: [
      'Design modular frontends using React 19, TypeScript, and modern state architectures',
      'Collaborate with cloud architects to build performant backend APIs in Python or Node.js',
      'Optimize database queries and caching layers across PostgreSQL and Redis'
    ],
    requirements: [
      '4+ years professional software development experience',
      'Deep mastery of TypeScript, modern React, and component lifecycle design',
      'Solid experience with PostgreSQL and Docker containerization'
    ],
    requiredSkills: ['React', 'TypeScript', 'PostgreSQL', 'Docker', 'REST APIs'],
    preferredSkills: ['FastAPI', 'Redis', 'Kubernetes', 'Tailwind CSS'],
    employmentType: 'FULL_TIME',
    workMode: 'REMOTE',
    location: 'San Francisco, CA (Remote)',
    salaryMin: 155000,
    salaryMax: 185000,
    salaryCurrency: 'USD',
    experienceMin: 4,
    experienceMax: 7,
    educationRequired: 'bachelors',
    status: 'ACTIVE',
    createdAt: '2026-03-20T10:00:00Z'
  },
  {
    id: 'job-2',
    companyId: 'comp-2',
    companyName: 'FinFlow Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=100&auto=format&fit=crop&q=80',
    title: 'Python Backend & AI Systems Engineer',
    description: 'Join our quantitative engineering squad building high-reliability payment routing algorithms, vector search systems, and financial risk pipelines.',
    responsibilities: [
      'Develop low-latency REST and gRPC services in Python / FastAPI',
      'Integrate pgvector vector databases with embedding models for fraud anomaly detection',
      'Maintain 99.99% service availability with robust telemetry and circuit breakers'
    ],
    requirements: [
      '3+ years building production Python services with FastAPI or Django',
      'Production database design with PostgreSQL, indexing, and connection pools',
      'Familiarity with containerization and Redis queue systems'
    ],
    requiredSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    preferredSkills: ['Kubernetes', 'pgvector', 'Celery', 'AWS'],
    employmentType: 'FULL_TIME',
    workMode: 'REMOTE',
    location: 'New York, NY (Remote)',
    salaryMin: 150000,
    salaryMax: 180000,
    salaryCurrency: 'USD',
    experienceMin: 3,
    educationRequired: 'bachelors',
    status: 'ACTIVE',
    createdAt: '2026-03-22T08:30:00Z'
  },
  {
    id: 'job-3',
    companyId: 'comp-3',
    companyName: 'NovaMed AI',
    companyLogo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&auto=format&fit=crop&q=80',
    title: 'Cloud DevOps & Platform Engineer',
    description: 'Lead the infrastructure evolution for healthcare AI diagnostics, managing secure Kubernetes clusters, zero-trust networking, and automated pipelines.',
    responsibilities: [
      'Provision and manage multi-region Kubernetes clusters with Terraform',
      'Automate GitOps deployments using ArgoCD and GitHub Actions',
      'Enforce SOC2 and HIPAA compliance guardrails across AWS environments'
    ],
    requirements: [
      '5+ years in DevOps / SRE roles',
      'Expert proficiency in Kubernetes, Docker, and Terraform',
      'Strong scripting skills in Python or Go'
    ],
    requiredSkills: ['Kubernetes', 'Docker', 'Amazon Web Services', 'Terraform', 'Python'],
    preferredSkills: ['Go', 'Prometheus', 'ArgoCD'],
    employmentType: 'FULL_TIME',
    workMode: 'HYBRID',
    location: 'Boston, MA',
    salaryMin: 165000,
    salaryMax: 200000,
    salaryCurrency: 'USD',
    experienceMin: 5,
    educationRequired: 'bachelors',
    status: 'ACTIVE',
    createdAt: '2026-03-24T14:15:00Z'
  },
  {
    id: 'job-4',
    companyId: 'comp-4',
    companyName: 'Apex Data Labs',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    title: 'Frontend Architect (Design Systems & Web Performance)',
    description: 'Drive frontend excellence across 6 engineering squads, establishing our core design system token pipeline, micro-frontend architecture, and web vitals monitoring.',
    responsibilities: [
      'Own the design system library built with React, TypeScript, and Tailwind CSS',
      'Standardize frontend performance metrics and client-side caching strategies',
      'Mentor engineers in accessibility (WCAG AA) and component test suites'
    ],
    requirements: [
      '6+ years frontend engineering experience with deep React ecosystem expertise',
      'Demonstrated experience building enterprise UI component libraries'
    ],
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML5'],
    preferredSkills: ['Storybook', 'GraphQL', 'Webpack', 'Jest'],
    employmentType: 'FULL_TIME',
    workMode: 'REMOTE',
    location: 'Austin, TX (Remote)',
    salaryMin: 170000,
    salaryMax: 210000,
    salaryCurrency: 'USD',
    experienceMin: 6,
    educationRequired: 'bachelors',
    status: 'ACTIVE',
    createdAt: '2026-03-25T11:00:00Z'
  },
  {
    id: 'job-5',
    companyId: 'comp-5',
    companyName: 'DevCore Open Source',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    title: 'Go Distributed Systems Engineer',
    description: 'Build open-source peer-to-peer storage engines and distributed consensus algorithms in Go.',
    responsibilities: [
      'Implement Raft / Paxos consensus routines and storage compaction engine',
      'Benchmark memory allocations and profile CPU bottlenecks using pprof'
    ],
    requirements: [
      '4+ years backend systems development',
      'Strong fluency with Go, concurrency primitives, and Linux networking'
    ],
    requiredSkills: ['Go', 'Linux', 'Distributed Systems', 'Docker'],
    preferredSkills: ['Kubernetes', 'gRPC', 'PostgreSQL'],
    employmentType: 'FULL_TIME',
    workMode: 'REMOTE',
    location: 'Seattle, WA (Remote)',
    salaryMin: 160000,
    salaryMax: 195000,
    salaryCurrency: 'USD',
    experienceMin: 4,
    educationRequired: 'bachelors',
    status: 'ACTIVE',
    createdAt: '2026-03-26T09:20:00Z'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Senior Full-Stack Engineer (React & TypeScript)',
    companyName: 'CloudScale Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    candidateId: 'cand-profile-1',
    candidateName: 'Alex Rivera',
    candidateEmail: 'alex.rivera@example.com',
    candidateExperience: 5,
    matchScore: 92.4,
    currentStatus: 'INTERVIEW',
    appliedAt: '2026-03-23T14:00:00Z',
    notes: 'Strong portfolio in React and FastAPI. Technical round scheduled.',
    timeline: [
      { status: 'APPLIED', changedAt: '2026-03-23T14:00:00Z', note: 'Application submitted with verified resume.' },
      { status: 'SCREENING', changedAt: '2026-03-24T10:30:00Z', note: 'Resume parsed and reviewed by talent acquisition.' },
      { status: 'SHORTLISTED', changedAt: '2026-03-25T09:00:00Z', note: 'Candidate placed in top 5% by AI match score.' },
      { status: 'INTERVIEW', changedAt: '2026-03-26T16:00:00Z', note: 'Virtual technical interview invite dispatched.' }
    ]
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    jobTitle: 'Python Backend & AI Systems Engineer',
    companyName: 'FinFlow Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=100&auto=format&fit=crop&q=80',
    candidateId: 'cand-profile-1',
    candidateName: 'Alex Rivera',
    candidateEmail: 'alex.rivera@example.com',
    candidateExperience: 5,
    matchScore: 86.8,
    currentStatus: 'SCREENING',
    appliedAt: '2026-03-24T11:20:00Z',
    timeline: [
      { status: 'APPLIED', changedAt: '2026-03-24T11:20:00Z', note: 'Application received via CareerAI 1-click match.' },
      { status: 'SCREENING', changedAt: '2026-03-25T13:45:00Z', note: 'Initial skill match validation underway.' }
    ]
  }
];

export const MOCK_COURSES = [
  {
    id: 'course-1',
    skill: 'Kubernetes',
    title: 'Kubernetes for Production Microservices',
    provider: 'The Linux Foundation / CNCF',
    durationHours: 24,
    url: 'https://www.cncf.io/certification/cka/'
  },
  {
    id: 'course-2',
    skill: 'Amazon Web Services',
    title: 'AWS Certified Solutions Architect Associate',
    provider: 'AWS Training & Certification',
    durationHours: 32,
    url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'
  },
  {
    id: 'course-3',
    skill: 'Go',
    title: 'Tour of Go & Distributed Concurrency',
    provider: 'Go Dev Official Documentation',
    durationHours: 16,
    url: 'https://go.dev/tour/'
  },
  {
    id: 'course-4',
    skill: 'Terraform',
    title: 'HashiCorp Certified: Terraform Associate',
    provider: 'HashiCorp Learn',
    durationHours: 18,
    url: 'https://developer.hashicorp.com/terraform/tutorials'
  },
  {
    id: 'course-5',
    skill: 'Redis',
    title: 'Redis Data Structures & High Availability',
    provider: 'Redis University',
    durationHours: 12,
    url: 'https://university.redis.io/'
  }
];
