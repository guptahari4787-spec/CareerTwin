import json
from database import SessionLocal, engine, Base
from models import User, StudentProfile, Skill, UserSkill, Career, CareerSkill, Course, Certification, ProjectTemplate, Resume

# Master skill taxonomy (60+ normalized skills)
SKILLS_TAXONOMY = [
    # Programming Languages
    {"id": "python", "name": "Python", "category": "Languages", "aliases": ["python3", "py"]},
    {"id": "java", "name": "Java", "category": "Languages", "aliases": ["core java", "java8"]},
    {"id": "cpp", "name": "C++", "category": "Languages", "aliases": ["cpp", "c plus plus"]},
    {"id": "javascript", "name": "JavaScript", "category": "Languages", "aliases": ["js", "es6"]},
    {"id": "typescript", "name": "TypeScript", "category": "Languages", "aliases": ["ts"]},
    {"id": "sql", "name": "SQL", "category": "Languages", "aliases": ["structured query language", "relational database"]},
    {"id": "bash", "name": "Bash/Shell", "category": "Languages", "aliases": ["shell scripting", "bash script"]},
    
    # Frontend
    {"id": "html", "name": "HTML5", "category": "Frontend", "aliases": ["html"]},
    {"id": "css", "name": "CSS3", "category": "Frontend", "aliases": ["css", "styling"]},
    {"id": "react", "name": "React", "category": "Frontend", "aliases": ["reactjs", "react.js"]},
    {"id": "nextjs", "name": "Next.js", "category": "Frontend", "aliases": ["next.js", "next"]},
    {"id": "tailwind", "name": "Tailwind CSS", "category": "Frontend", "aliases": ["tailwindcss"]},
    {"id": "responsive-design", "name": "Responsive Web Design", "category": "Frontend", "aliases": ["mobile friendly"]},
    
    # Backend & Architecture
    {"id": "nodejs", "name": "Node.js", "category": "Backend", "aliases": ["node", "nodejs"]},
    {"id": "express", "name": "Express.js", "category": "Backend", "aliases": ["express"]},
    {"id": "fastapi", "name": "FastAPI", "category": "Backend", "aliases": ["fastapi python"]},
    {"id": "rest-apis", "name": "REST APIs", "category": "Backend", "aliases": ["restful api", "rest"]},
    {"id": "graphql", "name": "GraphQL", "category": "Backend", "aliases": ["gql"]},
    {"id": "system-design", "name": "System Design", "category": "Backend", "aliases": ["high level design", "architecture"]},
    {"id": "distributed-systems", "name": "Distributed Systems", "category": "Backend", "aliases": ["concurrency", "fault tolerance"]},
    {"id": "microservices", "name": "Microservices", "category": "Backend", "aliases": ["microservice architecture"]},
    
    # Databases & Storage
    {"id": "postgresql", "name": "PostgreSQL", "category": "Databases", "aliases": ["postgres", "psql"]},
    {"id": "mongodb", "name": "MongoDB", "category": "Databases", "aliases": ["mongo", "nosql"]},
    {"id": "redis", "name": "Redis", "category": "Databases", "aliases": ["redis cache"]},
    
    # Cloud & Infrastructure
    {"id": "aws", "name": "AWS", "category": "Cloud", "aliases": ["amazon web services", "aws cloud", "ec2", "s3", "lambda"]},
    {"id": "azure", "name": "Microsoft Azure", "category": "Cloud", "aliases": ["azure", "azure cloud"]},
    {"id": "gcp", "name": "Google Cloud Platform", "category": "Cloud", "aliases": ["gcp", "google cloud"]},
    {"id": "cloud-computing", "name": "Cloud Computing", "category": "Cloud", "aliases": ["cloud fundamentals"]},
    {"id": "serverless", "name": "Serverless Architecture", "category": "Cloud", "aliases": ["aws lambda", "cloud functions"]},
    {"id": "networking", "name": "Computer Networking", "category": "Cloud", "aliases": ["tcp/ip", "vpc", "dns", "subnets"]},
    
    # DevOps & Containers
    {"id": "docker", "name": "Docker", "category": "DevOps", "aliases": ["containerization", "containers", "dockerfile"]},
    {"id": "kubernetes", "name": "Kubernetes", "category": "DevOps", "aliases": ["k8s", "kubectl", "orchestration"]},
    {"id": "terraform", "name": "Terraform", "category": "DevOps", "aliases": ["iac", "infrastructure as code"]},
    {"id": "cicd", "name": "CI/CD", "category": "DevOps", "aliases": ["continuous integration", "continuous deployment"]},
    {"id": "github-actions", "name": "GitHub Actions", "category": "DevOps", "aliases": ["actions", "ci pipeline"]},
    {"id": "linux", "name": "Linux", "category": "DevOps", "aliases": ["ubuntu", "unix", "posix"]},
    {"id": "git", "name": "Git & Version Control", "category": "DevOps", "aliases": ["git", "github", "version control"]},
    {"id": "monitoring", "name": "Monitoring & Logging", "category": "DevOps", "aliases": ["prometheus", "grafana", "cloudwatch"]},
    
    # Data & AI/ML
    {"id": "data-structures", "name": "Data Structures & Algorithms", "category": "Core CS", "aliases": ["dsa", "algorithms", "problem solving"]},
    {"id": "machine-learning", "name": "Machine Learning", "category": "AI/ML", "aliases": ["ml", "scikit-learn"]},
    {"id": "deep-learning", "name": "Deep Learning", "category": "AI/ML", "aliases": ["neural networks", "cnn", "transformer"]},
    {"id": "nlp", "name": "Natural Language Processing", "category": "AI/ML", "aliases": ["nlp", "text mining", "llm"]},
    {"id": "pytorch", "name": "PyTorch", "category": "AI/ML", "aliases": ["torch"]},
    {"id": "tensorflow", "name": "TensorFlow", "category": "AI/ML", "aliases": ["tf", "keras"]},
    {"id": "pandas", "name": "Pandas", "category": "Data", "aliases": ["pandas python"]},
    {"id": "numpy", "name": "NumPy", "category": "Data", "aliases": ["numpy array"]},
    {"id": "data-analysis", "name": "Data Analysis", "category": "Data", "aliases": ["eda", "exploratory data analysis"]},
    {"id": "tableau", "name": "Tableau / BI", "category": "Data", "aliases": ["power bi", "data visualization"]},
    {"id": "data-pipelines", "name": "ETL & Data Pipelines", "category": "Data", "aliases": ["etl", "data engineering"]},
    
    # Security
    {"id": "cybersecurity", "name": "Cybersecurity Fundamentals", "category": "Security", "aliases": ["infosec", "security"]},
    {"id": "auth-security", "name": "Authentication & JWT", "category": "Security", "aliases": ["oauth2", "jwt", "rbac"]},
    {"id": "vulnerability-analysis", "name": "Vulnerability Assessment", "category": "Security", "aliases": ["penetration testing", "owasp"]}
]

