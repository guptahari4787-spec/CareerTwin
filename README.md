# CareerTwin — AI-Powered Career Intelligence Platform

> **"From Where I Am → Where I Want to Go → What Skills Will Take Me There."**

CareerTwin is a career progression, skill-gap intelligence, and tailored multi-resume platform designed for engineering students and university leaders.

---

## 🚀 Quick Start (Ready-to-Run)

### 1. Prerequisites
- **Python**: 3.10+
- **Node.js**: v18+ (tested on v24.13.1)
- **Database**: SQLite (default local zero-config, PostgreSQL compatible via `DATABASE_URL`)

### 2. Backend Setup & Run
```bash
# In project root:
cd backend

# Install dependencies (fastapi, uvicorn, sqlalchemy, pydantic, python-multipart)
pip install fastapi uvicorn sqlalchemy pydantic python-multipart

# Initialize schema and seed normalized taxonomy (40+ skills, 10 careers, courses, certs, projects)
python seed_data.py

# Start FastAPI server on port 8000
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup & Run
```bash
# In project root:
cd frontend

# Install dependencies
npm install

# Start Vite React development server on port 5173
npm run dev -- --host 127.0.0.1 --port 5173
```
Open your browser at: **`http://127.0.0.1:5173`**

---

## 👤 Demo Account & Seed Persona

- **Student**: Hariom Gupta
- **Degree**: B.E. Computer Science Engineering, 3rd Year (Class of 2026)
- **Institution**: Chandigarh University
- **Current Verified Skills**: Python, Java, C++, JavaScript, HTML, CSS, React, SQL, PostgreSQL, Git, Data Structures, Docker Basics.

---

## 🌟 Core Innovations & Architecture

### 1. What-If Career Simulator (`/whatif`)
- Real-time simulation of career hypotheses without altering permanent student records.
- Handles natural queries:
  - *"What if I learn AWS?"*
  - *"What if I learn Docker?"*
  - *"What if I learn Kubernetes?"*
  - *"What if I learn AI?"*
  - *"What if I complete AWS Cloud Practitioner?"*
  - *"What skills do I need for Cloud Engineer?"*
  - *"What am I missing for DevOps?"*
  - *"What should I learn next?"*
- Displays:
  $$\text{Current State} \longrightarrow \text{Simulated Delta} \longrightarrow \text{Updated Career Matches} \longrightarrow \text{Residual Gaps} \longrightarrow \text{Next Path}$$
- User can click **"Add [Skill] to My Profile"** to commit the delta permanently, recalculating all career matches and roadmaps.

### 2. Single Master Profile → Tailored Resume Reel (`/resume`)
- **Halo Reel Component**: Arranges resumes along an interactive elliptical 3D curve with depth scaling, z-index layering, keyboard navigation (`←` / `→`), and pointer drag support.
- Generates 6 distinct career resumes from the **same master candidate truth**:
  1. Cloud Solutions Engineer
  2. Software Engineer
  3. DevOps & Infrastructure Engineer
  4. AI & Machine Learning Engineer
  5. Full Stack Developer
  6. Data Analyst
- **No Hallucinated Experience**: Re-orders skills, emphasizes relevant projects, and tailors summaries while preserving 100% authentic student achievements.

### 3. Draggable Widget Grid (`/dashboard`)
- Interactive, responsive 4-column student dashboard.
- Default intentional layout:
  - **Row 1**: Career Match (wide), Skill Gap (small), Roadmap Progress (small)
  - **Row 2**: What-If Simulator (wide), Career Visualization (wide)
  - **Row 3**: Recommended Learning (wide), Resume / CV (small), Skill Growth (small)
- Full support for drag-and-drop rearrangement, keyboard navigation (`Alt + Arrow`), and instant layout reset.

### 4. University Insights (`/university`)
- Aggregated, non-identifying cohort analytics (420 students analyzed from Chandigarh University CSE 2026).
- Common systemic skill gaps (Cloud, DevOps, IaC, PyTorch, System Design).
- Industry demand vs. cohort supply alignment.
- Actionable university training interventions (AWS Bootcamp, CNCF Containerization Lab, AI Hackathons).
- Visualizes the closed-loop ecosystem:
  $$\text{Industry Demand} \to \text{CareerTwin Taxonomy} \to \text{Student Gap} \to \text{Roadmap} \to \text{University Insights} \to \text{Curricular Alignment}$$

---

## 📐 Design System & Aesthetics (TasteSkill Compliant)

- **Palette**: Calm, warm white (`#FAFAF9`), clean white card surfaces (`#FFFFFF`), dark slate text (`#0F172A`), restrained muted indigo accent (`#4F46E5`), subtle borders (`#E2E8F0`).
- **Zero Em-Dashes**: Strictly compliant with Section 9.G.
- **Editorial & Human**: No cyberpunk neon, no holographic surfaces, no fake AI badges, no clutter.

---

## 🧪 Verification & Test Scripts

Run the automated What-If scenario test suite:
```bash
python backend/test_scenarios.py
```
This tests all 7 required simulation scenarios, verifying deterministic scoring deltas and entity extraction.
