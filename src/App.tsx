import React, { useState, useEffect, useRef } from 'react';
import { FileText, Activity, AlertTriangle, CheckCircle, Send, ArrowRight, Upload, Camera, File, X } from 'lucide-react';

const mockReport = {
  summary: "Visual analysis of your uploaded documents and text extraction confirm generally good health, but there are a few areas requiring attention. Your LDL cholesterol is elevated, which increases cardiovascular risk. Your fasting glucose is slightly above optimal, suggesting a need for dietary review. All other major markers, including kidney and liver function, are within normal ranges.",
  metrics: [
    { name: "Total Cholesterol", value: "210 mg/dL", range: "< 200 mg/dL", status: "flagged" },
    { name: "LDL Cholesterol", value: "145 mg/dL", range: "< 100 mg/dL", status: "flagged" },
    { name: "HDL Cholesterol", value: "55 mg/dL", range: "> 40 mg/dL", status: "normal" },
    { name: "Triglycerides", value: "110 mg/dL", range: "< 150 mg/dL", status: "normal" },
    { name: "Fasting Glucose", value: "105 mg/dL", range: "70 - 99 mg/dL", status: "flagged" },
    { name: "Hemoglobin A1c", value: "5.6%", range: "< 5.7%", status: "normal" },
    { name: "White Blood Cell", value: "6.5 x10^3/uL", range: "4.0 - 11.0 x10^3/uL", status: "normal" },
    { name: "Hemoglobin", value: "14.2 g/dL", range: "13.2 - 16.6 g/dL", status: "normal" },
  ]
};

export default function App() {
  const [view, setView] = useState<'ingestion' | 'processing' | 'dashboard'>('ingestion');

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {view === 'ingestion' && <IngestionView onStart={() => setView('processing')} />}
      {view === 'processing' && <ProcessingView onComplete={() => setView('dashboard')} />}
      {view === 'dashboard' && <DashboardView />}
    </div>
  );
}

