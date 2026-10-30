import { Profile, Project, Experience, Education, Skill, Certificate, SiteSetting } from "../types";

export const fallbackProfile: Profile = {
  "id": 1,
  "full_name": "Wiame El Hernoussi",
  "title": "Data & AI Engineering Student",
  "pitch": "Final-year engineering student in Data & AI. I take projects from raw data to a working product: pipelines, models, APIs and the interface people actually use.",
  "availability_badge": "Open to an end-of-studies internship from February 2027",
  "about_bio": "I am a final-year engineering student in Computer & Network Engineering (Data & AI track) at EMSI Marrakech. I specialize in designing and deploying end-to-end intelligent systems: from robust ETL data pipelines and state-of-the-art computer vision and LLM agent architectures to high-performance FastAPI backends and intuitive user interfaces. Looking for a challenging 6-month end-of-studies internship (PFE) starting February 2027 in Morocco or internationally.",
  "location": "Marrakech, Morocco (Open to Morocco & International Relocation)",
  "email": "wiameelhernoussi@gmail.con",
  "phone": "",
  "github_url": "https://github.com/Wiameelhernoussi",
  "linkedin_url": "https://www.linkedin.com/in/wiameelhernoussi/",
  "cv_url": "",
  "avatar_url": "/uploads/avatars/5a51a5fc9353453bbe2783b947983e67.webp",
  "key_figures": [
    {
      "label": "Intent Accuracy",
      "value": "97.30%",
      "sub": "5-fold cross-validation on 148 examples"
    },
    {
      "label": "Dataset Indexed",
      "value": "3,000+",
      "sub": "hotel documents for RAG semantic search"
    },
    {
      "label": "Inference Latency",
      "value": "2.0 ms",
      "sub": "YOLOv11s defect detection per image"
    },
    {
      "label": "Transactions Processed",
      "value": "96,000+",
      "sub": "ETL warehouse with 7 Talend jobs"
    }
  ],
  "languages": [
    {
      "language": "Arabic",
      "level": "Native"
    },
    {
      "language": "French",
      "level": "Fluent"
    },
    {
      "language": "English",
      "level": "Advanced"
    }
  ],
  "interests": [
    "Basketball",
    "Strength training",
    "Reading"
  ],
  "social_links": {
    "linkedin": "https://www.linkedin.com/in/wiameelhernoussi/",
    "github": "https://github.com/Wiameelhernoussi"
  }
};

