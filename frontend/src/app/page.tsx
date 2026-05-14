"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Upload, ChevronRight, Cpu, Eye, ShieldAlert, Fingerprint } from "lucide-react";
import axios from "axios";

const slowSpring = { type: "spring", stiffness: 50, damping: 20, restDelta: 0.001 };
const fastSpring = { type: "spring", stiffness: 200, damping: 25 };

// ----------------------------------------------------
// COMPONENTS
// ----------------------------------------------------

const NeuralSphereSVG = ({ scrollProgress }: { scrollProgress: any }) => {
  const rotation = useTransform(scrollProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollProgress, [0, 1], [0.9, 1.3]);
  const opacity = useTransform(scrollProgress, [0, 0.8, 1], [1, 1, 0]);
  
  return (
    <motion.div style={{ rotate: rotation, scale, opacity }} className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] flex items-center justify-center opacity-90 pointer-events-none">
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.ellipse
            key={i} cx="100" cy="100" rx="80" ry="25" fill="none"
            stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5"
            initial={{ rotate: i * 30 }}
            animate={{ rotate: i * 30 + 360 }}
            transition={{ duration: 40 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <motion.circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeDasharray="4 4" animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        <circle cx="100" cy="100" r="4" fill="#ffffff" />
      </svg>
    </motion.div>
  );
};

// Advanced Scroll-Linked Data Visualization (Globe & Chart Hybrid)
const GlobalThreatMatrix = ({ progress }: { progress: any }) => {
  // Chart path drawing
  const pathLength = useTransform(progress, [0, 0.8], [0, 1]);
  // Globe rotation
  const globeRotate = useTransform(progress, [0, 1], [0, 180]);
  // Data points rising
  const pointY = useTransform(progress, [0, 1], [100, 0]);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      {/* Background Wireframe Globe */}
      <motion.div style={{ rotate: globeRotate }} className="absolute inset-0 flex items-center justify-center opacity-20">
        <svg viewBox="0 0 200 200" className="w-full max-w-[500px]">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#fff" strokeWidth="0.5" />
          <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="#fff" strokeWidth="0.5" />
          <ellipse cx="100" cy="100" rx="30" ry="90" fill="none" stroke="#fff" strokeWidth="0.5" />
          <path d="M 10 100 L 190 100" stroke="#fff" strokeWidth="0.5" />
          <path d="M 100 10 L 100 190" stroke="#fff" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* Foreground Performance Chart drawing on scroll */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 w-full max-w-[600px] mx-auto px-10">
        <div className="w-full flex justify-between text-[9px] uppercase tracking-[0.2em] text-white/40 mb-4 border-b border-white/10 pb-2">
          <span>Competitor Avg (62%)</span>
          <span className="text-white">Javino Accuracy (99.8%)</span>
        </div>
        <svg viewBox="0 0 500 200" className="w-full overflow-visible">
          {/* Baseline */}
          <path d="M 0 150 L 500 150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Javino Performance Curve */}
          <motion.path 
            d="M 0 180 C 100 180, 200 160, 250 100 C 300 20, 400 20, 500 20" 
            fill="none" stroke="#ffffff" strokeWidth="3"
            style={{ pathLength }}
          />
          
          {/* Highlight Node */}
          <motion.circle cx="500" cy="20" r="6" fill="#ffffff" style={{ scale: pathLength, opacity: pathLength }} />
          <motion.circle cx="500" cy="20" r="16" fill="none" stroke="#ffffff" strokeWidth="1" style={{ scale: pathLength, opacity: pathLength }} animate={{ scale: [1, 1.5], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
        </svg>
      </div>
    </div>
  );
};

const TimelineNode = ({ icon: Icon, title, desc, progress, trigger }: { icon: any, title: string, desc: string, progress: any, trigger: number }) => {
  const opacity = useTransform(progress, [trigger - 0.1, trigger], [0.2, 1]);
  const scale = useTransform(progress, [trigger - 0.1, trigger], [0.8, 1]);
  const y = useTransform(progress, [trigger - 0.1, trigger], [20, 0]);
  
  return (
    <motion.div style={{ opacity, scale, y }} className="flex items-start gap-8 relative z-10 bg-black py-4">
      <div className="w-16 h-16 rounded-full border border-white/20 bg-black flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="pt-2">
        <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-lg text-white/50 leading-relaxed font-light">{desc}</p>
      </div>
    </motion.div>
  );
};

// ----------------------------------------------------
// MAIN PAGE
// ----------------------------------------------------

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothHero = useSpring(heroProgress, slowSpring);
  
  const textScale = useTransform(smoothHero, [0, 1], [1, 0.9]);
  const textOpacity = useTransform(smoothHero, [0, 0.5], [1, 0]);
  const textY = useTransform(smoothHero, [0, 1], ["0%", "-30%"]);

  // Matrix Section Scroll
  const matrixRef = useRef(null);
  const { scrollYProgress: matrixProgress } = useScroll({ target: matrixRef, offset: ["start 70%", "end 30%"] });
  const smoothMatrix = useSpring(matrixProgress, slowSpring);

  const timelineRef = useRef(null);
  const { scrollYProgress: timelineProgress } = useScroll({ target: timelineRef, offset: ["start 60%", "end 80%"] });
  const smoothTimeline = useSpring(timelineProgress, slowSpring);
  const lineScale = useTransform(smoothTimeline, [0, 1], ["0%", "100%"]);

  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const executeAnalysis = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      // Direct call to FastAPI AI engine
      const response = await axios.post("http://localhost:8000/analyze", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setAnalysisResult({
        aiProbability: response.data.deepfake_probability,
        manipulationType: response.data.manipulation_type,
        toolPrediction: response.data.ai_tool_prediction,
        explanation: response.data.explanation,
        flags: response.data.visual_flags
      });
    } catch (err: any) {
      console.error(err);
      setError("Could not reach the AI engine. Make sure the FastAPI service is running on port 8000.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-black text-[#f5f5f7] selection:bg-white selection:text-black">
      
      {/* SECTION 1: HERO */}
      <div ref={heroRef} className="h-[200vh] relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
          <motion.div style={{ scale: textScale, opacity: textOpacity, y: textY }} className="absolute inset-0 flex items-center justify-center z-0">
            <h1 className="text-[16vw] font-bold tracking-tighter text-white leading-none text-center" style={{ letterSpacing: "-0.06em" }}>Absolute</h1>
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <NeuralSphereSVG scrollProgress={smoothHero} />
          </div>
          <motion.div style={{ opacity: textOpacity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20">
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-semibold">Initiate Sequence</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-[1px] h-12 bg-white/20" />
          </motion.div>
        </div>
      </div>

      {/* SECTION 2: DATA VISUALIZATION (Replacing boring text scroll) */}
      <section ref={matrixRef} className="py-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between min-h-screen gap-16">
        <div className="lg:w-1/2 w-full z-10">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight text-white mb-8" style={{ letterSpacing: "-0.03em" }}>
            Javino redefines reality.
          </h2>
          <p className="text-xl text-white/50 leading-relaxed font-light mb-8 max-w-lg">
            We leverage proprietary ML models to dissect structural anomalies at the pixel level. Our accuracy matrix actively learns, rendering conventional evasion techniques obsolete.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Where others guess, we know.
          </div>
        </div>
        <div className="lg:w-1/2 w-full h-[500px] bg-[#050505] rounded-[40px] border border-white/5 flex items-center justify-center overflow-hidden">
          <GlobalThreatMatrix progress={smoothMatrix} />
        </div>
      </section>

      {/* SECTION 3: TIMELINE */}
      <section className="py-32 px-6 bg-black relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white" style={{ letterSpacing: "-0.04em" }}>The Groq Architecture.</h2>
            <p className="text-xl text-white/40 mt-6 max-w-2xl mx-auto">A continuous flow of forensic data, supercharged by Groq Intelligence for millisecond inference.</p>
          </div>
          <div ref={timelineRef} className="relative py-10 pl-8 md:pl-20">
            <div className="absolute left-[39px] md:left-[87px] top-[56px] bottom-[180px] md:bottom-[140px] w-[2px] bg-white/10">
              <motion.div style={{ height: lineScale }} className="absolute top-0 left-0 w-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] origin-top" />
            </div>
            <div className="space-y-32">
              <TimelineNode progress={smoothTimeline} trigger={0.2} icon={Fingerprint} title="Pixel Integrity" desc="Deepfake probability scoring with granular transparency. Every pixel is verified." />
              <TimelineNode progress={smoothTimeline} trigger={0.5} icon={Cpu} title="LPU Inference" desc="Powered by Groq's specialized hardware for instantaneous neural response times." />
              <TimelineNode progress={smoothTimeline} trigger={0.8} icon={ShieldAlert} title="Forensic Output" desc="Analyst-level explanations for every flagged visual anomaly, ready for enterprise audits." />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DASHBOARD */}
      <section className="min-h-screen flex flex-col justify-center py-32 px-6 relative border-t border-white/5 bg-[#030303]">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center z-10">
          <AnimatePresence mode="wait">
            {!file && !analysisResult && !isAnalyzing ? (
              <motion.div key="upload" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={fastSpring} className="flex flex-col items-center w-full">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6" style={{ letterSpacing: "-0.04em" }}>Analyze media now.</h2>
                <label className="relative mt-12 flex items-center justify-center w-full max-w-2xl h-72 rounded-[40px] border border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 cursor-pointer group overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
                  <div className="flex flex-col items-center gap-6 z-10">
                    <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-500">
                      <Upload className="w-6 h-6 text-white group-hover:text-black transition-colors" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] font-semibold text-white/50 group-hover:text-white transition-colors">Initiate Scan</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => e.target.files && executeAnalysis(e.target.files[0])} />
                </label>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={slowSpring} className="flex flex-col items-center">
                <div className="relative w-32 h-32 flex items-center justify-center mb-10">
                  <motion.svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
                    <motion.circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <motion.circle cx="50" cy="50" r="48" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="300" strokeDashoffset="250" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                  </motion.svg>
                </div>
                <h3 className="text-2xl font-medium tracking-tight text-white/80">Scanning structural metadata...</h3>
              </motion.div>
            ) : analysisResult ? (
              <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={slowSpring} className="w-full text-left bg-white/[0.02] border border-white/10 rounded-[40px] p-10 md:p-16">
                <div className="pb-12 mb-12 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between">
                  <div>
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2" style={{ letterSpacing: "-0.03em" }}>
                      {analysisResult.aiProbability > 50 ? "Synthetic Signature Detected." : "Authentic Media Verified."}
                    </h3>
                  </div>
                  <div className="mt-6 md:mt-0">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 md:text-right font-semibold">Risk Score</div>
                    <div className="text-6xl md:text-8xl font-bold tracking-tighter leading-none text-white">
                      {analysisResult.aiProbability}<span className="text-4xl text-white/30 ml-1">%</span>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 font-semibold">Origin Model</h4>
                      <p className="text-2xl font-medium text-white">{analysisResult.toolPrediction}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 font-semibold">Manipulation Vector</h4>
                      <p className="text-2xl font-medium text-white">{analysisResult.manipulationType}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4 font-semibold">Groq Analyst Notes</h4>
                    <p className="text-white/70 text-lg leading-relaxed font-light border-l border-white/20 pl-6">"{analysisResult.explanation}"</p>
                    <div className="mt-8 space-y-3">
                      {analysisResult.flags.map((flag: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-white/50 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-white/20" />{flag}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-16 pt-8 border-t border-white/10 flex justify-end">
                  <button onClick={() => { setAnalysisResult(null); setFile(null); }} className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                    Reset Engine <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 5: FOOTER */}
      <footer className="bg-black py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] uppercase tracking-[0.2em] font-semibold text-white/30">
          <p>© {new Date().getFullYear()} Javino Authenticity Engine.</p>
          <div className="mt-6 md:mt-0 flex items-center gap-3">
            <span>Architected by</span>
            <span className="text-white">Sriram S</span>
            <span className="text-white/10">|</span>
            <span className="text-white">CEO & Software Developer</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
