import React, { useState, useEffect, useRef } from 'react';
import { FileText, Activity, AlertTriangle, CheckCircle, Send, ArrowRight, Upload, Camera, File as FileIcon, X, RefreshCw } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Metric {
  name: string;
  value: string;
  range: string;
  status: 'normal' | 'flagged';
}

interface ReportData {
  summary: string;
  metrics: Metric[];
}

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export default function App() {
  const [view, setView] = useState<'ingestion' | 'processing' | 'dashboard'>('ingestion');
  const [inputText, setInputText] = useState('');
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const handleStart = (text: string, files: File[]) => {
    setInputText(text);
    setInputFiles(files);
    setView('processing');
  };

  const handleComplete = (data: ReportData) => {
    setReportData(data);
    setView('dashboard');
  };

  const handleRestart = () => {
    setInputText('');
    setInputFiles([]);
    setReportData(null);
    setView('ingestion');
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {view === 'ingestion' && <IngestionView onStart={handleStart} initialText={inputText} initialFiles={inputFiles} />}
      {view === 'processing' && <ProcessingView text={inputText} files={inputFiles} onComplete={handleComplete} onCancel={handleRestart} />}
      {view === 'dashboard' && reportData && <DashboardView reportData={reportData} onRestart={handleRestart} />}
    </div>
  );
}