export const fallbackProjects: Project[] = [
  {
    "id": 1,
    "title": "Royal Mansour Virtual Concierge",
    "slug": "royal-mansour-virtual-concierge",
    "category": "Generative AI & LLM Agents",
    "short_description": "Multilingual omnichannel assistant on the hotel website and WhatsApp with autonomous agents for FAQ, RAG, recommendations, and reservations.",
    "long_description": "### Overview\nDeveloped during an end-of-studies internship at the prestigious Royal Mansour Marrakech luxury hotel. Built an omnichannel, autonomous concierge assistant deployed on both the official hotel portal and WhatsApp to deliver bespoke guest experiences across three languages (French, English, and Arabic).\n\n### Key Architectural Highlights & Impact\n* **Autonomous Multi-Agent Orchestration**: Designed a central intent and language orchestrator that dynamically routes queries to specialized agents (FAQ, vector-powered RAG, personalized recommendations, and table/stay reservations).\n* **High-Precision Intent Classification**: Attained **97.30% intent classification accuracy** evaluated via rigorous 5-fold cross-validation on 148 domain-specific conversation examples.\n* **Semantic RAG Engine & Tool Calling**: Indexed more than **3,000 hotel policy, dining, and spa documents** into ChromaDB, leveraging Groq LLM inference, FastAPI microservices, and automated two-way synchronization with Google Calendar for confirmed reservations.",
    "technologies": [
      "LLM Agents",
      "RAG",
      "ChromaDB",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "Groq",
      "Google Calendar API"
    ],
    "start_date": "Jul 2026",
    "end_date": "Sep 2026",
    "status": "Completed",
    "is_featured": true,
    "cover_image": "/uploads/projects/f5c2490c7b9a44b1a08108927c6c9085.webp",
    "gallery_images": [],
    "metrics": [
      {
        "label": "Intent Accuracy",
        "value": "97.30%"
      },
      {
        "label": "Languages",
        "value": "3 (FR, EN, AR)"
      },
      {
        "label": "Documents Indexed",
        "value": "3,000+"
      }
    ],
    "links": {
      "github": "https://github.com/Wiameelhernoussi/RoyalMansourChatbot",
      "demo": "",
      "video": "",
      "pdf": ""
    },
    "order_index": 1,
    "is_published": true,
    "created_at": "2026-10-29 22:07:46.590386",
    "updated_at": "2026-10-30 00:43:06.440791"
  },
  {
    "id": 2,
    "title": "SmartPark: Intelligent Parking Platform",
    "slug": "smartpark-ai",
    "category": "Computer Vision & Deep Learning",
    "short_description": "Smart parking platform combining YOLOv8 real-time bay occupancy detection with LSTM forecasting, Active Learning, and explainable AI.",
    "long_description": "### Overview\nSmartPark is an end-to-end intelligent parking management and forecasting system. It transforms raw video streams into live occupancy telemetry, predictive capacity forecasts, and intuitive driver navigation.\n\n### Key Architectural Highlights & Impact\n* **Vision & Temporal Forecasting Fusion**: Fine-tuned **YOLOv8** for real-time bay occupancy detection paired with an **LSTM neural network** to accurately forecast lot saturation up to several hours in advance.\n* **Explainable AI & Active Learning Loop**: Integrated **Grad-CAM** and **SHAP** to visually explain detection boundaries and identify false positives under adverse lighting conditions, triggering an Active Learning loop for continuous retraining.\n* **Full-Stack PWA Architecture**: Built a high-throughput **FastAPI** backend with **PostgreSQL**, consumed by an offline-ready **React Progressive Web App (PWA)** for drivers and lot administrators.",
    "technologies": [
      "YOLOv8",
      "LSTM",
      "FastAPI",
      "PostgreSQL",
      "React PWA",
      "Grad-CAM",
      "SHAP",
      "Active Learning"
    ],
    "start_date": "Feb 2026",
    "end_date": "May 2026",
    "status": "Completed",
    "is_featured": false,
    "cover_image": "/uploads/projects/64aadbcc5a144f76952d24829e8981cd.webp",
    "gallery_images": [],
    "metrics": [
      {
        "label": "Model",
        "value": "YOLOv8 + LSTM"
      },
      {
        "label": "Explainability",
        "value": "Grad-CAM & SHAP"
      },
      {
        "label": "Interface",
        "value": "React PWA"
      }
    ],
    "links": {
      "github": "https://github.com/Wiameelhernoussi/smartparkAI",
      "demo": "",
      "video": "",
      "pdf": ""
    },
    "order_index": 2,
    "is_published": true,
    "created_at": "2026-10-29 22:07:46.590398",
    "updated_at": "2026-10-30 00:43:52.034450"
  },
  {
    "id": 3,
    "title": "Defect Detection with Autonomous Drones",
    "slug": "defect-detection-autonomous-drones",
    "category": "Computer Vision & Edge AI",
    "short_description": "Comparative study and deployment of Vision-Language Models (VLMs) and fine-tuned YOLOv11s for real-time structural defect inspection.",
    "long_description": "### Overview\nA collaborative engineering initiative evaluating modern computer vision paradigms for real-time, onboard structural defect identification using autonomous inspection drones.\n\n### Key Architectural Highlights & Impact\n* **Multi-Paradigm Comparative Benchmark**: Systematically evaluated zero-shot Vision-Language Models (VLMs), VLM with Retrieval-Augmented Generation, and an optimized, fine-tuned **YOLOv11s** model.\n* **Unified Architectural Dataset**: Curated and annotated a unified benchmark dataset of **16,580 high-resolution images** spanning modern reinforced concrete and historical Spanish adobe brick structures.\n* **Edge-Ready Performance**: Achieved **86.1% mAP50** with an ultra-low inference latency of **2.0 ms per frame**, proving operational feasibility for real-time onboard drone processors.",
    "technologies": [
      "YOLOv11",
      "Vision-Language Models",
      "RAG",
      "Computer Vision",
      "PyTorch",
      "Edge AI"
    ],
    "start_date": "Ongoing",
    "end_date": "2026",
    "status": "Ongoing",
    "is_featured": false,
    "cover_image": "/uploads/projects/4a968cac3a7d45c79aff8dec62cf6d44.webp",
    "gallery_images": [],
    "metrics": [
      {
        "label": "mAP50 Score",
        "value": "86.1%"
      },
      {
        "label": "Inference Speed",
        "value": "2.0 ms / frame"
      },
      {
        "label": "Dataset Size",
        "value": "16,580 images"
      }
    ],
    "links": {
      "github": "",
      "demo": "",
      "video": "",
      "pdf": ""
    },
    "order_index": 3,
    "is_published": true,
    "created_at": "2026-10-29 22:07:46.590405",
    "updated_at": "2026-10-30 01:05:00.837867"
  },
  {
    "id": 4,
    "title": "Customer Loyalty Analytics & Data Warehouse",
    "slug": "customer-loyalty-analytics",
    "category": "Data Engineering & Analytics",
    "short_description": "End-to-end data warehousing pipeline integrating 96,000+ Brazilian e-commerce transactions into a PostgreSQL star schema with Power BI DAX dashboards.",
    "long_description": "### Overview\nBuilt an enterprise-grade data warehouse and analytical reporting platform on the Olist Brazilian e-commerce public dataset to model customer lifecycle value, retention dynamics, and satisfaction drivers.\n\n### Key Architectural Highlights & Impact\n* **Robust Talend ETL Orchestration**: Cleaned, transformed, and loaded over **96,000 transactions** across 6 disparate relational sources using **7 automated Talend ETL jobs**.\n* **Star Schema with SCD Type 2**: Architected a PostgreSQL dimensional model with 1 central fact table and 5 dimension tables, implementing **Slowly Changing Dimensions (SCD2)** to track historical customer loyalty tier transitions over time.\n* **Actionable Power BI Dashboard**: Developed sophisticated DAX measures revealing an average basket size of **137.04 BRL**, average repurchase intervals of **~112 days**, and overall customer rating of **4.16 / 5**.",
    "technologies": [
      "Talend ETL",
      "PostgreSQL",
      "Data Warehousing",
      "Star Schema",
      "SCD2",
      "Power BI",
      "DAX"
    ],
    "start_date": "Apr 2026",
    "end_date": "May 2026",
    "status": "Completed",
    "is_featured": false,
    "cover_image": "/uploads/projects/aa34f94ff9884db0bbd5f6ea363d09e5.webp",
    "gallery_images": [],
    "metrics": [
      {
        "label": "Volume",
        "value": "96,000+ records"
      },
      {
        "label": "ETL Jobs",
        "value": "7 Talend pipelines"
      },
      {
        "label": "Avg Basket",
        "value": "137.04 BRL"
      }
    ],
    "links": {
      "github": "https://github.com/Wiameelhernoussi/Customer-Loyalty-Analytics-",
      "demo": "",
      "video": "",
      "pdf": ""
    },
    "order_index": 4,
    "is_published": true,
    "created_at": "2026-10-29 22:07:46.590411",
    "updated_at": "2026-10-30 00:44:52.376155"
  },
  {
    "id": 5,
    "title": "Federated Learning for Hotel Booking Cancellation",
    "slug": "federated-learning-hotel-cancellations",
    "category": "Distributed AI & Privacy",
    "short_description": "Decentralized predictive modelling using FedAvg and FedProx with differential privacy guarantees to forecast booking cancellations without centralizing guest records.",
    "long_description": "### Overview\nDesigned a privacy-preserving federated machine learning architecture that enables competing hotel networks to collaboratively train a high-accuracy cancellation prediction model without exposing sensitive customer reservation records.\n\n### Key Architectural Highlights & Impact\n* **Federated Optimization Algorithms**: Implemented and benchmarked **FedAvg** and **FedProx** optimization algorithms to handle statistical heterogeneity across disparate distributed hotel nodes.\n* **Rigorous Differential Privacy**: Integrated mathematical **differential privacy (DP)** noise mechanisms to provably bound data leakage and protect individual guest identities from model inversion attacks.\n* **High Predictive Fidelity**: Maintained competitive predictive accuracy comparable to a centralized baseline model while keeping 100% of raw tabular data strictly within local silos.",
    "technologies": [
      "Federated Learning",
      "FedAvg",
      "FedProx",
      "Differential Privacy",
      "PyTorch",
      "Python"
    ],
    "start_date": "Apr 2026",
    "end_date": "May 2026",
    "status": "Completed",
    "is_featured": false,
    "cover_image": "/uploads/projects/590c1c7730d94df7a5cadbd752db47c7.webp",
    "gallery_images": [],
    "metrics": [
      {
        "label": "Algorithms",
        "value": "FedAvg & FedProx"
      },
      {
        "label": "Privacy",
        "value": "Differential Privacy"
      },
      {
        "label": "Data Locality",
        "value": "100% Decentralized"
      }
    ],
    "links": {
      "github": "https://github.com/Wiameelhernoussi/federated-learning-hotel",
      "demo": "",
      "video": "",
      "pdf": ""
    },
    "order_index": 5,
    "is_published": true,
    "created_at": "2026-10-29 22:07:46.590416",
    "updated_at": "2026-10-30 00:45:31.487830"
  },
  {
    "id": 6,
    "title": "Machine Learning Job Recommendation System",
    "slug": "job-recommendation-ml",
    "category": "AI & Machine Learning",
    "short_description": "Candidate-to-opportunity matching engine using unsupervised clustering and supervised classification with scikit-learn.",
    "long_description": "### Overview\nEngineered an intelligent recommendation system that bridges technical job opportunities with candidate profile skills through semantic preprocessing, dimensional clustering, and classification.\n\n### Key Architectural Highlights & Impact\n* **Advanced Feature Engineering**: Cleaned and vectorized unstructured job descriptions, skills matrices, and candidate profiles using TF-IDF and dense embeddings with **scikit-learn**, **Pandas**, and **NumPy**.\n* **Clustering & Classification Synergy**: Blended unsupervised clustering algorithms with supervised classifiers to generate personalized rank-ordered opportunity recommendations with explainable similarity metrics.",
    "technologies": [
      "scikit-learn",
      "Pandas",
      "NumPy",
      "NLP Vectorization",
      "Classification",
      "Python"
    ],
    "start_date": "2025",
    "end_date": "2026",
    "status": "Completed",
    "is_featured": false,
    "cover_image": "/uploads/projects/ddf80a930ae04d00b292ccb2dbb289c5.webp",
    "gallery_images": [],
    "metrics": [
      {
        "label": "Stack",
        "value": "scikit-learn, Pandas"
      },
      {
        "label": "Task",
        "value": "Matching & Ranking"
      }
    ],
    "links": {
      "github": "",
      "demo": "",
      "video": "",
      "pdf": ""
    },
    "order_index": 6,
    "is_published": true,
    "created_at": "2026-10-29 22:07:46.590422",
    "updated_at": "2026-10-30 00:49:19.883692"
  },
  {
    "id": 7,
    "title": "Statistical & Predictive Analysis of Breast Cancer",
    "slug": "breast-cancer-statistical-analysis",
    "category": "Data Science & Biostatistics",
    "short_description": "Univariate, bivariate, and multivariate analysis of the Wisconsin diagnostic dataset with predictive clinical classification in Python and R.",
    "long_description": "### Overview\nAn in-depth statistical investigation and predictive modeling workflow conducted on the benchmark Wisconsin Diagnostic Breast Cancer dataset to discover significant diagnostic biomarkers.\n\n### Key Architectural Highlights & Impact\n* **Rigorous Multivariate Biostatistics**: Performed principal component analysis (PCA), correlation matrices, and distribution tests using **Python**, **R**, and **Seaborn** to isolate features that reliably distinguish malignant from benign cellular biopsies.\n* **Supervised Clinical Classifiers**: Trained and cross-validated statistical classification models yielding high sensitivity and specificity metrics crucial for diagnostic decision-support tools.",
    "technologies": [
      "Python",
      "R",
      "Seaborn",
      "PCA",
      "Statistical Modeling",
      "Biostatistics",
      "Machine Learning",
      "ACP",
      "KMO"
    ],
    "start_date": "2025",
    "end_date": "2025",
    "status": "Completed",
    "is_featured": false,
    "cover_image": "/uploads/projects/611e7e996a114ce696e44caab13d45fb.webp",
    "gallery_images": [],
    "metrics": [
      {
        "label": "Dataset",
        "value": "Wisconsin Diagnostic"
      },
      {
        "label": "Tools",
        "value": "Python, R, Seaborn"
      }
    ],
    "links": {
      "github": "",
      "demo": "",
      "video": "",
      "pdf": ""
    },
    "order_index": 7,
    "is_published": true,
    "created_at": "2026-10-29 22:07:46.590428",
    "updated_at": "2026-10-30 01:00:50.971405"
  },
  {
    "id": 8,
    "title": "School Enrolment Mobile App with Verification",
    "slug": "school-enrolment-mobile-app",
    "category": "Software Engineering & Mobile",
    "short_description": "Android mobile application with Laravel backend for student registration, authentication, and administrative verification of baccalauréat and identity documents.",
    "long_description": "### Overview\nA full-stack mobile solution developed to streamline student academic enrollment, eliminate physical paper queues, and securely verify legal student documents.\n\n### Key Architectural Highlights & Impact\n* **Native Android Client**: Crafted an intuitive native Android user interface with **Java and XML**, offering smooth onboarding, camera document scanning, and profile management.\n* **Secure Backend Verification Workflow**: Integrated a **Laravel** REST API and **SQLite** database enabling school administrators to review submitted baccalauréat diplomas and national identity documents with instant status updates.",
    "technologies": [
      "Java",
      "Android XML",
      "Laravel",
      "REST API",
      "SQLite",
      "Mobile Security"
    ],
    "start_date": "2024",
    "end_date": "2025",
    "status": "Completed",
    "is_featured": false,
    "cover_image": "/uploads/projects/a84b5f7c9d2544ee9eb15ea3d4682328.webp",
    "gallery_images": [],
    "metrics": [
      {
        "label": "Client",
        "value": "Native Android Java"
      },
      {
        "label": "Backend",
        "value": "Laravel & SQLite"
      }
    ],
    "links": {
      "github": "",
      "demo": "",
      "video": "",
      "pdf": ""
    },
    "order_index": 8,
    "is_published": true,
    "created_at": "2026-10-29 22:07:46.590433",
    "updated_at": "2026-10-30 01:06:45.185070"
  },
  {
    "id": 9,
    "title": "NannyCare",
    "slug": "nannycare",
    "category": "Computer Vision · Deep Learning · Edge AI · Human Pose Estimation",
    "short_description": "Embedded AI System for Infant Sleep Monitoring & Anomaly Detection\n",
    "long_description": "### Project Overview\nNannyCare is an intelligent embedded vision system designed to monitor infant sleep at night and identify potentially concerning situations through computer vision and deep learning.\n\nThe system aims to analyze an infant's body posture, facial visibility, movements and possible occlusions using a camera-based, non-contact approach. It is designed to operate locally, enabling real-time monitoring while prioritizing data privacy.\n\n### Key Highlights\nReal-Time Pose Estimation: Identify body landmarks and analyze infant sleeping positions.\n\nFacial Visibility Analysis: Detect facial regions and assess their visibility and potential occlusions.\n\nMovement & Anomaly Detection: Study movements and temporal patterns to identify situations requiring parental attention.\n\nEmbedded AI Processing: Develop a local processing pipeline using a night-vision camera.\n\nMorning Sleep Report: Generate a telemetry-based summary of detected events and observations.\n\n##Expected Impact\n\nDevelop a non-contact monitoring prototype that supports parental awareness, provides automated sleep observations and identifies situations that may require human verification.",
    "technologies": [
      "Python",
      "FastAPI",
      "deep learning",
      "Computer Vision",
      "Edge Ai",
      "Embedded Systems",
      "Yolov8"
    ],
    "start_date": "2026",
    "end_date": "2026",
    "status": "Ongoing",
    "is_featured": false,
    "cover_image": "/uploads/projects/e001757baecd4697a8f322ab9763a37e.webp",
    "gallery_images": [],
    "metrics": [],
    "links": {
      "github": "",
      "demo": "",
      "video": "",
      "pdf": ""
    },
    "order_index": 9,
    "is_published": true,
    "created_at": "2026-10-30 00:36:00.403793",
    "updated_at": "2026-10-30 00:36:00.403803"
  },
  {
    "id": 10,
    "title": "UrbanMap Gen",
    "slug": "urbanmap-gen",
    "category": "Generative AI · Computer Vision · GANs · Image-to-Image Translation",
    "short_description": "Translating Aerial Images into Structured Road Maps Using Generative AI",
    "long_description": "### Project Overview\nUrbanMap Gen explores the use of conditional Generative Adversarial Networks (cGANs) to transform aerial and satellite imagery into stylized road maps.\n\nThe project focuses on generating coherent road networks while minimizing disconnected segments, missing roads and artificially generated connections.\n\n### Key Highlights\nImage-to-Map Translation: Transform aerial imagery into stylized road maps.\n\nRoad Network Extraction: Extract road masks from generated maps using color-based segmentation.\n\nEdge Preservation: Introduce an edge-aware loss to improve road boundary consistency.\n\nConnectivity Optimization: Explore differentiable road continuity regularization using soft skeletonization and clDice-inspired loss.\n\nPerformance Evaluation: Compare generated road networks against reference maps using quantitative metrics.\n\nExperimental Approach\n\nThree model configurations will be investigated:\n\nBaseline: Standard Pix2Pix architecture.\n\nEdge-Aware Pix2Pix: Integration of an edge loss to preserve road boundaries.\n\nConnectivity-Aware Pix2Pix: Additional differentiable regularization to encourage continuous road networks.\n\nA classical image-processing-based road extraction method will also serve as a reference baseline.\n\nDataset & Evaluation\n\nDataset: Official Maps dataset from the Pix2Pix repository.\n\nTraining and validation: Official training split, with validation extracted from training data.\n\nTesting: Official geographically separated validation split.\n\nResolution: 256 × 256 pixels, with resizing or cropping strategy documented.\n\nEvaluation Metrics:\n\nIntersection over Union (IoU).\n\nPrecision, Recall and F1-score.\n\nNumber of connected components.\n\nRoad discontinuity rate.\n\nConnectivity precision and recall.\n\nFalse road length.\n\nExpected Deliverables\n\nAnnotated model architecture.\n\nReproducible training configuration.\n\nGenerated aerial-to-map translations.\n\nExtracted road network masks.\n\nQuantitative evaluation and comparison tables.\n\nFailure-case analysis and visual examples.",
    "technologies": [
      "Python",
      "FastAPI",
      "Pytorch",
      "Computer Vision",
      "Pix2Pix",
      "Conditional GANs",
      "U-Net",
      "PatchGAN",
      "OpenCV",
      "Image Processing",
      "Deep Learning"
    ],
    "start_date": "2026",
    "end_date": "2026",
    "status": "Ongoing",
    "is_featured": false,
    "cover_image": "/uploads/projects/135f7d2ca8f74ec1abc15a1eb63abebf.webp",
    "gallery_images": [],
    "metrics": [],
    "links": {
      "github": "",
      "demo": "",
      "video": "",
      "pdf": ""
    },
    "order_index": 10,
    "is_published": true,
    "created_at": "2026-10-30 00:40:14.153948",
    "updated_at": "2026-10-30 00:40:14.153975"
  }
];

