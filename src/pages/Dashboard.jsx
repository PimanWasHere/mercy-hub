import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [guiltProb, setGuiltProb] = useState(97.5);
  const [timeLeft, setTimeLeft] = useState(5400); // 90 minutes
  const [trialOver, setTrialOver] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', time: '08:14:02', text: 'Detective Raven. Trial has commenced. Current guilt probability: 97.5%. You have 90 minutes to reduce this below 92.0%. Submit evidence using the action panel, or address the court directly.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [probHistory, setProbHistory] = useState([99.2, 98.8, 97.5]);
  const [logs, setLogs] = useState([
    { ts: '08:14', src: 'COURT', msg: 'Trial initiated. Case #MC-2047-0891', cls: 'i' },
    { ts: '08:15', src: 'SURV', msg: 'Doorbell cam footage ingested', cls: '' },
    { ts: '08:17', src: 'FORN', msg: "Blood type match confirmed: victim's", cls: 'a' },
    { ts: '08:22', src: 'EMAIL', msg: 'Victim email archive accessed', cls: 'i' }
  ]);
  const [verdictData, setVerdictData] = useState(null);
  const [evidenceStates, setEvidenceStates] = useState(Array(9).fill(null));
  
  const chatFeedRef = useRef(null);

  const EVIDENCE = [
    { delta: +1.8, cls: 'resolved-bad', log: 'Blood evidence context reviewed. Source contamination ruled out.', hint: "The blood evidence on defendant's clothing remains highly incriminating with no alternative source confirmed. Guilt weight increases." },
    { delta: -3.2, cls: 'resolved-good', log: 'Victim email archive decrypted. Chemical theft report filed 3 days pre-murder.', hint: 'Victim Nicole Raven filed an internal report on stolen industrial chemicals days before her death. This establishes an independent motive chain.' },
    { delta: -4.8, cls: 'resolved-good', log: 'Social media scan complete. Unknown individual detected in Raven residence basement.', hint: "Daughter Britt Raven's posts confirm an unidentified individual was hiding in the defendant's basement since a recent barbecue. Facial recognition underway." },
    { delta: -2.1, cls: 'resolved-good', log: 'Financial records flagged: Charles, H. — $28,400 cash withdrawal. Unexplained.', hint: 'Holt Charles has significant unexplained financial activity correlated with the stolen chemicals timeline, suggesting an independent criminal operation.' },
    { delta: -5.5, cls: 'resolved-good', log: 'Parking lot footage retrieved. Nelson, R. exits neighbor trunk at 02:31.', hint: 'Robert Nelson was observed exiting a vehicle trunk in the early morning hours near the crime scene. This is highly suspicious and shifts culpability.' },
    { delta: -6.8, cls: 'resolved-good', log: 'Nelson property search: stolen compounds + bomb schematics recovered.', hint: "Stolen industrial compounds and detailed bomb construction plans recovered from Nelson's property. This materially shifts culpability away from the defendant." },
    { delta: -4.1, cls: 'resolved-good', log: "Cell tower ping places Nelson at victim residence at 02:08 night of murder.", hint: "Telecom records confirm Nelson's phone connected to a tower adjacent to the victim's residence at the estimated time of death." },
    { delta: +2.5, cls: 'resolved-bad', log: 'Psych profile flagged: alcohol-related aggression incidents on record.', hint: "The defendant's psychological profile reveals documented episodes of aggression correlated with alcohol relapse, elevating behavioral risk probability." },
    { delta: -3.6, cls: 'resolved-good', log: 'Webb, D. execution record retrieved. Nelson, R. confirmed as brother. Motive: revenge.', hint: 'David Webb — Nelson's brother — was previously executed by Mercy Court. This establishes a clear revenge motive against both the defendant and the justice system.' }
  ];

  const EVIDENCE_UI = [
    { icon: '🩸', type: 'FORENSIC · PHYSICAL', title: 'Review blood evidence context', flagged: true },
    { icon: '💼', type: 'DIGITAL · WORK EMAIL', title: "Access victim's stolen chemicals report", flagged: false },
    { icon: '📲', type: 'SOCIAL MEDIA · SCAN', title: "Analyze Britt Raven's recent posts", flagged: false },
    { icon: '💰', type: 'FINANCIAL · RECORDS', title: 'Pull Holt Charles financial history', flagged: false },
    { icon: '📹', type: 'SURVEILLANCE · PARKING LOT', title: 'Retrieve neighbor parking lot footage', flagged: false },
    { icon: '🔬', type: 'FORENSIC · CHEMICAL', title: 'Search Nelson property for stolen compounds', flagged: false },
    { icon: '📞', type: 'TELECOM · CELL TOWER', title: "Cross-check Nelson's phone location night of murder", flagged: false },
    { icon: '🔴', type: 'PSYCH EVAL · BEHAVIORAL', title: 'Run defendant psychological profile', flagged: true },
    { icon: '🏛️', type: 'COURT RECORD · HISTORY', title: 'Pull Webb, D. prior execution records', flagged: false }
  ];

  // Timer
  useEffect(() => {
    if (trialOver) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          endTrial(guiltProb > 92 ? 'guilty' : 'innocent');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [trialOver, guiltProb]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const nowTS = () => {
    const n = new Date();
    return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}:${String(n.getSeconds()).padStart(2, '0')}`;
  };

  const addLog = (src, msg, cls = '') => {
    const n = new Date();
    const ts = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
    setLogs(prev => [...prev, { ts, src, msg, cls }]);
  };

  const updateGuiltProb = (newVal) => {
    const clamped = Math.min(99.9, Math.max(70, newVal));
    setGuiltProb(clamped);
    setProbHistory(prev => [...prev, parseFloat(clamped.toFixed(1))]);
  };

  const submitEvidence = async (idx) => {
    if (trialOver || isBusy || evidenceStates[idx]) return;
    
    const ev = EVIDENCE[idx];
    setIsBusy(true);
    setEvidenceStates(prev => { const n = [...prev]; n[idx] = 'processing'; return n; });
    
    addLog('EV', ev.log, ev.delta < 0 ? 'i' : 'a');
    setIsTyping(true);

    try {
      const newGP = parseFloat((guiltProb + ev.delta).toFixed(1));
      const dir = ev.delta < 0 ? 'decreases' : 'increases';
      const prompt = `Evidence just submitted to the court: "${ev.log}". This ${dir} guilt probability by ${Math.abs(ev.delta).toFixed(1)}% — from ${guiltProb.toFixed(1)}% to ${newGP.toFixed(1)}%. ${ev.hint} Respond as Judge Maddox in 2-3 crisp, authoritative sentences acknowledging this exact evidence and its probabilistic impact.${newGP <= 92 ? ' The defendant has crossed the acquittal threshold. Acknowledge this with gravity.' : ''}`;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: 'gpt_5_mini',
        response_json_schema: null
      });

      setIsTyping(false);
      setChatMessages(prev => [...prev, { type: 'ai', time: nowTS(), text: res || 'Evidence logged. Recalculating probability.' }]);
    } catch {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { type: 'ai', time: nowTS(), text: `Evidence indexed. ${ev.delta < 0 ? 'Exculpatory data noted. Probability revised.' : 'Incriminating data confirmed. Probability revised.'}` }]);
    }

    setTimeout(() => {
      updateGuiltProb(guiltProb + ev.delta);
      setEvidenceStates(prev => { const n = [...prev]; n[idx] = ev.cls; return n; });
      setIsBusy(false);
      if (guiltProb + ev.delta <= 92.0) {
        setTimeout(() => endTrial('innocent'), 1800);
      }
    }, 700);
  };

  const sendManualMessage = async () => {
    if (!chatInput.trim() || trialOver) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { type: 'user', time: nowTS(), text: msg }]);
    setIsTyping(true);

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: msg,
        model: 'gpt_5_mini'
      });
      setIsTyping(false);
      setChatMessages(prev => [...prev, { type: 'ai', time: nowTS(), text: res || 'Processing your inquiry. Please continue.' }]);
    } catch {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { type: 'ai', time: nowTS(), text: 'Network interruption. Resubmit your inquiry.' }]);
    }
  };

  const endTrial = (result) => {
    if (trialOver) return;
    setTrialOver(true);
    setVerdictData({
      result,
      finalGP: guiltProb.toFixed(1)
    });
    addLog('COURT', result === 'innocent' ? 'VERDICT: ACQUITTED — case dismissed' : 'VERDICT: GUILTY — sonic sentence enacted', result === 'innocent' ? 'i' : 'a');
  };

  const CIRC = 2 * Math.PI * 67;
  const gaugeOffset = CIRC * (1 - guiltProb / 100);
  const survMatch = Math.max(10, Math.min(99, guiltProb - 3));
  const alibiStrength = Math.max(5, Math.min(90, (100 - guiltProb) * 1.4));

  return (
    <div className="min-h-screen relative">
      <div className="grid-bg"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 pb-6 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-5 border-b relative" style={{ borderColor: 'var(--border)' }}>
          <div className="absolute bottom-[-2px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30"></div>
          <div>
            <div className="font-hud text-3xl font-black tracking-[0.3em]" style={{ color: 'var(--accent)', textShadow: '0 0 20px rgba(0,212,255,0.6)' }}>
              MER<span style={{ color: 'var(--accent2)', textShadow: '0 0 20px rgba(255,60,60,0.8)' }}>CY</span>
            </div>
            <span className="font-mono-tech text-[0.5rem] tracking-[0.2em]" style={{ color: 'var(--text-dim)' }}>
              CAPITAL COURT AI JUSTICE NETWORK · LOS ANGELES JURISDICTION · BUILD 7.4.1
            </span>
          </div>
          <div className="flex gap-3">
            <div className="font-mono-tech text-[0.6rem] px-2.5 py-1 border tracking-wider" style={{ borderColor: 'var(--border-bright)', color: 'var(--accent3)' }}>
              ● TRIAL IN PROGRESS
            </div>
            <div className="font-mono-tech text-[0.6rem] px-2.5 py-1 border tracking-wider" style={{ borderColor: 'var(--accent2)', color: 'var(--accent2)' }}>
              ⚠ SONIC BLAST ARMED
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-px my-3 border" style={{ background: 'var(--border)', borderColor: 'var(--border)' }}>
          <div className="bg-panel px-4 py-2.5 text-center">
            <span className="font-hud text-xl font-bold block" style={{ color: 'var(--accent)' }}>1,847</span>
            <span className="font-mono-tech text-[0.52rem] tracking-wider block mt-0.5" style={{ color: 'var(--text-dim)' }}>CASES TODAY</span>
          </div>
          <div className="bg-panel px-4 py-2.5 text-center">
            <span className="font-hud text-xl font-bold block" style={{ color: 'var(--accent3)' }}>72.3%</span>
            <span className="font-mono-tech text-[0.52rem] tracking-wider block mt-0.5" style={{ color: 'var(--text-dim)' }}>ACQUITTAL RATE</span>
          </div>
          <div className="bg-panel px-4 py-2.5 text-center">
            <span className="font-hud text-xl font-bold block" style={{ color: 'var(--accent2)' }}>4</span>
            <span className="font-mono-tech text-[0.52rem] tracking-wider block mt-0.5" style={{ color: 'var(--text-dim)' }}>EXECUTIONS TODAY</span>
          </div>
          <div className="bg-panel px-4 py-2.5 text-center">
            <span className="font-hud text-xl font-bold block" style={{ color: 'var(--warn)' }}>23</span>
            <span className="font-mono-tech text-[0.52rem] tracking-wider block mt-0.5" style={{ color: 'var(--text-dim)' }}>ACTIVE TRIALS</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-[290px_1fr_290px] gap-3">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-3">
            {/* Defendant Panel */}
            <div className="bg-panel border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent"></div>
              <div className="font-hud text-[0.58rem] tracking-[0.22em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent2)', boxShadow: '0 0 5px var(--accent2)' }}></span>
                DEFENDANT PROFILE
              </div>
              <div className="w-full h-[150px] flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg,#0a1a24,#0d2535,#060d14)' }}>
                <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(-45deg,transparent,transparent 10px,rgba(0,212,255,0.02) 10px,rgba(0,212,255,0.02) 20px)' }}></div>
                <div className="relative z-10 w-19 h-19 rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'var(--border-bright)', background: 'linear-gradient(135deg,#1a3a4a,#0a1a2a)', boxShadow: '0 0 18px rgba(0,212,255,0.3)' }}>
                  <svg className="w-11 h-11 opacity-70" viewBox="0 0 50 50" fill="none">
                    <circle cx="25" cy="17" r="9" stroke="#0099cc" strokeWidth="1.5"/>
                    <path d="M8 42c0-9.4 7.6-17 17-17s17 7.6 17 17" stroke="#0099cc" strokeWidth="1.5"/>
                  </svg>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="font-hud text-sm font-bold tracking-wider mb-1">RAVEN, CHRISTOPHER J.</div>
                <div className="font-mono-tech text-[0.58rem] mb-3" style={{ color: 'var(--text-dim)' }}>ID: LAPD-2031-4471 · DOB: 1989.03.14</div>
                {[
                  { label: 'CHARGE', value: 'MURDER · 1ST DEGREE', color: 'var(--accent2)' },
                  { label: 'OCCUPATION', value: 'DET. LAPD HOMICIDE', color: null },
                  { label: 'VICTIM', value: 'RAVEN, NICOLE M.', color: null },
                  { label: 'PRIOR RECORD', value: 'NONE', color: 'var(--accent3)' },
                  { label: 'THREAT LEVEL', value: 'MEDIUM', color: 'var(--warn)' },
                  { label: 'SOBRIETY', value: 'RELAPSE FLAGGED', color: 'var(--accent2)' }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between py-1 border-b text-xs" style={{ borderColor: 'rgba(14,58,82,0.4)' }}>
                    <span className="font-mono-tech text-[0.58rem]" style={{ color: 'var(--text-dim)' }}>{row.label}</span>
                    <span className="font-semibold" style={{ color: row.color || 'var(--text)' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Persons of Interest */}
            <div className="bg-panel border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent"></div>
              <div className="font-hud text-[0.58rem] tracking-[0.22em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--warn)', boxShadow: '0 0 5px var(--warn)' }}></span>
                PERSONS OF INTEREST
              </div>
              <div className="p-2 flex flex-col gap-1.5">
                {[
                  { icon: '👤', name: 'RAVEN, CHRISTOPHER', role: 'LAPD Homicide · Defendant', tag: 'DEFENDANT', tagColor: 'var(--accent)', suspect: false },
                  { icon: '🚨', name: 'NELSON, ROBERT', role: "AA Sponsor · Victim's co-worker", tag: 'SUSPECT', tagColor: 'var(--accent2)', suspect: true },
                  { icon: '👤', name: 'CHARLES, HOLT', role: "Victim's co-worker", tag: 'PERSON OF INT.', tagColor: 'var(--warn)', suspect: false },
                  { icon: '👤', name: 'BURKE, PATRICK', role: "Victim's associate", tag: 'WITNESS', tagColor: 'var(--warn)', suspect: false }
                ].map((poi, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5 border cursor-pointer transition-all" style={{ borderColor: poi.suspect ? 'rgba(255,60,60,0.5)' : 'var(--border)' }}>
                    <div className="text-sm">{poi.icon}</div>
                    <div className="flex-1">
                      <div className="text-[0.72rem] font-semibold">{poi.name}</div>
                      <div className="font-mono-tech text-[0.52rem]" style={{ color: 'var(--text-dim)' }}>{poi.role}</div>
                    </div>
                    <div className="font-mono-tech text-[0.48rem] px-1.5 py-0.5 border tracking-wider" style={{ color: poi.tagColor, borderColor: poi.tagColor }}>{poi.tag}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Log */}
            <div className="bg-panel border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent"></div>
              <div className="font-hud text-[0.58rem] tracking-[0.22em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 5px var(--accent)' }}></span>
                SYSTEM LOG
              </div>
              <div className="p-2 max-h-[180px] overflow-y-auto font-mono-tech text-[0.57rem]" style={{ scrollbarWidth: 'thin' }}>
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 px-2 py-1 border-b" style={{ borderColor: 'rgba(14,58,82,0.25)' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{log.ts}</span>
                    <span style={{ color: 'var(--accent)' }}>[{log.src}]</span>
                    <span style={{ color: log.cls === 'a' ? 'var(--accent2)' : log.cls === 'i' ? 'var(--accent3)' : 'var(--text)' }}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER COLUMN */}
          <div className="flex flex-col gap-3">
            {/* Guilt Meter */}
            <div className="bg-panel border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent"></div>
              <div className="font-hud text-[0.58rem] tracking-[0.22em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent2)', boxShadow: '0 0 5px var(--accent2)' }}></span>
                PROBABILITY OF GUILT — LIVE ANALYSIS
              </div>
              <div className="px-5 py-4 flex gap-6 items-center">
                <div className="relative w-40 h-40 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id="gGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff6600"/>
                        <stop offset="100%" stopColor="#ff2244"/>
                      </linearGradient>
                    </defs>
                    <circle cx="80" cy="80" r="67" fill="none" stroke="#0e2030" strokeWidth="13"/>
                    <circle 
                      cx="80" cy="80" r="67" 
                      fill="none" 
                      strokeWidth="13" 
                      strokeLinecap="butt"
                      stroke={guiltProb <= 92 ? '#00ff88' : guiltProb < 95 ? '#ff9f00' : 'url(#gGrad)'}
                      strokeDasharray={CIRC}
                      strokeDashoffset={gaugeOffset}
                      style={{ transition: 'stroke-dashoffset 1.4s ease, stroke 0.4s' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-hud text-[2.1rem] font-black leading-none transition-all" style={{ 
                      color: guiltProb <= 92 ? 'var(--accent3)' : guiltProb < 95 ? 'var(--warn)' : 'var(--accent2)',
                      textShadow: guiltProb <= 92 ? '0 0 18px rgba(0,255,136,0.5)' : guiltProb < 95 ? '0 0 18px rgba(255,159,0,0.5)' : '0 0 18px rgba(255,60,60,0.5)'
                    }}>
                      {guiltProb.toFixed(1)}%
                    </div>
                    <div className="font-mono-tech text-[0.5rem] tracking-wider mt-0.5" style={{ color: 'var(--text-dim)' }}>GUILT PROB.</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2.5">
                  {[
                    { label: 'CURRENT PROBABILITY', value: guiltProb.toFixed(1) + '%', width: guiltProb, cls: 'hi', showThreshold: true },
                    { label: 'PHYSICAL EVIDENCE WEIGHT', value: 'HIGH', width: 88, cls: 'hi', showThreshold: false },
                    { label: 'SURVEILLANCE MATCH', value: survMatch.toFixed(0) + '%', width: survMatch, cls: 'md', showThreshold: false },
                    { label: 'ALIBI STRENGTH', value: alibiStrength.toFixed(0) + '%', width: alibiStrength, cls: 'lo', showThreshold: false }
                  ].map((bar, i) => (
                    <div key={i}>
                      <div className="flex justify-between font-mono-tech text-[0.58rem] mb-1" style={{ color: 'var(--text-dim)' }}>
                        <span>{bar.label}</span><span>{bar.value}</span>
                      </div>
                      <div className="h-2 border relative" style={{ background: '#0a1a24', borderColor: 'var(--border)' }}>
                        <div 
                          className="h-full transition-all duration-[1400ms]" 
                          style={{
                            width: `${bar.width}%`,
                            background: bar.cls === 'hi' ? 'linear-gradient(90deg,#ff6600,#ff2244)' : bar.cls === 'md' ? 'linear-gradient(90deg,#ff9f00,#ffcc00)' : 'linear-gradient(90deg,#00aa55,#00ff88)',
                            boxShadow: bar.cls === 'hi' ? '0 0 7px rgba(255,34,68,0.4)' : 'none'
                          }}
                        ></div>
                        {bar.showThreshold && (
                          <div className="absolute w-0.5 h-4 -top-1" style={{ left: '92%', background: 'var(--warn)', boxShadow: '0 0 6px var(--warn)' }}>
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 font-mono-tech text-[0.48rem] whitespace-nowrap" style={{ color: 'var(--warn)' }}>92%</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className={`px-4 py-2 border text-center transition-all ${guiltProb > 92 ? 'animate-pulse' : ''}`} style={{ 
                    borderColor: guiltProb <= 92 ? 'var(--accent3)' : 'var(--accent2)',
                    background: guiltProb <= 92 ? 'rgba(0,255,136,0.06)' : 'rgba(255,34,68,0.05)'
                  }}>
                    <div className="font-hud text-[0.68rem] tracking-wider transition-colors" style={{ color: guiltProb <= 92 ? 'var(--accent3)' : 'var(--accent2)' }}>
                      {guiltProb <= 92 ? '✓ THRESHOLD REACHED — ACQUITTAL PROTOCOL INITIATED' : '⚠ MUST REACH ≤ 92.0% TO AVOID EXECUTION'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Grid */}
            <div className="bg-panel border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent"></div>
              <div className="font-hud text-[0.58rem] tracking-[0.22em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--warn)', boxShadow: '0 0 5px var(--warn)' }}></span>
                INVESTIGATION ACTIONS — CLICK TO SUBMIT EVIDENCE TO MADDOX
              </div>
              <div className="grid grid-cols-3 gap-2 p-3">
                {EVIDENCE_UI.map((ev, idx) => {
                  const state = evidenceStates[idx];
                  const evData = EVIDENCE[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => submitEvidence(idx)}
                      disabled={state !== null || isBusy}
                      className="bg-panel border text-left px-3 py-3 relative overflow-hidden transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ 
                        borderColor: state === 'processing' ? 'var(--warn)' : state === 'resolved-good' ? 'var(--accent3)' : state === 'resolved-bad' ? 'var(--accent2)' : ev.flagged ? 'rgba(255,60,60,0.4)' : 'var(--border)',
                        background: state === 'processing' ? 'rgba(255,159,0,0.04)' : state === 'resolved-good' ? 'rgba(0,255,136,0.04)' : state === 'resolved-bad' ? 'rgba(255,60,60,0.04)' : 'rgba(6,13,20,0.9)'
                      }}
                    >
                      <span className="text-lg block mb-1">{ev.icon}</span>
                      <div className="font-mono-tech text-[0.5rem] tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>{ev.type}</div>
                      <div className="text-[0.7rem] font-semibold leading-tight mb-1.5">{ev.title}</div>
                      {state && state !== 'processing' && (
                        <div className="font-mono-tech text-[0.58rem]" style={{ color: evData.delta < 0 ? 'var(--accent3)' : 'var(--accent2)' }}>
                          {evData.delta < 0 ? '▼ ' : '▲ +'}{Math.abs(evData.delta).toFixed(1)}% GUILT
                        </div>
                      )}
                      {!state && (
                        <div className="absolute bottom-2 right-2 font-mono-tech text-[0.46rem] tracking-wider opacity-45" style={{ color: 'var(--accent)' }}>
                          ► SUBMIT
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline Chart */}
            <div className="bg-panel border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent"></div>
              <div className="font-hud text-[0.58rem] tracking-[0.22em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 5px var(--accent)' }}></span>
                GUILT PROBABILITY TIMELINE
              </div>
              <div className="px-4 py-3 flex items-end gap-1 h-[88px]">
                {probHistory.slice(-14).map((v, i) => {
                  const isCur = i === probHistory.slice(-14).length - 1;
                  const height = Math.max(3, ((v - 85) / 15) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div 
                        className="w-full min-h-[2px] transition-all duration-600"
                        style={{ 
                          height: `${height}%`,
                          background: isCur ? 'linear-gradient(to top,#005580,var(--accent))' : v <= 92 ? 'linear-gradient(to top,#006630,#00ff88)' : v <= 95 ? 'linear-gradient(to top,#996600,#ffcc00)' : 'linear-gradient(to top,#aa1122,#ff2244)',
                          boxShadow: isCur ? '0 0 8px rgba(0,212,255,0.5)' : 'none'
                        }}
                        title={`${v}%`}
                      ></div>
                      <div className="font-mono-tech text-[0.46rem]" style={{ color: 'var(--text-dim)' }}>
                        {isCur ? 'NOW' : v.toFixed(0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-3">
            {/* Timer */}
            <div className="bg-panel border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent"></div>
              <div className="font-hud text-[0.58rem] tracking-[0.22em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--warn)', boxShadow: '0 0 5px var(--warn)' }}></span>
                TRIAL COUNTDOWN
              </div>
              <div className="px-5 py-5 flex flex-col items-center gap-3">
                <div className={`font-hud text-5xl font-black tracking-wider text-center transition-colors ${timeLeft < 600 ? 'animate-pulse' : ''}`} style={{ 
                  color: timeLeft < 600 ? 'var(--accent2)' : 'var(--warn)',
                  textShadow: timeLeft < 600 ? '0 0 20px rgba(255,34,68,0.7)' : '0 0 18px rgba(255,159,0,0.5)'
                }}>
                  {formatTime(timeLeft)}
                </div>
                <div className="font-mono-tech text-[0.55rem] tracking-[0.18em]" style={{ color: 'var(--text-dim)' }}>REMAINING · 90 MIN TOTAL</div>
                <div className="w-full h-1 overflow-hidden" style={{ background: '#0a1a24' }}>
                  <div className="h-full transition-all duration-1000" style={{ width: `${(timeLeft / 5400) * 100}%`, background: 'linear-gradient(90deg,var(--accent2),var(--warn))' }}></div>
                </div>
                <div className="w-full">
                  {[
                    { label: 'INITIAL ASSESSMENT', time: '00:00', done: true, active: false },
                    { label: 'EVIDENCE INTAKE', time: '12:30', done: true, active: false },
                    { label: 'ACTIVE INVESTIGATION', time: 'NOW', done: false, active: true },
                    { label: 'FINAL ANALYSIS', time: '80:00', done: false, active: false },
                    { label: 'VERDICT', time: '90:00', done: false, active: false }
                  ].map((phase, i) => (
                    <div key={i} className="flex items-center gap-2 py-1 border-b font-mono-tech text-[0.58rem]" style={{ borderColor: 'rgba(14,58,82,0.3)' }}>
                      <div className={`w-2 h-2 rounded-full ${phase.active ? 'animate-pulse' : ''}`} style={{ 
                        background: phase.done ? 'var(--accent3)' : phase.active ? 'var(--warn)' : '#1a3a50',
                        boxShadow: phase.done ? '0 0 4px var(--accent3)' : phase.active ? '0 0 5px var(--warn)' : 'none'
                      }}></div>
                      <span className={`flex-1 ${phase.done ? 'line-through' : ''}`} style={{ color: phase.active ? 'var(--warn)' : 'var(--text-dim)' }}>{phase.label}</span>
                      <span className="text-[0.5rem]" style={{ color: 'var(--text-dim)' }}>{phase.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Judge Chat */}
            <div className="bg-panel border relative overflow-hidden flex-1 flex flex-col" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border-bright)] to-transparent"></div>
              <div className="font-hud text-[0.58rem] tracking-[0.22em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 5px var(--accent)' }}></span>
                JUDGE MADDOX — AI PRESIDING
              </div>
              <div className="px-4 py-4 border-b flex flex-col items-center gap-3" style={{ borderColor: 'var(--border)' }}>
                <div className="w-17 h-17 rounded-full flex items-center justify-center text-3xl animate-pulse" style={{ 
                  background: 'radial-gradient(circle at 35% 35%,#1a5a7a,#051020)',
                  border: '2px solid var(--accent)',
                  boxShadow: '0 0 24px rgba(0,212,255,0.4)'
                }}>⚖️</div>
                <div className="font-hud text-sm tracking-[0.18em]" style={{ color: 'var(--accent)' }}>MADDOX v7.4</div>
                <div className="font-mono-tech text-[0.5rem] text-center" style={{ color: 'var(--text-dim)' }}>MERCY CAPITAL COURT JUDICIAL AI · CERTIFIED 2041</div>
              </div>
              <div ref={chatFeedRef} className="flex-1 px-3 py-3 overflow-y-auto flex flex-col gap-2 max-h-60" style={{ scrollbarWidth: 'thin' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i}>
                    <div className="font-mono-tech text-[0.48rem] mb-0.5" style={{ color: 'var(--text-dim)' }}>{msg.time}</div>
                    <div 
                      className={`px-2.5 py-2 text-[0.68rem] leading-relaxed ${msg.type === 'user' ? 'text-right border-r-2' : 'border-l-2'}`}
                      style={{
                        background: msg.type === 'ai' ? 'rgba(0,212,255,0.04)' : 'rgba(255,255,255,0.02)',
                        border: msg.type === 'ai' ? '1px solid rgba(0,212,255,0.15)' : '1px solid var(--border)',
                        borderLeftWidth: msg.type === 'ai' ? '2px' : '1px',
                        borderRightWidth: msg.type === 'user' ? '2px' : '1px',
                        borderLeftColor: msg.type === 'ai' ? 'var(--accent)' : 'var(--border)',
                        borderRightColor: msg.type === 'user' ? 'var(--text-dim)' : 'var(--border)',
                        color: msg.type === 'user' ? 'var(--text-dim)' : 'var(--text)'
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="px-2.5 py-2 border border-l-2" style={{ background: 'rgba(0,212,255,0.03)', borderColor: 'rgba(0,212,255,0.15)', borderLeftColor: 'var(--accent)' }}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: `${i * 0.2}s` }}></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-3 py-3 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendManualMessage()}
                  placeholder="Address the court directly…"
                  className="flex-1 bg-transparent border px-2.5 py-2 font-mono-tech text-[0.65rem] outline-none transition-colors"
                  style={{ background: 'rgba(0,212,255,0.03)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
                <button
                  onClick={sendManualMessage}
                  className="px-3 py-2 border font-mono-tech text-[0.56rem] tracking-wider cursor-pointer transition-all"
                  style={{ background: 'rgba(0,212,255,0.1)', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                >
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verdict Overlay */}
      <AnimatePresence>
        {verdictData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5"
            style={{ background: verdictData.result === 'innocent' ? 'rgba(0,22,10,0.96)' : 'rgba(35,0,0,0.96)' }}
          >
            <motion.div
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="font-hud text-7xl font-black tracking-[0.18em] text-center"
              style={{ 
                color: verdictData.result === 'innocent' ? 'var(--accent3)' : 'var(--accent2)',
                textShadow: verdictData.result === 'innocent' ? '0 0 40px rgba(0,255,136,0.9)' : '0 0 40px rgba(255,34,68,0.9)'
              }}
            >
              {verdictData.result === 'innocent' ? 'ACQUITTED' : 'EXECUTED'}
            </motion.div>
            <div className="font-mono-tech text-sm tracking-[0.2em] text-center" style={{ color: 'var(--text-dim)' }}>
              {verdictData.result === 'innocent' ? 'PROBABILITY THRESHOLD SATISFIED · DEFENDANT RELEASED' : 'PROBABILITY THRESHOLD NOT MET · SENTENCE CARRIED OUT'}
            </div>
            <div className="font-hud text-2xl font-bold text-center" style={{ color: verdictData.result === 'innocent' ? 'var(--accent3)' : 'var(--accent2)' }}>
              FINAL GUILT PROBABILITY: {verdictData.finalGP}%
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-6 py-3 border font-mono-tech text-sm tracking-wider cursor-pointer transition-all"
              style={{ background: 'transparent', borderColor: 'var(--text-dim)', color: 'var(--text-dim)' }}
            >
              ↺ NEW TRIAL
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}