# 10 Defined Careers
CAREERS = [
    {
        "id": "cloud-engineer",
        "title": "Cloud Engineer",
        "category": "Cloud & Infrastructure",
        "overview": "Designs, implements, and maintains scalable cloud systems and infrastructure across modern providers like AWS and Azure.",
        "market_demand": "High",
        "average_salary": "$125,000",
        "skills": [
            {"skill_id": "aws", "importance": "Critical", "expected_level": "Intermediate", "weight": 2.0},
            {"skill_id": "linux", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.8},
            {"skill_id": "docker", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.6},
            {"skill_id": "networking", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.6},
            {"skill_id": "terraform", "importance": "High", "expected_level": "Intermediate", "weight": 1.5},
            {"skill_id": "kubernetes", "importance": "High", "expected_level": "Beginner", "weight": 1.4},
            {"skill_id": "python", "importance": "High", "expected_level": "Intermediate", "weight": 1.3},
            {"skill_id": "bash", "importance": "High", "expected_level": "Intermediate", "weight": 1.2},
            {"skill_id": "git", "importance": "High", "expected_level": "Intermediate", "weight": 1.0},
            {"skill_id": "cicd", "importance": "Medium", "expected_level": "Beginner", "weight": 1.0},
            {"skill_id": "system-design", "importance": "Medium", "expected_level": "Beginner", "weight": 0.9}
        ]
    },
    {
        "id": "devops-engineer",
        "title": "DevOps Engineer",
        "category": "Cloud & Operations",
        "overview": "Bridges software engineering and system operations by building continuous delivery pipelines and automated infrastructure.",
        "market_demand": "Very High",
        "average_salary": "$130,000",
        "skills": [
            {"skill_id": "linux", "importance": "Critical", "expected_level": "Mastered", "weight": 2.0},
            {"skill_id": "docker", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.9},
            {"skill_id": "kubernetes", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.8},
            {"skill_id": "cicd", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.8},
            {"skill_id": "terraform", "importance": "High", "expected_level": "Intermediate", "weight": 1.6},
            {"skill_id": "aws", "importance": "High", "expected_level": "Intermediate", "weight": 1.5},
            {"skill_id": "git", "importance": "High", "expected_level": "Intermediate", "weight": 1.3},
            {"skill_id": "bash", "importance": "High", "expected_level": "Intermediate", "weight": 1.2},
            {"skill_id": "monitoring", "importance": "Medium", "expected_level": "Beginner", "weight": 1.0},
            {"skill_id": "python", "importance": "Medium", "expected_level": "Intermediate", "weight": 0.9}
        ]
    },
    {
        "id": "software-engineer",
        "title": "Software Engineer",
        "category": "Core Engineering",
        "overview": "Solves complex computational problems by building reliable, maintainable, and high-performance software applications.",
        "market_demand": "High",
        "average_salary": "$115,000",
        "skills": [
            {"skill_id": "data-structures", "importance": "Critical", "expected_level": "Mastered", "weight": 2.0},
            {"skill_id": "python", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.8},
            {"skill_id": "java", "importance": "High", "expected_level": "Intermediate", "weight": 1.6},
            {"skill_id": "sql", "importance": "High", "expected_level": "Intermediate", "weight": 1.4},
            {"skill_id": "git", "importance": "High", "expected_level": "Intermediate", "weight": 1.3},
            {"skill_id": "rest-apis", "importance": "High", "expected_level": "Intermediate", "weight": 1.2},
            {"skill_id": "system-design", "importance": "High", "expected_level": "Beginner", "weight": 1.2},
            {"skill_id": "docker", "importance": "Medium", "expected_level": "Beginner", "weight": 0.8}
        ]
    },
    {
        "id": "fullstack-developer",
        "title": "Full Stack Developer",
        "category": "Web Engineering",
        "overview": "Builds end-to-end web applications covering user interfaces, server logic, database design, and cloud deployments.",
        "market_demand": "Very High",
        "average_salary": "$110,000",
        "skills": [
            {"skill_id": "react", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.9},
            {"skill_id": "javascript", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.8},
            {"skill_id": "typescript", "importance": "High", "expected_level": "Intermediate", "weight": 1.6},
            {"skill_id": "nodejs", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.7},
            {"skill_id": "sql", "importance": "High", "expected_level": "Intermediate", "weight": 1.4},
            {"skill_id": "postgresql", "importance": "High", "expected_level": "Intermediate", "weight": 1.3},
            {"skill_id": "html", "importance": "High", "expected_level": "Intermediate", "weight": 1.0},
            {"skill_id": "css", "importance": "High", "expected_level": "Intermediate", "weight": 1.0},
            {"skill_id": "git", "importance": "High", "expected_level": "Intermediate", "weight": 1.0},
            {"skill_id": "docker", "importance": "Medium", "expected_level": "Beginner", "weight": 0.8}
        ]
    },
    {
        "id": "frontend-developer",
        "title": "Frontend Developer",
        "category": "Web Engineering",
        "overview": "Specializes in crafting responsive, accessible, and high-performance client-side interfaces using modern frameworks.",
        "market_demand": "High",
        "average_salary": "$105,000",
        "skills": [
            {"skill_id": "react", "importance": "Critical", "expected_level": "Mastered", "weight": 2.0},
            {"skill_id": "javascript", "importance": "Critical", "expected_level": "Mastered", "weight": 2.0},
            {"skill_id": "typescript", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.8},
            {"skill_id": "html", "importance": "Critical", "expected_level": "Mastered", "weight": 1.5},
            {"skill_id": "css", "importance": "Critical", "expected_level": "Mastered", "weight": 1.5},
            {"skill_id": "tailwind", "importance": "High", "expected_level": "Intermediate", "weight": 1.2},
            {"skill_id": "responsive-design", "importance": "Critical", "expected_level": "Mastered", "weight": 1.4},
            {"skill_id": "nextjs", "importance": "High", "expected_level": "Intermediate", "weight": 1.3},
            {"skill_id": "git", "importance": "High", "expected_level": "Intermediate", "weight": 1.0}
        ]
    },
    {
        "id": "backend-developer",
        "title": "Backend Developer",
        "category": "Web Engineering",
        "overview": "Focuses on server architecture, database modeling, authentication systems, and API scalability.",
        "market_demand": "High",
        "average_salary": "$118,000",
        "skills": [
            {"skill_id": "python", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.8},
            {"skill_id": "nodejs", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.8},
            {"skill_id": "sql", "importance": "Critical", "expected_level": "Mastered", "weight": 1.9},
            {"skill_id": "postgresql", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.7},
            {"skill_id": "rest-apis", "importance": "Critical", "expected_level": "Mastered", "weight": 1.8},
            {"skill_id": "redis", "importance": "High", "expected_level": "Intermediate", "weight": 1.3},
            {"skill_id": "system-design", "importance": "High", "expected_level": "Intermediate", "weight": 1.5},
            {"skill_id": "git", "importance": "High", "expected_level": "Intermediate", "weight": 1.0},
            {"skill_id": "docker", "importance": "High", "expected_level": "Intermediate", "weight": 1.2}
        ]
    },
    {
        "id": "ai-ml-engineer",
        "title": "AI/ML Engineer",
        "category": "Data & AI",
        "overview": "Builds and deploys machine learning models, neural networks, and generative AI systems into production software.",
        "market_demand": "Very High",
        "average_salary": "$140,000",
        "skills": [
            {"skill_id": "python", "importance": "Critical", "expected_level": "Mastered", "weight": 2.0},
            {"skill_id": "machine-learning", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.9},
            {"skill_id": "pytorch", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.8},
            {"skill_id": "deep-learning", "importance": "High", "expected_level": "Intermediate", "weight": 1.7},
            {"skill_id": "pandas", "importance": "High", "expected_level": "Mastered", "weight": 1.5},
            {"skill_id": "numpy", "importance": "High", "expected_level": "Mastered", "weight": 1.5},
            {"skill_id": "nlp", "importance": "High", "expected_level": "Intermediate", "weight": 1.4},
            {"skill_id": "sql", "importance": "High", "expected_level": "Intermediate", "weight": 1.2},
            {"skill_id": "docker", "importance": "Medium", "expected_level": "Beginner", "weight": 1.0},
            {"skill_id": "git", "importance": "High", "expected_level": "Intermediate", "weight": 1.0}
        ]
    },
    {
        "id": "data-analyst",
        "title": "Data Analyst",
        "category": "Data & AI",
        "overview": "Extracts insights from structured data, performs statistical exploratory analysis, and creates business dashboards.",
        "market_demand": "Moderate",
        "average_salary": "$88,000",
        "skills": [
            {"skill_id": "sql", "importance": "Critical", "expected_level": "Mastered", "weight": 2.0},
            {"skill_id": "python", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.8},
            {"skill_id": "pandas", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.7},
            {"skill_id": "numpy", "importance": "High", "expected_level": "Intermediate", "weight": 1.4},
            {"skill_id": "data-analysis", "importance": "Critical", "expected_level": "Mastered", "weight": 1.8},
            {"skill_id": "tableau", "importance": "High", "expected_level": "Intermediate", "weight": 1.5},
            {"skill_id": "postgresql", "importance": "High", "expected_level": "Intermediate", "weight": 1.3},
            {"skill_id": "git", "importance": "Medium", "expected_level": "Beginner", "weight": 0.8}
        ]
    },
    {
        "id": "data-scientist",
        "title": "Data Scientist",
        "category": "Data & AI",
        "overview": "Applies statistical modeling, predictive algorithms, and experimental design to extract predictive intelligence.",
        "market_demand": "High",
        "average_salary": "$128,000",
        "skills": [
            {"skill_id": "python", "importance": "Critical", "expected_level": "Mastered", "weight": 2.0},
            {"skill_id": "machine-learning", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.8},
            {"skill_id": "data-analysis", "importance": "Critical", "expected_level": "Mastered", "weight": 1.8},
            {"skill_id": "sql", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.6},
            {"skill_id": "pandas", "importance": "Critical", "expected_level": "Mastered", "weight": 1.6},
            {"skill_id": "numpy", "importance": "High", "expected_level": "Mastered", "weight": 1.5},
            {"skill_id": "deep-learning", "importance": "Medium", "expected_level": "Beginner", "weight": 1.2},
            {"skill_id": "git", "importance": "High", "expected_level": "Intermediate", "weight": 1.0}
        ]
    },
    {
        "id": "cybersecurity-analyst",
        "title": "Cybersecurity Analyst",
        "category": "Security & Infrastructure",
        "overview": "Protects digital assets, monitors network traffic, responds to security incidents, and enforces vulnerability patch policies.",
        "market_demand": "Very High",
        "average_salary": "$112,000",
        "skills": [
            {"skill_id": "cybersecurity", "importance": "Critical", "expected_level": "Mastered", "weight": 2.0},
            {"skill_id": "networking", "importance": "Critical", "expected_level": "Mastered", "weight": 1.9},
            {"skill_id": "linux", "importance": "Critical", "expected_level": "Intermediate", "weight": 1.7},
            {"skill_id": "vulnerability-analysis", "importance": "High", "expected_level": "Intermediate", "weight": 1.6},
            {"skill_id": "bash", "importance": "High", "expected_level": "Intermediate", "weight": 1.3},
            {"skill_id": "python", "importance": "High", "expected_level": "Intermediate", "weight": 1.3},
            {"skill_id": "auth-security", "importance": "High", "expected_level": "Intermediate", "weight": 1.4},
            {"skill_id": "git", "importance": "Medium", "expected_level": "Beginner", "weight": 0.8}
        ]
    }
]