function IngestionView({ onStart, initialText, initialFiles }: { onStart: (t: string, f: File[]) => void, initialText: string, initialFiles: File[] }) {
  const [text, setText] = useState(initialText);
  const [files, setFiles] = useState<File[]>(initialFiles);
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
            accept="image/*,application/pdf"
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
                  <FileIcon className="w-5 h-5 flex-shrink-0" />
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
          onClick={() => onStart(text, files)}
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

function ProcessingView({ text, files, onComplete, onCancel }: { text: string, files: File[], onComplete: (data: ReportData) => void, onCancel: () => void }) {
  const [statuses, setStatuses] = useState<Record<string, 'pending' | 'running' | 'completed'>>({
    agent1: 'pending',
    agent2: 'pending',
    agent3: 'pending',
    agent4: 'pending'
  });
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 'agent1', label: "Agent 1: OCR & Visual Analysis" },
    { id: 'agent2', label: "Agent 2: Parsing Medical Jargon" },
    { id: 'agent3', label: "Agent 3: Mapping Health Ranges (Search)" },
    { id: 'agent4', label: "Agent 4: Generating Insights" }
  ];

  useEffect(() => {
    let isMounted = true;
    async function analyze() {
      try {
        // --- AGENT 1: OCR & Visual Analysis ---
        setStatuses(s => ({ ...s, agent1: 'running' }));
        const parts: any[] = [];
        if (text.trim()) parts.push({ text });
        for (const file of files) {
          parts.push(await fileToGenerativePart(file));
        }

        if (parts.length === 0) {
          throw new Error("No data provided.");
        }

        const agent1Response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-preview',
          contents: { parts },
          config: {
            systemInstruction: "You are an OCR and data extraction agent. Extract all medical text, lab results, and clinical notes from the provided inputs exactly as they appear. Do not summarize. Just output the raw extracted text."
          }
        });
        
        if (!isMounted) return;
        const extractedText = agent1Response.text || "No text extracted.";
        setStatuses(s => ({ ...s, agent1: 'completed' }));

        // --- PARALLEL EXECUTION: Agent 2/3 Pipeline AND Agent 4 ---
        setStatuses(s => ({ ...s, agent2: 'running', agent4: 'running' }));

        const metricsPipeline = async () => {
          // --- AGENT 2: Parsing Medical Jargon ---
          const agent2Response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-preview',
            contents: `Extract the vital metrics from this medical text:\n\n${extractedText}`,
            config: {
              systemInstruction: "You are a medical parser. Extract a list of vital metrics from the text. Return a JSON array.",
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of the metric (e.g., LDL Cholesterol)" },
                    value: { type: Type.STRING, description: "Value including units (e.g., 145 mg/dL)" }
                  },
                  required: ["name", "value"]
                }
              }
            }
          });

          if (!isMounted) return [];
          const parsedMetrics = JSON.parse(agent2Response.text || "[]");
          
          if (parsedMetrics.length === 0) {
             throw new Error("No medical metrics found in the provided data.");
          }
          setStatuses(s => ({ ...s, agent2: 'completed', agent3: 'running' }));

          // --- AGENT 3: Mapping Standard Health Ranges (with Google Search) ---
          const agent3Response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-preview',
            contents: `Here are the patient's metrics: ${JSON.stringify(parsedMetrics)}. Use Google Search to find the standard healthy ranges for these specific metrics. Then, map each metric to its standard range and determine if it is 'normal' or 'flagged'. Return ONLY a raw JSON array of objects with keys: name, value, range, status.`,
            config: {
              tools: [{ googleSearch: {} }],
              systemInstruction: "You are a medical reference agent. Use search to find standard ranges. Return ONLY a valid JSON array of the metrics with 'range' and 'status' added. Do not include markdown formatting like ```json.",
            }
          });

          if (!isMounted) return [];
          let mappedMetrics = [];
          try {
            // Clean up potential markdown formatting if the model still includes it
            const rawText = (agent3Response.text || "[]").replace(/```json/g, '').replace(/```/g, '').trim();
            mappedMetrics = JSON.parse(rawText);
          } catch (e) {
            console.warn("Failed to parse Agent 3 JSON, falling back to original metrics", e);
            mappedMetrics = parsedMetrics.map((m: any) => ({ ...m, range: "Unknown", status: "normal" }));
          }
          setStatuses(s => ({ ...s, agent3: 'completed' }));
          return mappedMetrics;
        };

        const summaryPipeline = async () => {
          // --- AGENT 4: Generating Actionable Insights ---
          const agent4Response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-preview',
            contents: `Patient medical text:\n\n${extractedText}\n\nGenerate a plain English executive summary of these results.`,
            config: {
              systemInstruction: "You are a patient advocate agent. Write a clear, empathetic, plain English summary of the patient's health metrics based on the provided text. Highlight any obvious flagged metrics and explain what they mean in simple terms.",
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.STRING }
                },
                required: ["summary"]
              }
            }
          });

          if (!isMounted) return "Summary generation failed.";
          const finalSummary = JSON.parse(agent4Response.text || "{}").summary || "Summary generation failed.";
          setStatuses(s => ({ ...s, agent4: 'completed' }));
          return finalSummary;
        };

        const [mappedMetrics, finalSummary] = await Promise.all([
          metricsPipeline(),
          summaryPipeline()
        ]);

        if (!isMounted) return;
        onComplete({ summary: finalSummary, metrics: mappedMetrics });

      } catch (err: any) {
        console.error(err);
        if (isMounted) setError(err.message || "An error occurred during analysis.");
      }
    }

    analyze();
    return () => { isMounted = false; };
  }, [text, files, onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      {error ? (
        <div className="w-full max-w-2xl p-8 border-4 border-black bg-red-50 flex flex-col items-center text-center rounded-none">
          <AlertTriangle className="w-16 h-16 mb-6 text-red-600" strokeWidth={1.5} />
          <h2 className="text-2xl font-black uppercase mb-4">Analysis Failed</h2>
          <p className="font-mono text-lg mb-8">{error}</p>
          <button 
            onClick={onCancel}
            className="bg-black text-white px-8 py-4 font-bold uppercase border-4 border-black hover:bg-white hover:text-black transition-colors rounded-none"
          >
            Return to Ingestion
          </button>
        </div>
      ) : (
        <>
          <Activity className="w-24 h-24 animate-pulse mb-16" strokeWidth={1.5} />
          <div className="w-full max-w-2xl space-y-4">
            {steps.map((s) => {
              const status = statuses[s.id as keyof typeof statuses];
              return (
                <div 
                  key={s.id} 
                  className={`p-6 border-4 font-mono text-lg md:text-xl font-bold transition-all duration-300 rounded-none flex items-center justify-between ${
                    status === 'completed' ? 'bg-black text-white border-black opacity-100 translate-x-0' : 
                    status === 'running' ? 'bg-white text-black border-black opacity-100 translate-x-0 animate-pulse' : 
                    'bg-white text-gray-300 border-gray-200 opacity-50 -translate-x-4'
                  }`}
                >
                  <span>{s.label}</span>
                  {status === 'completed' && <CheckCircle className="w-6 h-6" />}
                  {status === 'running' && <RefreshCw className="w-6 h-6 animate-spin" />}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function DashboardView({ reportData, onRestart }: { reportData: ReportData, onRestart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Column: Report */}
      <div className="w-full lg:w-1/2 border-b-4 lg:border-b-0 lg:border-r-4 border-black p-6 md:p-10 lg:overflow-y-auto lg:h-screen">
        <header className="mb-10 border-b-4 border-black pb-6 flex justify-between items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Analysis Report</h1>
            <p className="font-mono text-base font-bold mt-2 text-gray-600">ID: CH-{Math.floor(Math.random() * 90000) + 10000}-A</p>
          </div>
          <button onClick={onRestart} className="p-2 border-4 border-black hover:bg-black hover:text-white transition-colors rounded-none" title="Start Over">
            <RefreshCw className="w-6 h-6" />
          </button>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold uppercase mb-6 bg-black text-white inline-block px-3 py-1">Executive Summary</h2>
          <p className="text-lg md:text-xl leading-relaxed border-l-4 border-black pl-6 font-medium">
            {reportData.summary}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold uppercase mb-6 bg-black text-white inline-block px-3 py-1">Vital Metrics</h2>
          {reportData.metrics && reportData.metrics.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {reportData.metrics.map((m, i) => (
                <div key={i} className="border-4 border-black p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 rounded-none">
                  <div>
                    <h3 className="font-bold text-xl uppercase tracking-tight">{m.name}</h3>
                    {m.range && <p className="font-mono text-sm text-gray-600 mt-1">Range: {m.range}</p>}
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
          ) : (
            <p className="font-mono text-gray-500 italic">No specific metrics extracted from the provided data.</p>
          )}
        </section>
      </div>

      {/* Right Column: Chat */}
      <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col lg:h-screen bg-gray-50">
        <header className="mb-8 border-b-4 border-black pb-6">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Consultation Context</h2>
          <p className="font-mono text-base font-bold mt-2 text-gray-600">Agentic RAG Interface</p>
        </header>

        <ChatInterface reportData={reportData} />
      </div>
    </div>
  );
}

function ChatInterface({ reportData }: { reportData: ReportData }) {
  const [messages, setMessages] = useState<{role: 'user' | 'agent', content: string}[]>([
    { role: 'agent', content: "I have analyzed your report. I am ready to answer any questions regarding your results or general health implications." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const suggestions = [
    "What does this mean for my diet?",
    "Should I be worried about any flagged items?",
    "Can you explain my results simply?"
  ];

  useEffect(() => {
    chatRef.current = ai.chats.create({
      model: "gemini-3.1-flash-lite-preview",
      config: {
        systemInstruction: `You are an expert medical AI assistant. You are discussing the following patient report: ${JSON.stringify(reportData)}. Answer the patient's questions clearly, concisely, and empathetically. Always advise them to consult a doctor for medical advice. Keep your answers relatively brief and easy to understand.`,
        tools: [{ googleSearch: {} }]
      }
    });
  }, [reportData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatRef.current.sendMessage({ message: text });
      setMessages(prev => [...prev, { role: 'agent', content: response.text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'agent', content: "I'm sorry, I encountered an error processing your request. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
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
              <p className="font-medium text-lg leading-relaxed whitespace-pre-wrap">{m.content}</p>
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