export const fallbackExperiences: Experience[] = [
  {
    "id": 1,
    "role": "Generative AI Intern",
    "company": "Royal Mansour Marrakech",
    "location": "Marrakech, Morocco",
    "start_date": "Jul 2026",
    "end_date": "Sep 2026",
    "description": "Designed and deployed a multi-agent multilingual virtual concierge for website and WhatsApp guest communications, working in Agile/Scrum with the hotel's IT department. Authored comprehensive technical documentation and UML system architecture.",
    "highlights": [
      "Architected an autonomous multi-agent system on LLMs, RAG, and ChromaDB with FastAPI, PostgreSQL, and Docker.",
      "Integrated intent classification achieving 97.30% cross-validated accuracy across French, English, and Arabic.",
      "Connected automated tool calling to Google Calendar for instant table and stay reservation booking."
    ],
    "technologies": [
      "LLM Agents",
      "RAG",
      "ChromaDB",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "UML",
      "Agile/Scrum"
    ],
    "order_index": 1
  },
  {
    "id": 2,
    "role": "NLP / Machine Learning Intern",
    "company": "Orchid Island Real Estate",
    "location": "Marrakech, Morocco",
    "start_date": "Jul 2025",
    "end_date": "Sep 2025",
    "description": "Engineered a conversational real-estate assistant capable of qualifying prospective buyers, parsing search criteria, and recommending matching properties.",
    "highlights": [
      "Built custom conversational pipelines and intent detection models using Rasa Open Source, PyTorch, and scikit-learn.",
      "Implemented entity extraction pipelines to extract property budgets, locations, and asset specifications from unstructured messages."
    ],
    "technologies": [
      "NLP",
      "Rasa",
      "PyTorch",
      "scikit-learn",
      "Python"
    ],
    "order_index": 2
  }
];