# 22 Structured Courses
COURSES = [
    {
        "id": "c-aws-fundamentals",
        "title": "AWS Cloud Practitioner Essentials",
        "provider": "Amazon Web Services (Coursera)",
        "level": "Beginner",
        "duration_hours": 16,
        "url": "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/",
        "description": "Comprehensive introduction to AWS fundamentals, compute, storage, VPC networking, security, and pricing.",
        "primary_skill": "aws",
        "skills": ["aws", "cloud-computing", "networking"]
    },
    {
        "id": "c-aws-solutions-architect",
        "title": "Ultimate AWS Certified Solutions Architect Associate",
        "provider": "Stephane Maarek (Udemy)",
        "level": "Intermediate",
        "duration_hours": 28,
        "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/",
        "description": "Deep-dive into multi-tier architectures, auto-scaling, VPC peering, IAM policies, and high-availability design.",
        "primary_skill": "aws",
        "skills": ["aws", "cloud-computing", "networking", "system-design"]
    },
    {
        "id": "c-azure-fundamentals",
        "title": "Microsoft Azure Fundamentals (AZ-900) Certification Prep",
        "provider": "Microsoft Learn",
        "level": "Beginner",
        "duration_hours": 12,
        "url": "https://learn.microsoft.com/en-us/training/courses/az-900t00",
        "description": "Core Azure cloud concepts, resource groups, virtual networks, blob storage, cloud security, and governance.",
        "primary_skill": "azure",
        "skills": ["azure", "cloud-computing"]
    },
    {
        "id": "c-docker-kubernetes",
        "title": "Docker and Kubernetes: The Complete Guide",
        "provider": "Stephen Grider (Udemy)",
        "level": "Intermediate",
        "duration_hours": 22,
        "url": "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
        "description": "Build, test, and deploy Docker container images. Orchestrate resilient clusters with Kubernetes pods, services, and ingress.",
        "primary_skill": "docker",
        "skills": ["docker", "kubernetes", "cicd"]
    },
    {
        "id": "c-kubernetes-hands-on",
        "title": "Kubernetes for Developers: Core Concepts and Deployments",
        "provider": "Linux Foundation",
        "level": "Intermediate",
        "duration_hours": 18,
        "url": "https://www.linuxfoundation.org/training",
        "description": "Deploying pods, services, ingress controllers, config maps, and persistent volumes in Kubernetes.",
        "primary_skill": "kubernetes",
        "skills": ["kubernetes", "docker"]
    },
    {
        "id": "c-terraform-aws",
        "title": "Terraform for AWS - Infrastructure as Code",
        "provider": "HashiCorp / Coursera",
        "level": "Intermediate",
        "duration_hours": 14,
        "url": "https://developer.hashicorp.com/terraform/tutorials",
        "description": "Automate repeatable cloud provisioning. Manage state locking, remote backends, and reusable infrastructure modules.",
        "primary_skill": "terraform",
        "skills": ["terraform", "aws", "cicd"]
    },
    {
        "id": "c-linux-mastery",
        "title": "Linux Administration Bootcamp: Go from Beginner to Advanced",
        "provider": "The Linux Foundation",
        "level": "Beginner to Intermediate",
        "duration_hours": 18,
        "url": "https://www.linuxfoundation.org/training",
        "description": "Master bash scripting, process management, user permissions, systemd services, and networking diagnostics.",
        "primary_skill": "linux",
        "skills": ["linux", "bash", "networking"]
    },
    {
        "id": "c-python-dsa",
        "title": "Data Structures and Algorithms in Python",
        "provider": "UC San Diego (Coursera)",
        "level": "Intermediate",
        "duration_hours": 36,
        "url": "https://www.coursera.org/specializations/data-structures-algorithms",
        "description": "Comprehensive algorithmic problem solving covering trees, graphs, dynamic programming, hashing, and sorting algorithms.",
        "primary_skill": "data-structures",
        "skills": ["python", "data-structures"]
    },
    {
        "id": "c-ml-specialization",
        "title": "Machine Learning Specialization",
        "provider": "DeepLearning.AI & Andrew Ng (Coursera)",
        "level": "Beginner to Intermediate",
        "duration_hours": 42,
        "url": "https://www.coursera.org/specializations/machine-learning-introduction",
        "description": "Foundational supervised and unsupervised learning, gradient descent, regularized regression, and neural networks.",
        "primary_skill": "machine-learning",
        "skills": ["machine-learning", "python", "numpy", "pandas"]
    },
    {
        "id": "c-deep-learning",
        "title": "Deep Learning with PyTorch: Zero to GANs",
        "provider": "freeCodeCamp / Jovian",
        "level": "Intermediate",
        "duration_hours": 24,
        "url": "https://jovian.ai/learn/deep-learning-with-pytorch-zero-to-gans",
        "description": "Build deep neural networks, CNNs, and sequence models using PyTorch tensors and GPU acceleration.",
        "primary_skill": "pytorch",
        "skills": ["pytorch", "deep-learning", "python"]
    },
    {
        "id": "c-sql-bootcamp",
        "title": "The Complete SQL Bootcamp: Go from Zero to Hero",
        "provider": "Jose Portilla (Udemy)",
        "level": "Beginner to Intermediate",
        "duration_hours": 12,
        "url": "https://www.udemy.com/course/the-complete-sql-bootcamp/",
        "description": "Group by, joins, subqueries, window functions, and schema normalization in PostgreSQL.",
        "primary_skill": "sql",
        "skills": ["sql", "postgresql"]
    },
    {
        "id": "c-react-complete",
        "title": "React - The Complete Guide (incl. Next.js & Redux)",
        "provider": "Maximilian Schwarzmüller (Udemy)",
        "level": "Intermediate",
        "duration_hours": 30,
        "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
        "description": "React hooks, state management, routing, server-side rendering with Next.js, and clean component patterns.",
        "primary_skill": "react",
        "skills": ["react", "javascript", "typescript", "nextjs"]
    },
    {
        "id": "c-networking-cs",
        "title": "Computer Networking: A Top-Down Approach",
        "provider": "Stanford Online",
        "level": "Intermediate",
        "duration_hours": 20,
        "url": "https://online.stanford.edu/courses/cs144-introduction-computer-networking",
        "description": "IP addressing, subnets, DNS, TCP handshake, HTTP/HTTPS protocol headers, and packet routing.",
        "primary_skill": "networking",
        "skills": ["networking"]
    },
    {
        "id": "c-github-actions",
        "title": "GitHub Actions: The Complete Guide",
        "provider": "Udemy",
        "level": "Beginner to Intermediate",
        "duration_hours": 10,
        "url": "https://www.udemy.com/course/github-actions-the-complete-guide/",
        "description": "Automate unit tests, container builds, and deployment triggers directly from git commits.",
        "primary_skill": "cicd",
        "skills": ["cicd", "github-actions", "git"]
    },
    {
        "id": "c-system-design",
        "title": "Grokking the System Design Interview",
        "provider": "DesignGurus",
        "level": "Advanced",
        "duration_hours": 25,
        "url": "https://www.designgurus.io/course/grokking-the-system-design-interview",
        "description": "Scalable design patterns, load balancers, caching strategies, rate limiting, and database sharding.",
        "primary_skill": "system-design",
        "skills": ["system-design", "distributed-systems", "redis"]
    },
    {
        "id": "c-data-analysis-python",
        "title": "Data Analysis with Python and Pandas",
        "provider": "DataCamp",
        "level": "Beginner",
        "duration_hours": 15,
        "url": "https://www.datacamp.com/courses/data-manipulation-with-pandas",
        "description": "Clean messy real-world datasets, perform aggregations, and compute descriptive statistics.",
        "primary_skill": "data-analysis",
        "skills": ["pandas", "numpy", "data-analysis", "python"]
    },
    {
        "id": "c-tableau-viz",
        "title": "Tableau for Data Science and Business Intelligence",
        "provider": "Kirill Eremenko (Udemy)",
        "level": "Beginner",
        "duration_hours": 10,
        "url": "https://www.udemy.com/course/tableau10/",
        "description": "Interactive business intelligence dashboards, drill-downs, calculated fields, and executive reporting.",
        "primary_skill": "tableau",
        "skills": ["tableau", "data-analysis"]
    },
    {
        "id": "c-fastapi-backend",
        "title": "Building Modern APIs with FastAPI and Python",
        "provider": "freeCodeCamp",
        "level": "Intermediate",
        "duration_hours": 14,
        "url": "https://www.freecodecamp.org/news/fastapi-quickstart/",
        "description": "Asynchronous REST endpoints, Pydantic data validation, SQLAlchemy ORM integration, and JWT auth.",
        "primary_skill": "fastapi",
        "skills": ["fastapi", "python", "rest-apis", "postgresql"]
    },
    {
        "id": "c-cybersecurity-foundations",
        "title": "Google Cybersecurity Professional Certificate",
        "provider": "Google (Coursera)",
        "level": "Beginner",
        "duration_hours": 35,
        "url": "https://www.coursera.org/professional-certificates/google-cybersecurity",
        "description": "Security protocols, SIEM tools, network packet inspection with Wireshark, and threat analysis.",
        "primary_skill": "cybersecurity",
        "skills": ["cybersecurity", "networking", "linux"]
    },
    {
        "id": "c-nlp-specialization",
        "title": "Natural Language Processing with Attention Models",
        "provider": "DeepLearning.AI",
        "level": "Intermediate",
        "duration_hours": 20,
        "url": "https://www.coursera.org/specializations/natural-language-processing",
        "description": "Transformers, tokenization, embeddings, RAG architectures, and fine-tuning text generation models.",
        "primary_skill": "nlp",
        "skills": ["nlp", "deep-learning", "pytorch", "python"]
    },
    {
        "id": "c-tailwind-mastery",
        "title": "Tailwind CSS: From Zero to Production",
        "provider": "Tailwind Labs",
        "level": "Beginner",
        "duration_hours": 8,
        "url": "https://tailwindcss.com/",
        "description": "Utility-first design patterns, layout composition, custom design tokens, and fluid responsive design.",
        "primary_skill": "tailwind",
        "skills": ["tailwind", "css", "responsive-design"]
    },
    {
        "id": "c-microservices-node",
        "title": "Microservices with Node JS and React",
        "provider": "Stephen Grider (Udemy)",
        "level": "Advanced",
        "duration_hours": 32,
        "url": "https://www.udemy.com/course/microservices-with-node-js-and-react/",
        "description": "Event-driven microservices architecture, Docker containerization, and Kubernetes cluster communication.",
        "primary_skill": "microservices",
        "skills": ["microservices", "docker", "kubernetes", "nodejs"]
    }
]

