"""
Seed script to initialize database tables and populate with Wiame El Hernoussi's authentic portfolio data.
Adheres strictly to all user requirements:
- Empty email/phone placeholders (hidden on public site until updated in admin)
- Coursera certificates seeded without links and marked hidden (is_visible=False)
- Real LinkedIn and GitHub URLs
- Impact-focused Markdown bullet points for all 8 projects
- Multilingual and ML/Data details accurately represented
"""

import sys
from pathlib import Path

# Ensure backend root is on Python path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.core.config import settings
from app.core.security import get_password_hash
from app.models import (
    AdminUser,
    Profile,
    Project,
    Experience,
    Education,
    Skill,
    Certificate,
    SiteSetting,
)


def seed_database():
    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Admin User
        admin = db.query(AdminUser).filter(AdminUser.email == settings.FIRST_SUPERUSER_EMAIL).first()
        if not admin:
            admin = AdminUser(
                email=settings.FIRST_SUPERUSER_EMAIL,
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                full_name="Wiame El Hernoussi",
                is_active=True,
            )
            db.add(admin)
            print(f"Created initial admin user: {settings.FIRST_SUPERUSER_EMAIL}")
        else:
            print("Admin user already exists.")

        # 2. Profile
        profile = db.query(Profile).first()
        if not profile:
            profile = Profile(
                full_name="Wiame El Hernoussi",
                title="Data & AI Engineering Student",
                pitch="Final-year engineering student in Data & AI. I take projects from raw data to a working product: pipelines, models, APIs and the interface people actually use.",
                availability_badge="Open to an end-of-studies internship from February 2027",
                about_bio="I am a final-year engineering student in Computer & Network Engineering (Data & AI track) at EMSI Marrakech. I specialize in designing and deploying end-to-end intelligent systems: from robust ETL data pipelines and state-of-the-art computer vision and LLM agent architectures to high-performance FastAPI backends and intuitive user interfaces. Looking for a challenging 6-month end-of-studies internship (PFE) starting February 2027 in Morocco or internationally.",
                location="Marrakech, Morocco (Open to Morocco & International Relocation)",
                email="",  # Left empty per user requirement; will remain hidden on public site until filled in admin
                phone="",  # Left empty per user requirement; will remain hidden on public site until filled in admin
                github_url="https://github.com/Wiameelhernoussi",
                linkedin_url="https://www.linkedin.com/in/wiameelhernoussi/",
                cv_url="",  # Placeholder for uploaded CV PDF
                avatar_url="assets/profile.png",  # Preserved path; frontend falls back to placeholder if missing
                key_figures=[
                    {"label": "Intent Accuracy", "value": "97.30%", "sub": "5-fold cross-validation on 148 examples"},
                    {"label": "Dataset Indexed", "value": "3,000+", "sub": "hotel documents for RAG semantic search"},
                    {"label": "Inference Latency", "value": "2.0 ms", "sub": "YOLOv11s defect detection per image"},
                    {"label": "Transactions Processed", "value": "96,000+", "sub": "ETL warehouse with 7 Talend jobs"}
                ],
                languages=[
                    {"language": "Arabic", "level": "Native"},
                    {"language": "French", "level": "Fluent"},
                    {"language": "English", "level": "Advanced"}
                ],
                interests=["Basketball", "Strength training", "Reading"],
                social_links={
                    "linkedin": "https://www.linkedin.com/in/wiameelhernoussi/",
                    "github": "https://github.com/Wiameelhernoussi"
                }
            )
            db.add(profile)
            print("Created profile data.")
        else:
            print("Profile data already exists.")

        # 3. Site Settings
        setting = db.query(SiteSetting).first()
        if not setting:
            setting = SiteSetting(
                site_title="Wiame El Hernoussi – Data & AI Engineer",
                meta_description="Portfolio of Wiame El Hernoussi, final-year Data & AI Engineering student at EMSI Marrakech looking for an end-of-studies internship from February 2027 in Morocco or abroad.",
                keywords="Wiame El Hernoussi, Data Engineer, AI Engineer, Machine Learning, Deep Learning, LLM Agents, RAG, YOLO, Computer Vision, FastAPI, React, EMSI Marrakech",
                og_image_url="/og-preview.png",
                accent_color="#E9A21F",
                primary_color="#2B3FA3",
                section_visibility={
                    "hero": True,
                    "about": True,
                    "projects": True,
                    "experience": True,
                    "skills": True,
                    "certificates": True,
                    "education": True,
                    "interests": True,
                    "contact": True
                }
            )
            db.add(setting)
            print("Created site settings.")
        else:
            print("Site settings already exist.")

        # 4. Projects (All 8 Authentic Projects)
        if db.query(Project).count() == 0:
            projects_data = [
                {
                    "title": "Royal Mansour Virtual Concierge",
                    "slug": "royal-mansour-virtual-concierge",
                    "category": "Generative AI & LLM Agents",
                    "short_description": "Multilingual omnichannel assistant on the hotel website and WhatsApp with autonomous agents for FAQ, RAG, recommendations, and reservations.",
                    "long_description": """### Overview
Developed during an end-of-studies internship at the prestigious Royal Mansour Marrakech luxury hotel. Built an omnichannel, autonomous concierge assistant deployed on both the official hotel portal and WhatsApp to deliver bespoke guest experiences across three languages (French, English, and Arabic).

### Key Architectural Highlights & Impact
* **Autonomous Multi-Agent Orchestration**: Designed a central intent and language orchestrator that dynamically routes queries to specialized agents (FAQ, vector-powered RAG, personalized recommendations, and table/stay reservations).
* **High-Precision Intent Classification**: Attained **97.30% intent classification accuracy** evaluated via rigorous 5-fold cross-validation on 148 domain-specific conversation examples.
* **Semantic RAG Engine & Tool Calling**: Indexed more than **3,000 hotel policy, dining, and spa documents** into ChromaDB, leveraging Groq LLM inference, FastAPI microservices, and automated two-way synchronization with Google Calendar for confirmed reservations.""",
                    "technologies": ["LLM Agents", "RAG", "ChromaDB", "FastAPI", "PostgreSQL", "Docker", "Groq", "Google Calendar API"],
                    "start_date": "Jul 2026",
                    "end_date": "Sep 2026",
                    "status": "Completed",
                    "is_featured": True,
                    "cover_image": "/projects/royal-mansour.jpg",
                    "gallery_images": [],
                    "metrics": [
                        {"label": "Intent Accuracy", "value": "97.30%"},
                        {"label": "Languages", "value": "3 (FR, EN, AR)"},
                        {"label": "Documents Indexed", "value": "3,000+"}
                    ],
                    "links": {
                        "github": "",
                        "demo": "",
                        "video": "",
                        "pdf": ""
                    },
                    "order_index": 1,
                    "is_published": True
                },
                {
                    "title": "SmartPark: Intelligent Parking Platform",
                    "slug": "smartpark-ai",
                    "category": "Computer Vision & Deep Learning",
                    "short_description": "Smart parking platform combining YOLOv8 real-time bay occupancy detection with LSTM forecasting, Active Learning, and explainable AI.",
                    "long_description": """### Overview
SmartPark is an end-to-end intelligent parking management and forecasting system. It transforms raw video streams into live occupancy telemetry, predictive capacity forecasts, and intuitive driver navigation.

### Key Architectural Highlights & Impact
* **Vision & Temporal Forecasting Fusion**: Fine-tuned **YOLOv8** for real-time bay occupancy detection paired with an **LSTM neural network** to accurately forecast lot saturation up to several hours in advance.
* **Explainable AI & Active Learning Loop**: Integrated **Grad-CAM** and **SHAP** to visually explain detection boundaries and identify false positives under adverse lighting conditions, triggering an Active Learning loop for continuous retraining.
* **Full-Stack PWA Architecture**: Built a high-throughput **FastAPI** backend with **PostgreSQL**, consumed by an offline-ready **React Progressive Web App (PWA)** for drivers and lot administrators.""",
                    "technologies": ["YOLOv8", "LSTM", "FastAPI", "PostgreSQL", "React PWA", "Grad-CAM", "SHAP", "Active Learning"],
                    "start_date": "Feb 2026",
                    "end_date": "May 2026",
                    "status": "Completed",
                    "is_featured": False,
                    "cover_image": "/projects/smartpark.jpg",
                    "gallery_images": [],
                    "metrics": [
                        {"label": "Model", "value": "YOLOv8 + LSTM"},
                        {"label": "Explainability", "value": "Grad-CAM & SHAP"},
                        {"label": "Interface", "value": "React PWA"}
                    ],
                    "links": {
                        "github": "https://github.com/Wiameelhernoussi/smartparkAI",
                        "demo": "",
                        "video": "",
                        "pdf": ""
                    },
                    "order_index": 2,
                    "is_published": True
                },
                {
                    "title": "Defect Detection with Autonomous Drones",
                    "slug": "defect-detection-autonomous-drones",
                    "category": "Computer Vision & Edge AI",
                    "short_description": "Comparative study and deployment of Vision-Language Models (VLMs) and fine-tuned YOLOv11s for real-time structural defect inspection.",
                    "long_description": """### Overview
A collaborative engineering initiative evaluating modern computer vision paradigms for real-time, onboard structural defect identification using autonomous inspection drones.

### Key Architectural Highlights & Impact
* **Multi-Paradigm Comparative Benchmark**: Systematically evaluated zero-shot Vision-Language Models (VLMs), VLM with Retrieval-Augmented Generation, and an optimized, fine-tuned **YOLOv11s** model.
* **Unified Architectural Dataset**: Curated and annotated a unified benchmark dataset of **16,580 high-resolution images** spanning modern reinforced concrete and historical Spanish adobe brick structures.
* **Edge-Ready Performance**: Achieved **86.1% mAP50** with an ultra-low inference latency of **2.0 ms per frame**, proving operational feasibility for real-time onboard drone processors.""",
                    "technologies": ["YOLOv11", "Vision-Language Models", "RAG", "Computer Vision", "PyTorch", "Edge AI"],
                    "start_date": "Ongoing",
                    "end_date": "2026",
                    "status": "Ongoing",
                    "is_featured": False,
                    "cover_image": "/projects/drones.jpg",
                    "gallery_images": [],
                    "metrics": [
                        {"label": "mAP50 Score", "value": "86.1%"},
                        {"label": "Inference Speed", "value": "2.0 ms / frame"},
                        {"label": "Dataset Size", "value": "16,580 images"}
                    ],
                    "links": {
                        "github": "",
                        "demo": "",
                        "video": "",
                        "pdf": ""
                    },
                    "order_index": 3,
                    "is_published": True
                },
                {
                    "title": "Customer Loyalty Analytics & Data Warehouse",
                    "slug": "customer-loyalty-analytics",
                    "category": "Data Engineering & Analytics",
                    "short_description": "End-to-end data warehousing pipeline integrating 96,000+ Brazilian e-commerce transactions into a PostgreSQL star schema with Power BI DAX dashboards.",
                    "long_description": """### Overview
Built an enterprise-grade data warehouse and analytical reporting platform on the Olist Brazilian e-commerce public dataset to model customer lifecycle value, retention dynamics, and satisfaction drivers.

### Key Architectural Highlights & Impact
* **Robust Talend ETL Orchestration**: Cleaned, transformed, and loaded over **96,000 transactions** across 6 disparate relational sources using **7 automated Talend ETL jobs**.
* **Star Schema with SCD Type 2**: Architected a PostgreSQL dimensional model with 1 central fact table and 5 dimension tables, implementing **Slowly Changing Dimensions (SCD2)** to track historical customer loyalty tier transitions over time.
* **Actionable Power BI Dashboard**: Developed sophisticated DAX measures revealing an average basket size of **137.04 BRL**, average repurchase intervals of **~112 days**, and overall customer rating of **4.16 / 5**.""",
                    "technologies": ["Talend ETL", "PostgreSQL", "Data Warehousing", "Star Schema", "SCD2", "Power BI", "DAX"],
                    "start_date": "Apr 2026",
                    "end_date": "May 2026",
                    "status": "Completed",
                    "is_featured": False,
                    "cover_image": "/projects/loyalty.jpg",
                    "gallery_images": [],
                    "metrics": [
                        {"label": "Volume", "value": "96,000+ records"},
                        {"label": "ETL Jobs", "value": "7 Talend pipelines"},
                        {"label": "Avg Basket", "value": "137.04 BRL"}
                    ],
                    "links": {
                        "github": "",
                        "demo": "",
                        "video": "",
                        "pdf": ""
                    },
                    "order_index": 4,
                    "is_published": True
                },
                {
                    "title": "Federated Learning for Hotel Booking Cancellation",
                    "slug": "federated-learning-hotel-cancellations",
                    "category": "Distributed AI & Privacy",
                    "short_description": "Decentralized predictive modelling using FedAvg and FedProx with differential privacy guarantees to forecast booking cancellations without centralizing guest records.",
                    "long_description": """### Overview
Designed a privacy-preserving federated machine learning architecture that enables competing hotel networks to collaboratively train a high-accuracy cancellation prediction model without exposing sensitive customer reservation records.

### Key Architectural Highlights & Impact
* **Federated Optimization Algorithms**: Implemented and benchmarked **FedAvg** and **FedProx** optimization algorithms to handle statistical heterogeneity across disparate distributed hotel nodes.
* **Rigorous Differential Privacy**: Integrated mathematical **differential privacy (DP)** noise mechanisms to provably bound data leakage and protect individual guest identities from model inversion attacks.
* **High Predictive Fidelity**: Maintained competitive predictive accuracy comparable to a centralized baseline model while keeping 100% of raw tabular data strictly within local silos.""",
                    "technologies": ["Federated Learning", "FedAvg", "FedProx", "Differential Privacy", "PyTorch", "Python"],
                    "start_date": "Apr 2026",
                    "end_date": "May 2026",
                    "status": "Completed",
                    "is_featured": False,
                    "cover_image": "/projects/federated.jpg",
                    "gallery_images": [],
                    "metrics": [
                        {"label": "Algorithms", "value": "FedAvg & FedProx"},
                        {"label": "Privacy", "value": "Differential Privacy"},
                        {"label": "Data Locality", "value": "100% Decentralized"}
                    ],
                    "links": {
                        "github": "",
                        "demo": "",
                        "video": "",
                        "pdf": ""
                    },
                    "order_index": 5,
                    "is_published": True
                },
                {
                    "title": "Machine Learning Job Recommendation System",
                    "slug": "job-recommendation-ml",
                    "category": "AI & Machine Learning",
                    "short_description": "Candidate-to-opportunity matching engine using unsupervised clustering and supervised classification with scikit-learn.",
                    "long_description": """### Overview
Engineered an intelligent recommendation system that bridges technical job opportunities with candidate profile skills through semantic preprocessing, dimensional clustering, and classification.

### Key Architectural Highlights & Impact
* **Advanced Feature Engineering**: Cleaned and vectorized unstructured job descriptions, skills matrices, and candidate profiles using TF-IDF and dense embeddings with **scikit-learn**, **Pandas**, and **NumPy**.
* **Clustering & Classification Synergy**: Blended unsupervised clustering algorithms with supervised classifiers to generate personalized rank-ordered opportunity recommendations with explainable similarity metrics.""",
                    "technologies": ["scikit-learn", "Pandas", "NumPy", "NLP Vectorization", "Classification", "Python"],
                    "start_date": "2025",
                    "end_date": "2026",
                    "status": "Completed",
                    "is_featured": False,
                    "cover_image": "/projects/job-rec.jpg",
                    "gallery_images": [],
                    "metrics": [
                        {"label": "Stack", "value": "scikit-learn, Pandas"},
                        {"label": "Task", "value": "Matching & Ranking"}
                    ],
                    "links": {
                        "github": "",
                        "demo": "",
                        "video": "",
                        "pdf": ""
                    },
                    "order_index": 6,
                    "is_published": True
                },
                {
                    "title": "Statistical & Predictive Analysis of Breast Cancer",
                    "slug": "breast-cancer-statistical-analysis",
                    "category": "Data Science & Biostatistics",
                    "short_description": "Univariate, bivariate, and multivariate analysis of the Wisconsin diagnostic dataset with predictive clinical classification in Python and R.",
                    "long_description": """### Overview
An in-depth statistical investigation and predictive modeling workflow conducted on the benchmark Wisconsin Diagnostic Breast Cancer dataset to discover significant diagnostic biomarkers.

### Key Architectural Highlights & Impact
* **Rigorous Multivariate Biostatistics**: Performed principal component analysis (PCA), correlation matrices, and distribution tests using **Python**, **R**, and **Seaborn** to isolate features that reliably distinguish malignant from benign cellular biopsies.
* **Supervised Clinical Classifiers**: Trained and cross-validated statistical classification models yielding high sensitivity and specificity metrics crucial for diagnostic decision-support tools.""",
                    "technologies": ["Python", "R", "Seaborn", "PCA", "Statistical Modeling", "Biostatistics"],
                    "start_date": "2025",
                    "end_date": "2025",
                    "status": "Completed",
                    "is_featured": False,
                    "cover_image": "/projects/cancer-analysis.jpg",
                    "gallery_images": [],
                    "metrics": [
                        {"label": "Dataset", "value": "Wisconsin Diagnostic"},
                        {"label": "Tools", "value": "Python, R, Seaborn"}
                    ],
                    "links": {
                        "github": "",
                        "demo": "",
                        "video": "",
                        "pdf": ""
                    },
                    "order_index": 7,
                    "is_published": True
                },
                {
                    "title": "School Enrolment Mobile App with Verification",
                    "slug": "school-enrolment-mobile-app",
                    "category": "Software Engineering & Mobile",
                    "short_description": "Android mobile application with Laravel backend for student registration, authentication, and administrative verification of baccalauréat and identity documents.",
                    "long_description": """### Overview
A full-stack mobile solution developed to streamline student academic enrollment, eliminate physical paper queues, and securely verify legal student documents.

### Key Architectural Highlights & Impact
* **Native Android Client**: Crafted an intuitive native Android user interface with **Java and XML**, offering smooth onboarding, camera document scanning, and profile management.
* **Secure Backend Verification Workflow**: Integrated a **Laravel** REST API and **SQLite** database enabling school administrators to review submitted baccalauréat diplomas and national identity documents with instant status updates.""",
                    "technologies": ["Java", "Android XML", "Laravel", "REST API", "SQLite", "Mobile Security"],
                    "start_date": "2024",
                    "end_date": "2025",
                    "status": "Completed",
                    "is_featured": False,
                    "cover_image": "/projects/school-app.jpg",
                    "gallery_images": [],
                    "metrics": [
                        {"label": "Client", "value": "Native Android Java"},
                        {"label": "Backend", "value": "Laravel & SQLite"}
                    ],
                    "links": {
                        "github": "",
                        "demo": "",
                        "video": "",
                        "pdf": ""
                    },
                    "order_index": 8,
                    "is_published": True
                }
            ]

            for p_data in projects_data:
                db.add(Project(**p_data))
            print(f"Seeded {len(projects_data)} projects.")
        else:
            print("Projects already exist.")

        # 5. Experience
        if db.query(Experience).count() == 0:
            experiences_data = [
                {
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
                    "technologies": ["LLM Agents", "RAG", "ChromaDB", "FastAPI", "PostgreSQL", "Docker", "UML", "Agile/Scrum"],
                    "order_index": 1
                },
                {
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
                    "technologies": ["NLP", "Rasa", "PyTorch", "scikit-learn", "Python"],
                    "order_index": 2
                }
            ]
            for exp_data in experiences_data:
                db.add(Experience(**exp_data))
            print(f"Seeded {len(experiences_data)} experiences.")
        else:
            print("Experience entries already exist.")

        # 6. Education
        if db.query(Education).count() == 0:
            education_data = [
                {
                    "degree": "Engineering Degree in Computer & Network Engineering (AI / Data Track)",
                    "institution": "EMSI Marrakech (École Marocaine des Sciences de l'Ingénieur)",
                    "location": "Marrakech, Morocco",
                    "start_date": "Oct 2024",
                    "end_date": "Present (Graduating 2027)",
                    "description": "Specializing in artificial intelligence, deep learning architectures, big data engineering, distributed systems, and modern software development.",
                    "order_index": 1
                },
                {
                    "degree": "Classes Préparatoires aux Grandes Écoles (CPGE) – Mathematics & Physics (MP)",
                    "institution": "Lycée Ibn Taymia",
                    "location": "Marrakech, Morocco",
                    "start_date": "2021",
                    "end_date": "2023",
                    "description": "Intensive two-year advanced curriculum in higher mathematics, theoretical physics, algorithmic computer science, and engineering fundamentals.",
                    "order_index": 2
                },
                {
                    "degree": "Baccalauréat in Mathematical Sciences A",
                    "institution": "Lycée Mohammed V",
                    "location": "Essaouira, Morocco",
                    "start_date": "2020",
                    "end_date": "2021",
                    "description": "Graduated with honors in Mathematical Sciences.",
                    "order_index": 3
                }
            ]
            for edu_data in education_data:
                db.add(Education(**edu_data))
            print(f"Seeded {len(education_data)} education entries.")
        else:
            print("Education entries already exist.")

        # 7. Skills
        if db.query(Skill).count() == 0:
            skills_data = [
                # AI and Machine Learning
                {"name": "PyTorch", "category": "AI & Machine Learning", "level": 90, "order_index": 1},
                {"name": "scikit-learn", "category": "AI & Machine Learning", "level": 92, "order_index": 2},
                {"name": "YOLO (v8, v11)", "category": "AI & Machine Learning", "level": 92, "order_index": 3},
                {"name": "LSTM & Recurrent Nets", "category": "AI & Machine Learning", "level": 85, "order_index": 4},
                {"name": "LLM Agents & Multi-Agent Systems", "category": "AI & Machine Learning", "level": 92, "order_index": 5},
                {"name": "Retrieval-Augmented Generation (RAG)", "category": "AI & Machine Learning", "level": 90, "order_index": 6},
                {"name": "Rasa Conversational AI", "category": "AI & Machine Learning", "level": 82, "order_index": 7},
                {"name": "Federated Learning (FedAvg, FedProx)", "category": "AI & Machine Learning", "level": 85, "order_index": 8},
                {"name": "Explainable AI (Grad-CAM, SHAP)", "category": "AI & Machine Learning", "level": 88, "order_index": 9},

                # Data
                {"name": "SQL & Relational Modeling", "category": "Data", "level": 94, "order_index": 10},
                {"name": "Talend ETL", "category": "Data", "level": 88, "order_index": 11},
                {"name": "Data Warehousing (Star Schema, SCD2)", "category": "Data", "level": 88, "order_index": 12},
                {"name": "Power BI & DAX", "category": "Data", "level": 86, "order_index": 13},
                {"name": "Pandas & NumPy", "category": "Data", "level": 95, "order_index": 14},
                {"name": "R / RStudio", "category": "Data", "level": 80, "order_index": 15},
                {"name": "Jupyter Notebooks", "category": "Data", "level": 95, "order_index": 16},

                # Engineering
                {"name": "FastAPI", "category": "Engineering", "level": 92, "order_index": 17},
                {"name": "React & TypeScript", "category": "Engineering", "level": 85, "order_index": 18},
                {"name": "Docker & Containerization", "category": "Engineering", "level": 88, "order_index": 19},
                {"name": "Git & GitHub Workflow", "category": "Engineering", "level": 92, "order_index": 20},
                {"name": "Linux / Bash", "category": "Engineering", "level": 86, "order_index": 21},
                {"name": "VMware ESXi", "category": "Engineering", "level": 78, "order_index": 22},

                # Languages & Databases
                {"name": "Python", "category": "Languages & Databases", "level": 95, "order_index": 23},
                {"name": "PostgreSQL", "category": "Languages & Databases", "level": 92, "order_index": 24},
                {"name": "Java", "category": "Languages & Databases", "level": 82, "order_index": 25},
                {"name": "C++", "category": "Languages & Databases", "level": 80, "order_index": 26},
                {"name": "C#", "category": "Languages & Databases", "level": 75, "order_index": 27},
                {"name": "PL/SQL", "category": "Languages & Databases", "level": 85, "order_index": 28},
                {"name": "Oracle", "category": "Languages & Databases", "level": 80, "order_index": 29},
                {"name": "MySQL", "category": "Languages & Databases", "level": 88, "order_index": 30},
                {"name": "SQL Server", "category": "Languages & Databases", "level": 82, "order_index": 31},
                {"name": "MongoDB", "category": "Languages & Databases", "level": 80, "order_index": 32}
            ]
            for s_data in skills_data:
                db.add(Skill(**s_data))
            print(f"Seeded {len(skills_data)} skills.")
        else:
            print("Skills already exist.")

        # 8. Certificates (Coursera: Machine Learning, Python, Cloud Computing, Big Data)
        # Seeded WITHOUT links and marked HIDDEN (is_visible=False) per rule #3
        if db.query(Certificate).count() == 0:
            cert_titles = [
                "Machine Learning",
                "Python",
                "Cloud Computing",
                "Big Data"
            ]
            for idx, title in enumerate(cert_titles, start=1):
                db.add(Certificate(
                    title=title,
                    issuer="Coursera",
                    issue_date="",
                    image_url="",
                    pdf_url="",
                    verification_url="",
                    order_index=idx,
                    is_visible=False  # Hidden until user adds image/verification in admin
                ))
            print(f"Seeded {len(cert_titles)} Coursera certificates as hidden placeholders.")
        else:
            print("Certificates already exist.")

        db.commit()
        print("Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