export const fallbackEducation: Education[] = [
  {
    "id": 1,
    "degree": "Engineering Degree in Computer & Network Engineering (AI / Data Track)",
    "institution": "EMSI Marrakech (École Marocaine des Sciences de l'Ingénieur)",
    "location": "Marrakech, Morocco",
    "start_date": "Oct 2024",
    "end_date": "Present (Graduating 2027)",
    "description": "Specializing in artificial intelligence, deep learning architectures, big data engineering, distributed systems, and modern software development.",
    "order_index": 1
  },
  {
    "id": 2,
    "degree": "Classes Préparatoires aux Grandes Écoles (CPGE) – Mathematics & Physics (MP)",
    "institution": "Lycée Ibn Taymia",
    "location": "Marrakech, Morocco",
    "start_date": "2021",
    "end_date": "2023",
    "description": "Intensive two-year advanced curriculum in higher mathematics, theoretical physics, algorithmic computer science, and engineering fundamentals.",
    "order_index": 2
  },
  {
    "id": 3,
    "degree": "Baccalauréat in Mathematical Sciences A",
    "institution": "Lycée Mohammed V",
    "location": "Essaouira, Morocco",
    "start_date": "2020",
    "end_date": "2021",
    "description": "Graduated with honors in Mathematical Sciences.",
    "order_index": 3
  }
];