# 10 Recognized Real Certifications
CERTIFICATIONS = [
    {
        "id": "cert-aws-cloud-practitioner",
        "title": "AWS Certified Cloud Practitioner",
        "issuer": "Amazon Web Services",
        "code": "CLF-C02",
        "level": "Foundational",
        "description": "Validates overall understanding of AWS Cloud concepts, security, architecture, pricing, and support models.",
        "primary_skill": "aws",
        "skills": ["aws", "cloud-computing"],
        "careers": ["cloud-engineer", "devops-engineer"]
    },
    {
        "id": "cert-aws-solutions-architect",
        "title": "AWS Certified Solutions Architect - Associate",
        "issuer": "Amazon Web Services",
        "code": "SAA-C03",
        "level": "Associate",
        "description": "Validates ability to design resilient, high-performing, secure, and cost-optimized cloud architectures.",
        "primary_skill": "aws",
        "skills": ["aws", "cloud-computing", "networking", "system-design"],
        "careers": ["cloud-engineer", "devops-engineer"]
    },
    {
        "id": "cert-cka-kubernetes",
        "title": "Certified Kubernetes Administrator (CKA)",
        "issuer": "Cloud Native Computing Foundation (CNCF)",
        "code": "CKA",
        "level": "Professional",
        "description": "Performance-based exam certifying skills to install, configure, manage, and troubleshoot production Kubernetes clusters.",
        "primary_skill": "kubernetes",
        "skills": ["kubernetes", "docker", "linux", "networking"],
        "careers": ["devops-engineer", "cloud-engineer"]
    },
    {
        "id": "cert-terraform-associate",
        "title": "HashiCorp Certified: Terraform Associate",
        "issuer": "HashiCorp",
        "code": "003",
        "level": "Associate",
        "description": "Validates basic concepts, skills, and understanding of Terraform open-source infrastructure as code.",
        "primary_skill": "terraform",
        "skills": ["terraform", "cicd"],
        "careers": ["cloud-engineer", "devops-engineer"]
    },
    {
        "id": "cert-azure-fundamentals",
        "title": "Microsoft Certified: Azure Fundamentals",
        "issuer": "Microsoft",
        "code": "AZ-900",
        "level": "Foundational",
        "description": "Demonstrates foundational knowledge of cloud services and how those services are provided with Microsoft Azure.",
        "primary_skill": "azure",
        "skills": ["azure", "cloud-computing"],
        "careers": []
    },
    {
        "id": "cert-gcp-cloud-engineer",
        "title": "Google Associate Cloud Engineer",
        "issuer": "Google Cloud",
        "code": "GCP-ACE",
        "level": "Associate",
        "description": "Deploys applications, monitors operations, and manages enterprise solutions on Google Cloud Platform.",
        "primary_skill": "gcp",
        "skills": ["gcp", "cloud-computing"],
        "careers": []
    },
    {
        "id": "cert-comptia-security",
        "title": "CompTIA Security+",
        "issuer": "CompTIA",
        "code": "SY0-701",
        "level": "Entry / Associate",
        "description": "Industry benchmark for establishing a cybersecurity career covering baseline security and threat mitigation.",
        "primary_skill": "cybersecurity",
        "skills": ["cybersecurity", "networking", "auth-security"],
        "careers": ["cybersecurity-analyst"]
    },
    {
        "id": "cert-meta-frontend",
        "title": "Meta Front-End Developer Professional Certificate",
        "issuer": "Meta",
        "code": "META-FE",
        "level": "Professional",
        "description": "Practical certification covering responsive design, JavaScript, React components, and web UI testing.",
        "primary_skill": "react",
        "skills": ["react", "javascript", "html", "css"],
        "careers": ["frontend-developer", "fullstack-developer"]
    },
    {
        "id": "cert-ibm-data-analyst",
        "title": "IBM Data Analyst Professional Certificate",
        "issuer": "IBM",
        "code": "IBM-DA",
        "level": "Professional",
        "description": "Demonstrates proficiency in SQL queries, Python data analysis, spreadsheets, and data visualization.",
        "primary_skill": "data-analysis",
        "skills": ["sql", "python", "pandas", "data-analysis"],
        "careers": ["data-analyst", "data-scientist"]
    },
    {
        "id": "cert-tensorflow-developer",
        "title": "TensorFlow Developer Certificate",
        "issuer": "Google TensorFlow",
        "code": "TF-DEV",
        "level": "Associate",
        "description": "Validates hands-on proficiency in building ML and deep learning models using the TensorFlow framework.",
        "primary_skill": "tensorflow",
        "skills": ["tensorflow", "machine-learning", "deep-learning", "python"],
        "careers": ["ai-ml-engineer", "data-scientist"]
    }
]

