/* =====================================================================
   PORTFOLIO DATA – Embedded as a JS variable so the portfolio works
   by opening index.html directly (file://) with NO server needed.

   HOW TO UPDATE:
   Edit this file directly. Keep the structure as-is.
   Also keep portfolio-data.json in sync (used by Admin panel export).
   ===================================================================== */

const PORTFOLIO_DATA = {
  "meta": {
    "name": "DC Sangeeth",
    "title": "Electrical & Electronic Engineer | ML/AI Enthusiast | Flutter Developer",
    "email": "dcsangeeth@gmail.com",
    "phone": "+94 76 123 4567",
    "location": "Sri Lanka",
    "github": "https://github.com/dcsangeeth",
    "linkedin": "https://linkedin.com/in/dcsangeeth",
    "cv": "pdf/DC_Sangeeth_CV_Aug_2026.pdf"
  },
  "projects": [
    {
      "id": "proj-001",
      "title": "Power Prox – Asset Management System",
      "category": ["mobile"],
      "desc": "A Flutter/Dart mobile app for real-time tracking of SLT network infrastructure assets (Rectifiers, Generators, Batteries, SPDs, UPS) island-wide.",
      "tech": "Flutter, Dart, REST APIs, Git, Agile",
      "github": "",
      "demo": "projects/power-prox.html",
      "image": "power_prox.jpg"
    },
    {
      "id": "proj-002",
      "title": "Elephant Detection Using Seismic Signals",
      "category": ["iot", "ai"],
      "desc": "Developed a ground-based elephant detection system using geophone sensors, instrumentation amplifier-based signal conditioning, and machine learning models to analyze seismic vibrations and enable real-time elephant movement early warning detection.",
      "tech": "Geophone Sensors, Instrumentation Amplifier, Python, Signal Processing, Machine Learning",
      "github": "",
      "demo": "projects/elephant-detection.html",
      "image": "elephant_detection.png"
    },
    {
      "id": "proj-003",
      "title": "Water Level Indicator & Auto Switch System",
      "category": ["iot"],
      "desc": "End-to-end IoT solution with NodeMCU ESP8266, Firebase RTDB and Flutter app for real-time monitoring and automated pump control.",
      "tech": "NodeMCU, Dart, Flutter, Firebase RTDB, Arduino IDE",
      "github": "https://github.com/dcsangeeth/water_level_control_system",
      "demo": "projects/water-level.html",
      "image": "water_level_indicator.jpg"
    },
    {
      "id": "proj-004",
      "title": "Smart Route Optimization System",
      "category": ["web"],
      "desc": "Flask web app using Dijkstra algorithm + Google Maps API to compute optimal multi-stop routes minimising travel time and fuel.",
      "tech": "Python, Flask, Google Maps API, Dijkstra, HTML/CSS/JS",
      "github": "",
      "demo": "projects/smart-route.html",
      "image": "SmartRouteOptimizationSystem.png"
    },
    {
      "id": "proj-005",
      "title": "Hospital Queue Management System",
      "category": ["web"],
      "desc": "Full-stack system with Flask + FastAPI and MySQL to automate patient intake, intelligent doctor assignment and real-time queue management.",
      "tech": "Python, Flask, FastAPI, MySQL, HTML/CSS/JS",
      "github": "",
      "demo": "projects/hospital-queue.html",
      "image": "Hospital Queue Mangemenet System.png"
    }
  ],
  "experience": [
    {
      "id": "exp-001",
      "title": "Software Engineering Intern",
      "company": "Digital Platform – Sri Lanka Telecom (SLT-MOBITEL)",
      "period": "June 2024 – Sep 2024",
      "duration": "3 months",
      "location": "Colombo, Sri Lanka",
      "type": "Internship",
      "desc": "Contributed to full-stack development of PowerProx, an internal asset management system for SLT Digital Platform division. My role involved implementing new features, enhancing the UI, ensuring seamless API integrations, and participating in agile development cycles and team code reviews to improve code quality.",
      "responsibilities": "Implemented new features using Flutter and Dart for the PowerProx asset management app|Integrated REST APIs for real-time asset tracking and data sync|Participated in agile sprints, daily stand-ups, and code review sessions|Enhanced UI/UX for inspection and asset management workflows|Contributed to end-to-end testing and bug fixing",
      "tech": "Flutter, Dart, REST APIs, Git, GitHub, Agile, Jira"
    },
    {
      "id": "exp-002",
      "title": "AI Engineer Trainee",
      "company": "SLTMobitel",
      "period": "Aug 2025 - Oct 2025",
      "duration": "3 months",
      "location": "Colombo, Sri Lanka",
      "type": "Trainee",
      "desc": "Trainee at SLTMobitel Digital Lab focused on building and optimizing LLM-based multi-agent workflows, custom RAG systems, and conversational AI.",
      "responsibilities": "Built, traced, and optimized LLM-based multi-agent workflows|Developed custom RAG systems for intelligent document retrieval and summarization, including an Email Problem Solution RAG Agent|Designed multi-agent ecosystems in LangGraph and integrated n8n workflows, FastAPI, and Flask for backend connectivity|Built intelligent, human-in-the-loop chatbots for customer queries and complaint management",
      "tech": "Python, LangChain, LangGraph, LangSmith, Ollama, Google Gemini API, n8n, FastAPI, Flask, LLMs, RAG Systems, Multi-Agent Workflows"
    }
  ],
  "certifications": [
    {
      "id": "cert-001",
      "title": "Supervised Machine Learning: Regression & Classification",
      "issuer": "DeepLearning.AI – Coursera",
      "date": "July 2024",
      "priority": "high",
      "link": "https://www.coursera.org/account/accomplishments/verify/KJRF24U2QG3V",
      "description": "Completed the first course of the Machine Learning Specialization by Andrew Ng. Learned the fundamentals of supervised machine learning including linear regression, logistic regression, and neural networks. Applied concepts using Python and scikit-learn.",
      "skills": "Supervised Learning, Regression, Classification, Gradient Descent, Neural Networks, scikit-learn, Python",
      "icon": "fas fa-brain",
      "color": "#4361ee"
    },
    {
      "id": "cert-002",
      "title": "Advanced Learning Algorithms",
      "issuer": "DeepLearning.AI",
      "date": "June 2026",
      "priority": "high",
      "link": "https://www.coursera.org/account/accomplishments/verify/3PSTMENZE67O",
      "description": "Built and trained a neural network with TensorFlow to perform multi-class classification. Applied best practices for machine learning development and utilized decision trees and tree ensemble methods, including random forests and boosted trees.",
      "skills": "Applied Machine Learning, Machine Learning Algorithms, Supervised Learning, Deep Learning, Model Evaluation, Transfer Learning, Model Optimization, Responsible AI, Random Forest Algorithm, Fine-tuning, Model Training",
      "icon": "fas fa-brain",
      "color": "#4361ee"
    },
    {
      "id": "cert-003",
      "title": "AI/ML Engineer – Stage 1",
      "issuer": "Centre for Open & Distance Education – SLIIT",
      "date": "April 2025",
      "priority": "high",
      "link": "https://code.sliit.org/certificates/ujivvsovjz",
      "description": "Stage 1 of the AI/ML Engineer certification program at SLIIT CODE. Covered foundational concepts in machine learning, data preprocessing, and model development using Python.",
      "skills": "Machine Learning Foundations, Python for ML, Data Preprocessing, Model Evaluation, Supervised Learning",
      "icon": "fas fa-robot",
      "color": "#7209b7"
    },
    {
      "id": "cert-004",
      "title": "AI/ML Engineer – Stage 2",
      "issuer": "Centre for Open & Distance Education – SLIIT",
      "date": "April 2025",
      "priority": "high",
      "link": "https://code.sliit.org/certificates/wdc06fpqln",
      "description": "Stage 2 of the AI/ML Engineer certification program at SLIIT CODE. Covered advanced topics including deep learning, convolutional neural networks, NLP, and model deployment strategies.",
      "skills": "Deep Learning, Neural Networks, CNN, NLP, Model Deployment, Advanced ML Techniques",
      "icon": "fas fa-project-diagram",
      "color": "#3a0ca3"
    },
    {
      "id": "cert-005",
      "title": "What is Data Science?",
      "issuer": "Coursera – IBM",
      "date": "August 2023",
      "priority": "high",
      "link": "#",
      "description": "An introductory course on Data Science covering what data science is, what data scientists do, and the skills required to work in this evolving field.",
      "skills": "Data Science Fundamentals, Big Data, Data Analysis, Career Pathways in Data Science",
      "icon": "fas fa-chart-bar",
      "color": "#e63946"
    },
    {
      "id": "cert-006",
      "title": "Python for Beginners",
      "issuer": "University of Moratuwa – Open LMS",
      "date": "June 2022",
      "priority": "medium",
      "link": "https://open.uom.lk/lms/mod/customcert/verify_certificate.php",
      "description": "Introductory Python programming course by the University of Moratuwa. Learned fundamental Python concepts including data types, control flow, functions, and file I/O.",
      "skills": "Python Basics, Variables, Control Structures, Functions, File Handling",
      "icon": "fab fa-python",
      "color": "#3776AB"
    },
    {
      "id": "cert-007",
      "title": "Python Programming MasterClass",
      "issuer": "Pantech Solutions",
      "date": "June 2023",
      "priority": "medium",
      "link": "#",
      "description": "Comprehensive Python programming masterclass covering object-oriented programming, data structures, popular libraries, and real-world automation projects.",
      "skills": "Advanced Python, OOP, Data Structures, Libraries, Automation, Problem Solving",
      "icon": "fab fa-python",
      "color": "#FFD43B"
    },
    {
      "id": "cert-008",
      "title": "Web Design for Beginners",
      "issuer": "University of Moratuwa – Open LMS",
      "date": "December 2023",
      "priority": "low",
      "link": "#",
      "description": "Introductory web design course covering HTML, CSS, responsive layouts, and basic UI/UX design principles. Completed practical exercises in building simple responsive web pages.",
      "skills": "HTML, CSS, Responsive Design, Web Design Principles, UI/UX Basics",
      "icon": "fas fa-palette",
      "color": "#2ec4b6"
    }
  ],
  "skills": {
    "programming": [
      { "name": "Python",       "level": 85, "icon": "fab fa-python",    "color": "#3776AB" },
      { "name": "Dart / Flutter","level": 82, "icon": "fas fa-mobile-alt","color": "#54C5F8" },
      { "name": "C / C++",      "level": 75, "icon": "fas fa-microchip", "color": "#00599C" },
      { "name": "Java",         "level": 70, "icon": "fab fa-java",      "color": "#007396" },
      { "name": "JavaScript",   "level": 72, "icon": "fab fa-js",        "color": "#F7DF1E" },
      { "name": "SQL",          "level": 75, "icon": "fas fa-database",  "color": "#336791" }
    ],
    "frameworks": [
      { "name": "Flutter",        "level": 82, "icon": "fas fa-mobile-alt", "color": "#54C5F8" },
      { "name": "Flask / FastAPI","level": 78, "icon": "fas fa-server",     "color": "#000000" },
      { "name": "Firebase",       "level": 80, "icon": "fas fa-fire-alt",   "color": "#FFA000" },
      { "name": "Arduino IDE",    "level": 82, "icon": "fas fa-robot",      "color": "#00979D" },
      { "name": "Git & GitHub",   "level": 85, "icon": "fab fa-git-alt",    "color": "#F05032" },
      { "name": "scikit-learn",   "level": 75, "icon": "fas fa-brain",      "color": "#F89939" }
    ],
    "domains": [
      { "name": "Machine Learning",      "level": 75, "icon": "fas fa-brain",    "color": "#7209b7" },
      { "name": "IoT Systems",           "level": 85, "icon": "fas fa-wifi",     "color": "#00B894" },
      { "name": "Electrical Engineering","level": 88, "icon": "fas fa-bolt",     "color": "#e98a00" },
      { "name": "Power Systems",         "level": 82, "icon": "fas fa-plug",     "color": "#ef233c" },
      { "name": "Data Analysis",         "level": 72, "icon": "fas fa-chart-bar","color": "#4361ee" }
    ],
    "soft": [
      { "name": "Problem Solving",    "icon": "fas fa-lightbulb",      "color": "#FFD166", "desc": "Breaking complex problems into manageable solutions" },
      { "name": "Team Collaboration", "icon": "fas fa-users",          "color": "#4361ee", "desc": "Working effectively in Agile cross-functional teams" },
      { "name": "Communication",      "icon": "fas fa-comments",       "color": "#06d6a0", "desc": "Clear technical and non-technical communication" },
      { "name": "Adaptability",       "icon": "fas fa-sync-alt",       "color": "#f72585", "desc": "Quick to learn new technologies and frameworks" },
      { "name": "Time Management",    "icon": "fas fa-tasks",          "color": "#e9c46a", "desc": "Disciplined with deadlines and effective prioritisation" },
      { "name": "Project Management", "icon": "fas fa-project-diagram","color": "#6a4c93", "desc": "Organised planner with experience leading engineering projects" }
    ]
  },
  "education": [
    {
      "id": "edu-001",
      "degree": "B.Sc. Engineering (Hons) – Electrical & Electronic Engineering",
      "institution": "South Eastern University of Sri Lanka",
      "period": "2022 – Present",
      "desc": "Specialising in embedded systems, IoT, power electronics and software engineering.",
      "icon": "fas fa-university"
    },
    {
      "id": "edu-002",
      "degree": "G.C.E. Advanced Level – Physical Science",
      "institution": "Prasident Collage - Embilipitiya",
      "period": "2018 – 2020",
      "desc": "Combined Mathematics, Physics, Chemistry stream."
    },
    {
      "id": "edu-003",
      "degree": "G.C.E. Ordinary Level",
      "institution": "Mahinda College, Galle",
      "period": "Completed 2018",
      "desc": "Achieved 8 A passes in the 2018 national examination.",
      "icon": "fas fa-graduation-cap"
    }
  ]
};