export const fallbackSkills: Skill[] = [
  {
    "id": 1,
    "name": "PyTorch",
    "category": "AI & Machine Learning",
    "level": 90,
    "order_index": 1
  },
  {
    "id": 2,
    "name": "scikit-learn",
    "category": "AI & Machine Learning",
    "level": 92,
    "order_index": 2
  },
  {
    "id": 3,
    "name": "YOLO (v8, v11)",
    "category": "AI & Machine Learning",
    "level": 92,
    "order_index": 3
  },
  {
    "id": 4,
    "name": "LSTM & Recurrent Nets",
    "category": "AI & Machine Learning",
    "level": 85,
    "order_index": 4
  },
  {
    "id": 5,
    "name": "LLM Agents & Multi-Agent Systems",
    "category": "AI & Machine Learning",
    "level": 92,
    "order_index": 5
  },
  {
    "id": 6,
    "name": "Retrieval-Augmented Generation (RAG)",
    "category": "AI & Machine Learning",
    "level": 90,
    "order_index": 6
  },
  {
    "id": 7,
    "name": "Rasa Conversational AI",
    "category": "AI & Machine Learning",
    "level": 82,
    "order_index": 7
  },
  {
    "id": 8,
    "name": "Federated Learning (FedAvg, FedProx)",
    "category": "AI & Machine Learning",
    "level": 85,
    "order_index": 8
  },
  {
    "id": 9,
    "name": "Explainable AI (Grad-CAM, SHAP)",
    "category": "AI & Machine Learning",
    "level": 88,
    "order_index": 9
  },
  {
    "id": 10,
    "name": "SQL & Relational Modeling",
    "category": "Data",
    "level": 94,
    "order_index": 10
  },
  {
    "id": 11,
    "name": "Talend ETL",
    "category": "Data",
    "level": 88,
    "order_index": 11
  },
  {
    "id": 12,
    "name": "Data Warehousing (Star Schema, SCD2)",
    "category": "Data",
    "level": 88,
    "order_index": 12
  },
  {
    "id": 13,
    "name": "Power BI & DAX",
    "category": "Data",
    "level": 86,
    "order_index": 13
  },
  {
    "id": 14,
    "name": "Pandas & NumPy",
    "category": "Data",
    "level": 95,
    "order_index": 14
  },
  {
    "id": 15,
    "name": "R / RStudio",
    "category": "Data",
    "level": 80,
    "order_index": 15
  },
  {
    "id": 16,
    "name": "Jupyter Notebooks",
    "category": "Data",
    "level": 95,
    "order_index": 16
  },
  {
    "id": 17,
    "name": "FastAPI",
    "category": "Engineering",
    "level": 92,
    "order_index": 17
  },
  {
    "id": 18,
    "name": "React & TypeScript",
    "category": "Engineering",
    "level": 85,
    "order_index": 18
  },
  {
    "id": 19,
    "name": "Docker & Containerization",
    "category": "Engineering",
    "level": 88,
    "order_index": 19
  },
  {
    "id": 20,
    "name": "Git & GitHub Workflow",
    "category": "Engineering",
    "level": 92,
    "order_index": 20
  },
  {
    "id": 21,
    "name": "Linux / Bash",
    "category": "Engineering",
    "level": 86,
    "order_index": 21
  },
  {
    "id": 22,
    "name": "VMware ESXi",
    "category": "Engineering",
    "level": 78,
    "order_index": 22
  },
  {
    "id": 23,
    "name": "Python",
    "category": "Languages & Databases",
    "level": 95,
    "order_index": 23
  },
  {
    "id": 24,
    "name": "PostgreSQL",
    "category": "Languages & Databases",
    "level": 92,
    "order_index": 24
  },
  {
    "id": 25,
    "name": "Java",
    "category": "Languages & Databases",
    "level": 82,
    "order_index": 25
  },
  {
    "id": 26,
    "name": "C++",
    "category": "Languages & Databases",
    "level": 80,
    "order_index": 26
  },
  {
    "id": 27,
    "name": "C#",
    "category": "Languages & Databases",
    "level": 75,
    "order_index": 27
  },
  {
    "id": 28,
    "name": "PL/SQL",
    "category": "Languages & Databases",
    "level": 85,
    "order_index": 28
  },
  {
    "id": 29,
    "name": "Oracle",
    "category": "Languages & Databases",
    "level": 80,
    "order_index": 29
  },
  {
    "id": 30,
    "name": "MySQL",
    "category": "Languages & Databases",
    "level": 88,
    "order_index": 30
  },
  {
    "id": 31,
    "name": "SQL Server",
    "category": "Languages & Databases",
    "level": 82,
    "order_index": 31
  },
  {
    "id": 32,
    "name": "MongoDB",
    "category": "Languages & Databases",
    "level": 80,
    "order_index": 32
  }
];