# Realistic Projects Recommended per Skill Gaps
PROJECTS = [
    {
        "id": "p-cloud-serverless",
        "title": "Automated Multi-Region Serverless Microservice",
        "domain": "Cloud & Distributed Systems",
        "description": "Deploy an event-driven REST API on AWS using Lambda, API Gateway, and DynamoDB. Configure IAM least-privilege security and VPC endpoints.",
        "difficulty": "Intermediate",
        "skills": ["aws", "cloud-computing", "networking", "rest-apis"],
        "career_relevance": "cloud-engineer"
    },
    {
        "id": "p-terraform-iac",
        "title": "Production Cloud Infrastructure with Terraform",
        "domain": "DevOps & Infrastructure as Code",
        "description": "Write reusable Terraform modules to provision a multi-tier AWS VPC with public/private subnets, NAT gateways, and an EC2 auto-scaling group.",
        "difficulty": "Intermediate",
        "skills": ["terraform", "aws", "networking"],
        "career_relevance": "cloud-engineer"
    },
    {
        "id": "p-k8s-cluster",
        "title": "Containerized Microservices on Kubernetes",
        "domain": "DevOps & Container Orchestration",
        "description": "Containerize a multi-service web app using Docker, configure Kubernetes deployments with Horizontal Pod Autoscaling (HPA), and setup Ingress routing.",
        "difficulty": "Advanced",
        "skills": ["docker", "kubernetes", "linux"],
        "career_relevance": "devops-engineer"
    },
    {
        "id": "p-fullstack-careertwin",
        "title": "Career Intelligence & Skill Gap Web Platform",
        "domain": "Full Stack Web Engineering",
        "description": "Full-stack application featuring student master profiles, role-tailored resume generation, and interactive career path simulations.",
        "difficulty": "Intermediate",
        "skills": ["react", "typescript", "fastapi", "postgresql", "sql", "git"],
        "career_relevance": "fullstack-developer"
    },
    {
        "id": "p-rag-chatbot",
        "title": "Contextual Enterprise RAG Knowledge Search",
        "domain": "AI / Machine Learning",
        "description": "Build an AI retrieval-augmented generation pipeline using PyTorch, text embeddings, and vector similarity search across technical documentation.",
        "difficulty": "Intermediate",
        "skills": ["python", "nlp", "pytorch", "machine-learning"],
        "career_relevance": "ai-ml-engineer"
    },
    {
        "id": "p-data-etl-analytics",
        "title": "Automated SQL ETL Pipeline & KPI Dashboard",
        "domain": "Data Analytics",
        "description": "Extract raw transaction records, execute automated SQL transformation views in PostgreSQL, and render interactive cohort retention metrics.",
        "difficulty": "Beginner to Intermediate",
        "skills": ["sql", "postgresql", "python", "pandas", "data-analysis"],
        "career_relevance": "data-analyst"
    }
]