function IngestionView({ onStart }: { onStart: () => void }) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 pt-12 md:pt-24">
      <header className="mb-12 border-b-4 border-black pb-6">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2">ClearHealth</h1>
        <p className="text-lg md:text-xl font-mono font-bold text-gray-600 uppercase tracking-widest">Your Agentic Patient Advocate</p>
      </header>

      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-8 h-8" />
          <h2 className="text-3xl font-bold uppercase tracking-tight">Input Medical Data</h2>
        </div>
        
        <textarea 
          className="w-full h-48 md:h-64 p-6 border-4 border-black bg-gray-50 text-lg font-mono focus:outline-none focus:ring-0 resize-none rounded-none"
          placeholder="PASTE MEDICAL REPORT, LAB RESULTS, OR CLINICIAN NOTES HERE..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex items-center space-x-4 my-6">
          <div className="h-1 flex-1 bg-black"></div>
          <span className="font-mono font-bold uppercase tracking-widest text-gray-500">OR ATTACH DOCUMENTS</span>
          <div className="h-1 flex-1 bg-black"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            multiple 
            accept="image/*,application/pdf,.doc,.docx"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-4 border-black p-4 font-bold uppercase flex items-center justify-center space-x-2 hover:bg-black hover:text-white transition-colors rounded-none"
          >
            <Upload className="w-6 h-6" />
            <span>Upload Files</span>
          </button>

          <input 
            type="file" 
            ref={cameraInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
            capture="environment"
          />
          <button 
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 border-4 border-black p-4 font-bold uppercase flex items-center justify-center space-x-2 hover:bg-black hover:text-white transition-colors rounded-none"
          >
            <Camera className="w-6 h-6" />
            <span>Take Photo</span>
          </button>
        </div>

        {files.length > 0 && (
          <div className="space-y-2 mt-4">
            <h3 className="font-mono font-bold uppercase text-sm">Attached Files:</h3>
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between border-2 border-black p-3 bg-gray-50">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <File className="w-5 h-5 flex-shrink-0" />
                  <span className="font-mono text-sm truncate">{file.name}</span>
                </div>
                <button onClick={() => removeFile(i)} className="hover:bg-black hover:text-white p-1 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={onStart}
          disabled={!text.trim() && files.length === 0}
          className="w-full bg-black text-white text-xl md:text-2xl font-bold uppercase py-6 border-4 border-black hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white disabled:cursor-not-allowed flex items-center justify-center space-x-3 rounded-none mt-8"
        >
          <span>Initialize Agentic Analysis</span>
          <ArrowRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}

function ProcessingView({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    "Agent 1: Performing OCR & Visual Analysis...",
    "Agent 2: Parsing Medical Jargon...",
    "Agent 3: Mapping Standard Health Ranges...",
    "Agent 4: Generating Actionable Insights..."
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1000);
    const timer2 = setTimeout(() => setStep(2), 2000);
    const timer3 = setTimeout(() => setStep(3), 3000);
    const timer4 = setTimeout(() => onComplete(), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <Activity className="w-24 h-24 animate-pulse mb-16" strokeWidth={1.5} />
      <div className="w-full max-w-2xl space-y-6">
        {steps.map((s, i) => (
          <div 
            key={i} 
            className={`p-6 border-4 border-black font-mono text-lg md:text-xl font-bold transition-all duration-300 rounded-none ${
              i <= step ? 'bg-black text-white opacity-100 translate-x-0' : 'bg-white text-gray-300 border-gray-200 opacity-50 -translate-x-8'
            }`}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardView() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Column: Report */}
      <div className="w-full lg:w-1/2 border-b-4 lg:border-b-0 lg:border-r-4 border-black p-6 md:p-10 lg:overflow-y-auto lg:h-screen">
        <header className="mb-10 border-b-4 border-black pb-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Analysis Report</h1>
          <p className="font-mono text-base font-bold mt-2 text-gray-600">ID: CH-99281-A</p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold uppercase mb-6 bg-black text-white inline-block px-3 py-1">Executive Summary</h2>
          <p className="text-lg md:text-xl leading-relaxed border-l-4 border-black pl-6 font-medium">
            {mockReport.summary}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold uppercase mb-6 bg-black text-white inline-block px-3 py-1">Vital Metrics</h2>
          <div className="grid grid-cols-1 gap-4">
            {mockReport.metrics.map((m, i) => (
              <div key={i} className="border-4 border-black p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 rounded-none">
                <div>
                  <h3 className="font-bold text-xl uppercase tracking-tight">{m.name}</h3>
                  <p className="font-mono text-sm text-gray-600 mt-1">Range: {m.range}</p>
                </div>
                <div className="flex items-center space-x-4 sm:justify-end">
                  <span className="font-mono text-2xl font-black">{m.value}</span>
                  {m.status === 'flagged' ? (
                    <div className="flex items-center space-x-2 border-4 border-black px-3 py-1 bg-gray-100 rounded-none">
                      <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />
                      <span className="font-bold uppercase text-sm tracking-wide">Flagged</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 border-4 border-black px-3 py-1 rounded-none">
                      <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
                      <span className="font-bold uppercase text-sm tracking-wide">Normal</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column: Chat */}
      <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col lg:h-screen bg-gray-50">
        <header className="mb-8 border-b-4 border-black pb-6">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Consultation Context</h2>
          <p className="font-mono text-base font-bold mt-2 text-gray-600">Agentic RAG Interface</p>
        </header>

        <ChatInterface />
      </div>
    </div>
  );
}

function ChatInterface() {
  const [messages, setMessages] = useState<{role: 'user' | 'agent', content: string}[]>([
    { role: 'agent', content: "I have analyzed your report. I am ready to answer any questions regarding your lipid panel, blood count, or general health implications." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "What does this mean for my diet?",
    "Should I be worried about my LDL?",
    "How can I lower my fasting glucose?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "Based on your report, I recommend discussing this with your primary care physician. However, generally speaking, lifestyle modifications such as diet and exercise can significantly impact these metrics.";
      
      if (text.toLowerCase().includes('diet') || text.toLowerCase().includes('ldl')) {
        response = "Your elevated LDL (145 mg/dL) suggests a need to reduce saturated fats and trans fats. Focus on soluble fiber (oats, beans), polyunsaturated fats (fish, nuts), and plant sterols. This can help lower LDL cholesterol.";
      } else if (text.toLowerCase().includes('glucose')) {
        response = "Your fasting glucose is 105 mg/dL, which is in the pre-diabetic range. Reducing refined carbohydrates, avoiding sugary drinks, and increasing physical activity can help improve insulin sensitivity.";
      }

      setMessages(prev => [...prev, { role: 'agent', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 border-4 border-black rounded-none ${
              m.role === 'user' ? 'bg-black text-white' : 'bg-white text-black'
            }`}>
              <p className="font-mono font-bold text-xs uppercase mb-2 opacity-60 tracking-widest">{m.role}</p>
              <p className="font-medium text-lg leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-5 border-4 border-black bg-white text-black rounded-none">
              <p className="font-mono font-bold text-xs uppercase mb-2 opacity-60 tracking-widest">agent</p>
              <div className="flex space-x-2 py-2">
                <div className="w-3 h-3 bg-black animate-bounce" />
                <div className="w-3 h-3 bg-black animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-3 h-3 bg-black animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="space-y-4 mt-auto">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button 
              key={i}
              onClick={() => handleSend(s)}
              className="text-xs md:text-sm font-bold uppercase border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors rounded-none text-left"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="ASK A QUESTION..."
            className="flex-1 border-4 border-black p-4 font-mono text-lg focus:outline-none focus:ring-0 rounded-none bg-white"
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="bg-black text-white p-4 border-4 border-black hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white disabled:cursor-not-allowed rounded-none"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