export const fallbackCertificates: Certificate[] = [
  {
    "id": 1,
    "title": "Machine Learning",
    "issuer": "Coursera",
    "issue_date": "",
    "image_url": "",
    "pdf_url": "",
    "verification_url": "",
    "order_index": 1,
    "is_visible": true
  },
  {
    "id": 2,
    "title": "Python",
    "issuer": "Coursera",
    "issue_date": "",
    "image_url": "",
    "pdf_url": "",
    "verification_url": "",
    "order_index": 2,
    "is_visible": true
  },
  {
    "id": 3,
    "title": "Cloud Computing",
    "issuer": "Coursera",
    "issue_date": "",
    "image_url": "",
    "pdf_url": "",
    "verification_url": "",
    "order_index": 3,
    "is_visible": true
  },
  {
    "id": 4,
    "title": "Big Data",
    "issuer": "Coursera",
    "issue_date": "",
    "image_url": "",
    "pdf_url": "",
    "verification_url": "",
    "order_index": 4,
    "is_visible": true
  }
];

export const fallbackSettings: SiteSetting = {
  "id": 1,
  "site_title": "Wiame El Hernoussi – Data & AI Engineer",
  "meta_description": "Portfolio of Wiame El Hernoussi, final-year Data & AI Engineering student at EMSI Marrakech looking for an end-of-studies internship from February 2027 in Morocco or abroad.",
  "keywords": "Wiame El Hernoussi, Data Engineer, AI Engineer, Machine Learning, Deep Learning, LLM Agents, RAG, YOLO, Computer Vision, FastAPI, React, EMSI Marrakech",
  "og_image_url": "/og-preview.png",
  "accent_color": "#E9A21F",
  "primary_color": "#2B3FA3",
  "section_visibility": {
    "hero": true,
    "about": true,
    "projects": true,
    "experience": true,
    "skills": true,
    "certificates": true,
    "education": true,
    "interests": true,
    "contact": true
  }
};