# Initial Demo User Profile: Hariom Gupta (Realistic student data)
DEMO_USER_SKILLS = [
    {"skill_id": "python", "proficiency": "Intermediate", "verified": True},
    {"skill_id": "java", "proficiency": "Intermediate", "verified": True},
    {"skill_id": "cpp", "proficiency": "Intermediate", "verified": True},
    {"skill_id": "javascript", "proficiency": "Intermediate", "verified": True},
    {"skill_id": "html", "proficiency": "Mastered", "verified": True},
    {"skill_id": "css", "proficiency": "Intermediate", "verified": True},
    {"skill_id": "react", "proficiency": "Intermediate", "verified": True},
    {"skill_id": "sql", "proficiency": "Intermediate", "verified": True},
    {"skill_id": "postgresql", "proficiency": "Intermediate", "verified": True},
    {"skill_id": "git", "proficiency": "Intermediate", "verified": True},
    {"skill_id": "data-structures", "proficiency": "Intermediate", "verified": True},
    {"skill_id": "docker", "proficiency": "Beginner", "verified": True},
]

DEMO_PROJECTS_DATA = [
    {
        "title": "Campus Event Management Platform",
        "tech": "React, Node.js, PostgreSQL, Tailwind CSS",
        "description": "Engineered a student event registration portal supporting concurrent registrations across university clubs with role-based dashboard access.",
        "skills": ["react", "javascript", "postgresql", "sql", "git"]
    },
    {
        "title": "Algorithmic Backtesting CLI Tool",
        "tech": "Python, Pandas, NumPy, Matplotlib",
        "description": "Implemented moving-average crossover trading simulation evaluating historical volatility and Sharpe ratios on equity datasets.",
        "skills": ["python", "pandas", "numpy", "data-structures"]
    },
    {
        "title": "Distributed Multi-Client Chat Server",
        "tech": "Java, Sockets, Multi-threading, TCP/IP",
        "description": "Built a non-blocking TCP chat server with thread pooling handling multi-room messaging and persistent user socket connections.",
        "skills": ["java", "networking", "data-structures"]
    }
]

