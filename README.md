# 🩺 ClearHealth: Your Agentic Patient Advocate

![ClearHealth Banner](https://picsum.photos/seed/medical/1200/400?blur=2)

ClearHealth is an intelligent, multi-agent medical data analysis tool designed to empower patients. By leveraging the power of **Gemini 3.1 Flash Lite** and **Google Search Grounding**, ClearHealth demystifies complex medical reports, lab results, and clinician notes, transforming them into clear, actionable, and easy-to-understand insights.

## ✨ Key Features

*   **📄 Multi-modal Ingestion:** Upload medical documents via text paste, PDF uploads, or direct camera captures.
*   **🤖 4-Stage Agentic Workflow:** A sophisticated pipeline of specialized AI agents that extract, parse, analyze, and summarize your health data.
*   **🔍 Real-time Medical Grounding:** Uses Google Search to fetch up-to-date, standard healthy ranges for your specific vital metrics.
*   **📊 Intuitive Dashboard:** Visualizes your health metrics, instantly highlighting flagged or abnormal results.
*   **💬 Interactive RAG Chat:** An embedded AI assistant ready to answer specific questions about your report and general health implications.

## 🧠 How It Works: The Agentic Pipeline

ClearHealth processes your medical data through four specialized AI agents:

1.  **Agent 1 (OCR & Visual Analysis):** Extracts raw medical text, lab results, and clinical notes from uploaded images and PDFs exactly as they appear.
2.  **Agent 2 (Medical Jargon Parser):** Analyzes the raw text to extract a structured list of vital metrics (e.g., "LDL Cholesterol: 145 mg/dL").
3.  **Agent 3 (Health Range Mapper):** Utilizes **Google Search Grounding** to look up standard healthy ranges for the extracted metrics in real-time, mapping each metric and determining if it is "normal" or "flagged".
4.  **Agent 4 (Insight Generator):** Generates a plain English, empathetic executive summary of your health metrics, explaining what flagged items mean in simple terms.

## 🛠️ Tech Stack

*   **Frontend:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **AI / LLM:** `@google/genai` (Gemini 3.1 Flash Lite Preview)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   A Gemini API Key

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Set up your environment variables. Create a `.env` file in the root directory and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

## ⚠️ Disclaimer

**ClearHealth is an AI-powered tool designed for informational and educational purposes only.** It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
