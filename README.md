# Admission Kart AI 🎓🤖 [(Live Demo)](https://ISHAAN8037.github.io/Admission-Kart-AI)

**Admission Kart** is a professional-grade educational consultancy platform evolved into a full-stack AI-driven service. It features advanced ROI engines, agentic conversational memory, and native voice capabilities.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ISHAAN8037/Admission-Kart-AI)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FISHAAN8037%2FAdmission-Kart-AI&env=GEMINI_API_KEY,SMTP_USERNAME,SMTP_PASSWORD)

## 🚀 Key AI Features

*   **AI Profile Evaluator**: Real-time analysis of student metrics (GPA, budget, country) using Gemini LLM to find strategic university fits.
*   **Dynamic ROI Engine**: Calculates a "Value Score" for 35+ elite institutions based on tuition vs. prestige.
*   **Voice Assistant**: Native browser-integrated voice-to-text chat interface for hands-free queries.
*   **Proactive Scholarship Consultant**: The AI guide automatically scans for and suggests scholarships (like DAAD or Lester B. Pearson) based on the context of your conversation.
*   **Agentic Interview Prep**: Generates high-intent interview questions dynamically for target majors.
*   **Regional Roadmap Engine**: Provides 12-month application and visa timelines specific to the USA, UK, Germany, and Japan.

## 🛠️ Technical Stack

*   **Backend**: Flask (Python) with SQLAlchemy (SQLite).
*   **AI Model**: Google Gemini (`gemini-1.5-pro`).
*   **Frontend**: Native HTML5 Web Speech API, Phosphor Icons, and Vanilla CSS.
*   **Automation**: Multi-threaded SMTP lead nurturing system.

## 📦 Local Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/ISHAAN8037/Admission-Kart-AI.git
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Set up your `.env` file:
    ```env
    GEMINI_API_KEY=your_key
    SMTP_USERNAME=your_email
    SMTP_PASSWORD=your_app_password
    ```
4.  Run the platform:
    ```bash
    python run_local.py
    ```

## 🌐 Deployment

This project is configured for **Render** via `render.yaml`. Click the "Deploy to Render" button above to launch your own live instance!