def init_db_and_seed(force_reseed: bool = False):
    """Initializes tables and seeds initial structured data if empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Skills
        existing_skills = db.query(Skill).count()
        if existing_skills == 0:
            for s in SKILLS_TAXONOMY:
                skill_obj = Skill(
                    id=s["id"],
                    name=s["name"],
                    category=s["category"],
                    description=f"Standard industry competency for {s['name']}",
                    aliases=json.dumps(s.get("aliases", []))
                )
                db.add(skill_obj)
            db.commit()

        # 2. Seed Careers & Requirements
        existing_careers = db.query(Career).count()
        if existing_careers == 0:
            for c in CAREERS:
                career_obj = Career(
                    id=c["id"],
                    title=c["title"],
                    category=c["category"],
                    overview=c["overview"],
                    market_demand=c["market_demand"],
                    average_salary=c["average_salary"]
                )
                db.add(career_obj)
                db.flush()
                for cs in c["skills"]:
                    db.add(CareerSkill(
                        career_id=c["id"],
                        skill_id=cs["skill_id"],
                        importance=cs["importance"],
                        expected_level=cs["expected_level"],
                        weight=cs["weight"]
                    ))
            db.commit()

        # 3. Seed Courses
        if force_reseed or db.query(Course).count() != len(COURSES):
            db.query(Course).delete()
            for course in COURSES:
                db.add(Course(
                    id=course["id"],
                    title=course["title"],
                    provider=course["provider"],
                    level=course["level"],
                    duration_hours=course["duration_hours"],
                    url=course["url"],
                    description=course["description"],
                    primary_skill_id=course.get("primary_skill"),
                    skills_covered=json.dumps(course["skills"])
                ))
            db.commit()

        # 4. Seed Certifications
        if force_reseed or db.query(Certification).count() != len(CERTIFICATIONS):
            db.query(Certification).delete()
            for cert in CERTIFICATIONS:
                db.add(Certification(
                    id=cert["id"],
                    title=cert["title"],
                    issuer=cert["issuer"],
                    code=cert["code"],
                    level=cert["level"],
                    description=cert["description"],
                    primary_skill_id=cert.get("primary_skill"),
                    skills_covered=json.dumps(cert["skills"]),
                    relevance_career_ids=json.dumps(cert["careers"])
                ))
            db.commit()

        # 5. Seed Projects
        if db.query(ProjectTemplate).count() == 0:
            for proj in PROJECTS:
                db.add(ProjectTemplate(
                    id=proj["id"],
                    title=proj["title"],
                    domain=proj["domain"],
                    description=proj["description"],
                    difficulty=proj["difficulty"],
                    skills_used=json.dumps(proj["skills"]),
                    career_relevance=proj["career_relevance"]
                ))
            db.commit()

        # 6. Seed Demo User: Hariom Gupta
        user = db.query(User).filter(User.email == "hariom@chandigarh.edu").first()
        if not user:
            user = User(
                email="hariom@chandigarh.edu",
                name="Hariom Gupta",
                role="student"
            )
            db.add(user)
            db.flush()

            # Profile
            profile = StudentProfile(
                user_id=user.id,
                full_name="Hariom Gupta",
                university="Chandigarh University",
                degree="B.E. Computer Science Engineering",
                graduation_year="2026",
                bio="Computer Science student at Chandigarh University passionate about cloud systems, backend architecture, and high-performance applications.",
                github="https://github.com/hariomgupta",
                linkedin="https://linkedin.com/in/hariomgupta",
                target_career_id="cloud-engineer"
            )
            db.add(profile)

            # User Skills
            for sk in DEMO_USER_SKILLS:
                db.add(UserSkill(
                    user_id=user.id,
                    skill_id=sk["skill_id"],
                    proficiency=sk["proficiency"],
                    verified=sk["verified"],
                    added_via="profile"
                ))
            db.commit()

            # Seed Tailored Resumes for Hariom
            seed_initial_resumes(db, user.id)

    except Exception as e:
        db.rollback()
        print(f"Error during db seeding: {e}")
    finally:
        db.close()


def seed_initial_resumes(db, user_id: int):
    """Generates initial role-tailored resumes from the single master profile."""
    roles = [
        ("cloud-engineer", "Cloud Solutions Engineer", 82.0),
        ("software-engineer", "Software Engineer", 88.0),
        ("devops-engineer", "DevOps & Infrastructure Engineer", 75.0),
        ("ai-ml-engineer", "AI & Machine Learning Engineer", 72.0),
        ("fullstack-developer", "Full Stack Developer", 86.0),
        ("data-analyst", "Data Analyst", 78.0)
    ]
    for role_slug, role_title, match_pct in roles:
        resume = Resume(
            user_id=user_id,
            role_target=role_slug,
            role_title=role_title,
            summary=f"Passionate B.E. Computer Science student at Chandigarh University targeting {role_title} roles. Proven foundations in algorithms, backend architectures, and production problem-solving.",
            skills_json=json.dumps(["Python", "Java", "SQL", "PostgreSQL", "Git", "React", "Docker Basics"]),
            projects_json=json.dumps(DEMO_PROJECTS_DATA),
            experience_json=json.dumps([
                {
                    "role": "Software Development Intern",
                    "company": "Campus Tech Labs",
                    "period": "Summer 2025",
                    "bullets": [
                        "Maintained and optimized RESTful API services supporting 1,500 daily active student requests.",
                        "Containerized backend endpoints using Docker for consistent local testing."
                    ]
                }
            ]),
            education_json=json.dumps([
                {
                    "institution": "Chandigarh University",
                    "degree": "B.E. Computer Science Engineering",
                    "period": "2022 - 2026",
                    "gpa": "8.4 / 10.0"
                }
            ]),
            is_master=(role_slug == "software-engineer"),
            match_percentage=match_pct
        )
        db.add(resume)
    db.commit()


if __name__ == "__main__":
    init_db_and_seed()
    print("Database schema created and seed data loaded successfully.")
