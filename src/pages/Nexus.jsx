import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

export default function Nexus() {
  const [secsLeft, setSecsLeft] = useState(48 * 60 * 60);
  const [conviction, setConviction] = useState(18);
  const [caseOver, setCaseOver] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [cvHistory, setCvHistory] = useState([8, 12, 18]);
  const [subMeters, setSubMeters] = useState({ ev: 12, mw: 20, wi: 15 });
  const [actionStates, setActionStates] = useState(Array(9).fill(null));
  const [activityFeed, setActivityFeed] = useState([
    { ts: '02:38', src: 'DET.CHEN', cls: 'p', msg: 'Crime scene secured. Victim ID confirmed: Cole, J.', mcls: '' },
    { ts: '02:41', src: 'DR.WEBB', cls: 'f', msg: 'Forensic team deployed. Perimeter established.', mcls: 'ok' },
    { ts: '02:55', src: 'INTEL', cls: 'i', msg: 'Voss, D. flagged — known associate of victim.', mcls: 'wn' },
    { ts: '03:12', src: 'ADA', cls: 'l', msg: 'Reviewing probable cause for warrant applications.', mcls: '' }
  ]);
  const [chatMessages, setChatMessages] = useState([
    { ts: '03:14:00', type: 'nexus', text: 'Case file open. Suspect Voss, Dominic is flagged with prior organised crime connections and a documented relationship with victim Cole. Current conviction confidence is 18% — below the 75% threshold required for indictment. Deploy your team\'s investigation actions to build the case.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [outcomeData, setOutcomeData] = useState(null);
  
  const chatFeedRef = useRef(null);
  const feedRef = useRef(null);

  const ACTIONS = [
    { dept: 'DET. CHEN', cls: 'police-action', delta: 10, feed: 'CCTV footage analysed. Voss vehicle confirmed at Pier 14 at 01:47.', hint: "Warehouse CCTV places Voss's vehicle at the scene 3 minutes before the estimated time of death. This is direct physical placement evidence.", subEv: 8, subMw: 0, subWi: 0 },
    { dept: 'DR. WEBB', cls: 'forensic-action', delta: 14, feed: 'Ballistic match confirmed: shell casings linked to Voss-registered firearm.', hint: 'Ballistic analysis matches recovered shell casings to a .45 calibre weapon registered to Voss in 2039. The weapon has not been found, but the match is forensically significant.', subEv: 12, subMw: 0, subWi: 0 },
    { dept: 'DET. CHEN', cls: 'police-action', delta: 9, feed: 'Cell tower data places Voss within 400m of Pier 14 at 01:52.', hint: "Telecom records confirm Voss's phone pinged a tower adjacent to the crime scene at the time of death, corroborating the CCTV placement.", subEv: 6, subMw: 0, subWi: 4 },
    { dept: 'ADA VASQUEZ', cls: 'legal-action', delta: 5, feed: 'Search warrant granted. Execution authorised for Voss residence.', hint: "Magistrate Nkosi approved the search warrant. Teams are authorised to search Voss's registered address and impound his vehicle for forensic inspection.", subEv: 0, subMw: 3, subWi: 0 },
    { dept: 'DR. WEBB', cls: 'forensic-action', delta: 16, feed: "DNA match: trace skin cells under victim's fingernails — Voss, D. confirmed.", hint: "DNA extracted from under the victim's fingernails is a 99.7% match to Dominic Voss. This is the strongest physical evidence yet — indicative of a physical struggle.", subEv: 15, subMw: 0, subWi: 0 },
    { dept: 'INTEL', cls: 'intel-action', delta: 11, feed: 'Financial records: Cole owed Voss $240K. Payment overdue by 90 days.', hint: 'Forensic accounting reveals Cole had an outstanding $240,000 debt to a shell company controlled by Voss. The debt was flagged in communications as "unresolvable" 4 days prior to the murder.', subEv: 0, subMw: 14, subWi: 0 },
    { dept: 'DET. CHEN', cls: 'police-action', delta: 8, feed: "Delgado confirms she saw a man matching Voss's description leaving the warehouse.", hint: "Witness Rosa Delgado provides a partial ID of a man matching Voss's build and clothing exiting the warehouse at approximately 02:05. She is willing to testify.", subEv: 0, subMw: 0, subWi: 10 },
    { dept: 'MAGISTRATE NKOSI', cls: 'judge-action', delta: 6, feed: 'Prior record unsealed: Voss has 2 prior assault convictions, 1 weapons charge.', hint: 'Court records confirm Voss has two prior convictions for aggravated assault and one for unlicensed firearm possession. This pattern of behaviour strengthens the prosecution narrative.', subEv: 0, subMw: 7, subWi: 0 },
    { dept: 'INTEL', cls: 'intel-action', delta: 7, feed: 'Syndicate link confirmed: Voss ran enforcement ops for the Mercer network.', hint: 'Intelligence analysis connects Voss to at least 3 prior "debt resolution" incidents tied to the Mercer organised crime network, establishing a behavioural pattern consistent with contract violence.', subEv: 0, subMw: 8, subWi: 0 }
  ];

  // Timer
  useEffect(() => {
    if (caseOver) return;
    const interval = setInterval(() => {
      setSecsLeft(prev => {
        const next = prev - 120;
        if (next <= 0) {
          endCase(conviction >= 75 ? 'closed' : 'cold');
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [caseOver, conviction]);

  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [activityFeed]);

  const fmtHours = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const nowTS = () => {
    const n = new Date();
    return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}:${String(n.getSeconds()).padStart(2, '0')}`;
  };

  const addFeed = (src, cls, msg, mcls = '') => {
    const n = new Date();
    const ts = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
    setActivityFeed(prev => [...prev, { ts, src, cls, msg, mcls }]);
  };

  const updateConviction = (newVal) => {
    const clamped = Math.min(99, Math.max(0, newVal));
    setConviction(clamped);
    setCvHistory(prev => [...prev, parseFloat(clamped.toFixed(1))]);
  };

  const updateSubMeters = (dEv, dMw, dWi) => {
    setSubMeters(prev => ({
      ev: Math.min(99, Math.max(0, prev.ev + dEv)),
      mw: Math.min(99, Math.max(0, prev.mw + dMw)),
      wi: Math.min(99, Math.max(0, prev.wi + dWi))
    }));
  };

  const deployAction = async (idx) => {
    if (caseOver || isBusy || actionStates[idx]) return;
    
    const ac = ACTIONS[idx];
    setIsBusy(true);
    setActionStates(prev => { const n = [...prev]; n[idx] = 'processing'; return n; });
    
    addFeed(ac.dept, ac.dept.includes('WEBB') ? 'f' : ac.dept.includes('ADA') ? 'l' : ac.dept.includes('INTEL') ? 'i' : ac.dept.includes('NKOSI') ? 'j' : 'p', ac.feed, 'ok');
    setIsTyping(true);

    try {
      const newCV = Math.min(99, conviction + ac.delta);
      const prompt = `Investigation action completed by ${ac.dept}: "${ac.feed}". This increases conviction confidence by ${ac.delta}% — from ${conviction.toFixed(0)}% to ${newCV.toFixed(0)}%. ${ac.hint} Respond as the NEXUS advisory system in 2-3 sentences, acknowledging this finding and its legal/evidentiary significance.${newCV >= 75 ? ' The team has reached the indictment threshold. Acknowledge this with appropriate urgency.' : ''}`;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: 'gpt_5_mini'
      });

      setIsTyping(false);
      setChatMessages(prev => [...prev, { ts: nowTS(), type: 'nexus', text: res || 'Evidence logged. Case confidence updated.' }]);
    } catch {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { ts: nowTS(), type: 'nexus', text: `${ac.dept} action logged. Case strength updated. Continue building the evidentiary record.` }]);
    }

    setTimeout(() => {
      updateConviction(conviction + ac.delta);
      updateSubMeters(ac.subEv, ac.subMw, ac.subWi);
      setActionStates(prev => { const n = [...prev]; n[idx] = 'done-pos'; return n; });
      setIsBusy(false);
      if (conviction + ac.delta >= 75) {
        setTimeout(() => endCase('closed'), 1800);
      }
    }, 700);
  };

  const sendQuery = async () => {
    if (!chatInput.trim() || caseOver) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { ts: nowTS(), type: 'user', text: msg }]);
    setIsTyping(true);

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: msg,
        model: 'gpt_5_mini'
      });
      setIsTyping(false);
      setChatMessages(prev => [...prev, { ts: nowTS(), type: 'nexus', text: res || 'Processing your query. Please continue.' }]);
    } catch {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { ts: nowTS(), type: 'nexus', text: 'Network interruption. Resubmit your query to the advisory system.' }]);
    }
  };

  const endCase = (result) => {
    if (caseOver) return;
    setCaseOver(true);
    setOutcomeData({ result, finalCV: conviction.toFixed(0) });
    addFeed('NEXUS', 'j', result === 'closed' ? 'INDICTMENT FILED. Voss, D. charged. Case proceeding to trial.' : 'HOLD EXPIRED. Voss released. Case filed as cold.', result === 'closed' ? 'ok' : 'al');
  };

  const UI_ACTIONS = [
    { icon: '📷', dept: 'DET. CHEN · SURVEILLANCE', title: 'Pull Pier 14 CCTV footage — night of incident' },
    { icon: '🧬', dept: 'DR. WEBB · FORENSICS', title: 'Run ballistic analysis on recovered shell casings' },
    { icon: '📞', dept: 'DET. CHEN · DIGITAL', title: 'Subpoena Voss cell tower data — night of murder' },
    { icon: '💼', dept: 'ADA VASQUEZ · LEGAL', title: 'Obtain search warrant — Voss residence & vehicle' },
    { icon: '🩸', dept: 'DR. WEBB · FORENSICS', title: 'DNA analysis — trace evidence from crime scene' },
    { icon: '🗂️', dept: 'INTEL · FINANCIAL', title: "Trace Cole's financial dealings — Voss connection" },
    { icon: '🧑‍🤝‍🧑', dept: 'DET. CHEN · WITNESSES', title: 'Interview Delgado, R. — corroborate timeline' },
    { icon: '⚖️', dept: 'MAGISTRATE NKOSI · BENCH', title: 'Request prior conviction records — Voss, D.' },
    { icon: '🌐', dept: 'INTEL · ORGANISED CRIME', title: 'Cross-reference Voss with known crime syndicate ops' }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', fontFamily: 'var(--font-ui)', color: 'var(--text)' }}>
      {/* Noise & Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-[998] opacity-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.035\'/%3E%3C/svg%3E")' }}></div>
      <div className="fixed inset-0 pointer-events-none z-[997]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)' }}></div>

      <div className="max-w-[1500px] mx-auto px-3 pb-5 relative z-10">
        {/* Header */}
        <header className="flex items-stretch justify-between py-4 border-b gap-5" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col justify-center">
            <div className="font-display text-5xl tracking-[0.12em] leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--amber)', textShadow: '0 0 24px rgba(245,166,35,0.35)' }}>
              NEXUS
            </div>
            <div className="w-full h-0.5 my-1" style={{ background: 'linear-gradient(90deg, var(--amber), transparent)' }}></div>
            <div className="font-mono-tech text-[0.55rem] tracking-[0.18em]" style={{ color: 'var(--text-dim)' }}>
              INTEGRATED INVESTIGATION COMMAND · METROPOLITAN DISTRICT · NODE 4
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center gap-3">
            <div className="text-center px-5 py-2 border relative" style={{ borderColor: 'var(--amber-dim)', background: 'rgba(245,166,35,0.04)' }}>
              <div className="absolute w-2 h-2 border-t border-l" style={{ borderColor: 'var(--amber)', top: '-1px', left: '-1px' }}></div>
              <div className="absolute w-2 h-2 border-b border-r" style={{ borderColor: 'var(--amber)', bottom: '-1px', right: '-1px' }}></div>
              <div className="text-2xl tracking-[0.1em]" style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'var(--amber)' }}>
                CASE 2047-CR-0312
              </div>
              <div className="font-mono-tech text-[0.55rem] tracking-[0.15em]" style={{ color: 'var(--text-dim)' }}>
                OPERATION: HOLLOW POINT · CLASSIFIED ACTIVE
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-end gap-2">
            <div className="flex gap-2">
              <div className="font-mono-tech text-[0.56rem] px-2 py-1 border tracking-wider animate-pulse" style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>
                ● ACTIVE INVESTIGATION
              </div>
              <div className="font-mono-tech text-[0.56rem] px-2 py-1 border tracking-wider" style={{ borderColor: 'var(--amber-dim)', color: 'var(--amber)' }}>
                ⚠ SUSPECT AT LARGE
              </div>
            </div>
            <div className="flex gap-2">
              <div className="font-mono-tech text-[0.56rem] px-2 py-1 border tracking-wider" style={{ borderColor: 'var(--border2)', color: 'var(--green)' }}>
                ⬤ 5 FEEDS CONNECTED
              </div>
              <div className="font-mono-tech text-[0.56rem] px-2 py-1 border tracking-wider" style={{ borderColor: 'var(--border2)', color: 'var(--text-mid)' }}>
                LEAD: DET. CHEN · UNIT 7
              </div>
            </div>
          </div>
        </header>

        {/* Team Bar */}
        <div className="grid grid-cols-5 gap-px my-3 border" style={{ background: 'var(--border)', borderColor: 'var(--border)' }}>
          {[
            { emoji: '🕵️', name: 'Det. Sarah Chen', role: 'HOMICIDE · LEAD DETECTIVE', status: '● ON SCENE', cls: 'police', active: true },
            { emoji: '🔬', name: 'Dr. Marcus Webb', role: 'FORENSIC PATHOLOGIST', status: '● LAB — ACTIVE', cls: 'forensic', active: true },
            { emoji: '⚖️', name: 'ADA Priya Vasquez', role: 'ASST. DIST. ATTORNEY', status: '◐ REVIEW MODE', cls: 'law', active: false },
            { emoji: '🚔', name: 'Cpt. Ray Okafor', role: 'SWAT / TACTICAL LEAD', status: '● STANDING BY', cls: 'police', active: true },
            { emoji: '🏛️', name: 'Hon. Diana Nkosi', role: 'PRESIDING MAGISTRATE', status: '◐ WARRANT REVIEW', cls: 'judge', active: false }
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3 transition-colors cursor-default hover:bg-surface2" style={{ background: 'var(--surface)' }}>
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-base shrink-0 ${m.cls}`} style={{ borderColor: 'var(--border2)' }}>
                {m.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold leading-tight">{m.name}</div>
                <div className="font-mono-tech text-[0.52rem]" style={{ color: 'var(--text-dim)' }}>{m.role}</div>
                <div className={`font-mono-tech text-[0.5rem] ${m.active ? 'text-green' : 'text-amber'}`} style={{ color: m.active ? 'var(--green)' : 'var(--amber)' }}>
                  {m.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-[280px_1fr_300px] gap-3">
          {/* LEFT COLUMN - To be continued in next part due to length */}
          <div className="flex flex-col gap-3">
            {/* Incident Panel */}
            <div className="bg-surface border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border2)] to-transparent"></div>
              <div className="font-mono-tech text-[0.58rem] tracking-[0.2em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--red)', boxShadow: '0 0 5px var(--red)' }}></span>
                <strong style={{ color: 'var(--text-mid)' }}>INCIDENT FILE</strong>
              </div>
              <div className="w-full h-32 flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #0d1520, #111c28, #08090b)' }}>
                <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(245,166,35,0.015) 18px, rgba(245,166,35,0.015) 36px)' }}></div>
                <div className="relative z-10 w-18 h-18 border flex items-center justify-center text-4xl animate-pulse" style={{ borderColor: 'var(--amber-dim)', background: 'rgba(245,166,35,0.05)' }}>
                  🔫
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="text-lg tracking-wider mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>RIVERSIDE DISTRICT HOMICIDE</div>
                <div className="font-mono-tech text-[0.55rem] mb-3" style={{ color: 'var(--text-dim)' }}>CASE FILED: 2047.03.14 · 02:34 HRS</div>
                {[
                  { label: 'INCIDENT TYPE', value: 'HOMICIDE · 1ST DEGREE', color: 'var(--red)' },
                  { label: 'VICTIM', value: 'COLE, JAMES T.', color: null },
                  { label: 'LOCATION', value: 'PIER 14 WAREHOUSE', color: null },
                  { label: 'TOD ESTIMATE', value: '01:50 – 02:10 HRS', color: 'var(--amber)' },
                  { label: 'WEAPON', value: 'BALLISTIC · UNRECOVERED', color: 'var(--red)' },
                  { label: 'WITNESSES', value: '2 PARTIAL · UNVERIFIED', color: 'var(--amber)' },
                  { label: 'CASE STATUS', value: 'SUSPECT IDENTIFIED', color: 'var(--amber)' }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between py-1 border-b text-xs" style={{ borderColor: 'rgba(28,42,56,0.8)' }}>
                    <span className="font-mono-tech text-[0.56rem]" style={{ color: 'var(--text-dim)' }}>{row.label}</span>
                    <span className="font-semibold" style={{ color: row.color || 'var(--text)' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suspects */}
            <div className="bg-surface border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border2)] to-transparent"></div>
              <div className="font-mono-tech text-[0.58rem] tracking-[0.2em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--red)', boxShadow: '0 0 5px var(--red)' }}></span>
                <strong style={{ color: 'var(--text-mid)' }}>SUSPECT REGISTRY</strong>
              </div>
              <div className="p-2 flex flex-col gap-1.5">
                {[
                  { icon: '🎯', name: 'VOSS, DOMINIC R.', role: 'Organized crime · Fmr. enforcement', tag: 'PRIMARY', tcol: 'var(--red)', stripe: 'var(--red)', pri: true },
                  { icon: '👤', name: 'HUANG, FELIX', role: 'Logistics mgr · Port authority', tag: 'SECONDARY', tcol: 'var(--amber)', stripe: 'var(--amber)', sec: true },
                  { icon: '👁️', name: 'DELGADO, ROSA', role: 'Night shift worker · Pier 14', tag: 'WITNESS', tcol: 'var(--blue)', stripe: null },
                  { icon: '💀', name: 'COLE, JAMES T.', role: 'Import/export broker', tag: 'VICTIM', tcol: 'var(--purple)', stripe: null },
                  { icon: '✓', name: 'MORRISON, KYLE', role: 'Alibi verified — off-site', tag: 'CLEARED', tcol: 'var(--green)', stripe: 'var(--green)' }
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-2 border cursor-pointer transition-all relative" style={{ borderColor: s.pri ? 'rgba(232,57,74,0.3)' : s.sec ? 'rgba(245,166,35,0.25)' : 'var(--border)' }}>
                    {s.stripe && <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: s.stripe }}></div>}
                    <div className="text-base">{s.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold">{s.name}</div>
                      <div className="font-mono-tech text-[0.5rem]" style={{ color: 'var(--text-dim)' }}>{s.role}</div>
                    </div>
                    <div className="font-mono-tech text-[0.46rem] px-1.5 py-0.5 border tracking-wider" style={{ color: s.tcol, borderColor: s.tcol }}>{s.tag}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conviction Meter */}
            <div className="bg-surface border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border2)] to-transparent"></div>
              <div className="font-mono-tech text-[0.58rem] tracking-[0.2em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)', boxShadow: '0 0 5px var(--green)' }}></span>
                <strong style={{ color: 'var(--text-mid)' }}>CONVICTION CONFIDENCE</strong>
              </div>
              <div className="px-4 py-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-5xl leading-none transition-colors" style={{ fontFamily: 'Bebas Neue, sans-serif', color: conviction >= 75 ? 'var(--green)' : conviction >= 45 ? 'var(--amber)' : 'var(--red)' }}>
                      {conviction.toFixed(0)}%
                    </div>
                    <div className="font-mono-tech text-[0.52rem] mt-1" style={{ color: 'var(--text-dim)' }}>CASE STRENGTH</div>
                  </div>
                  <div className="font-mono-tech text-[0.55rem] text-right" style={{ color: 'var(--text-dim)' }}>
                    INDICTMENT<br/>THRESHOLD: 75%
                  </div>
                </div>
                <div className="relative mb-2">
                  <div className="w-full h-5 border relative overflow-hidden" style={{ background: '#0a1018', borderColor: 'var(--border)' }}>
                    <div className="h-full transition-all duration-[1400ms] relative" style={{ 
                      width: `${conviction}%`,
                      background: conviction >= 75 ? 'linear-gradient(90deg,#1a4a2a,#27c97a)' : conviction >= 45 ? 'linear-gradient(90deg,#3a2a00,#f5a623)' : 'linear-gradient(90deg,#2a0810,#e8394a)'
                    }}>
                      <div className="absolute inset-0 animate-[shimmer_2s_linear_infinite]" style={{ background: 'linear-gradient(90deg,transparent 70%,rgba(255,255,255,0.15))' }}></div>
                    </div>
                    <div className="absolute w-px h-8 -top-1.5" style={{ left: '75%', background: 'var(--amber)', boxShadow: '0 0 6px var(--amber)' }}>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 font-mono-tech text-[0.48rem] whitespace-nowrap" style={{ color: 'var(--amber)' }}>INDICT</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { label: 'PHYSICAL EVIDENCE', val: subMeters.ev, cls: 'ev' },
                    { label: 'MOTIVE ESTABLISHED', val: subMeters.mw, cls: 'mw' },
                    { label: 'WITNESS CORROBORATION', val: subMeters.wi, cls: 'wi' }
                  ].map((sm, i) => (
                    <div key={i}>
                      <div className="flex justify-between font-mono-tech text-[0.55rem] mb-1" style={{ color: 'var(--text-dim)' }}>
                        <span>{sm.label}</span><span>{sm.val}%</span>
                      </div>
                      <div className="h-1.5 border" style={{ background: '#0a1018', borderColor: 'var(--border)' }}>
                        <div className="h-full transition-all duration-[1400ms]" style={{ 
                          width: `${sm.val}%`,
                          background: sm.cls === 'ev' ? 'linear-gradient(90deg,#1a5a80,var(--blue))' : sm.cls === 'mw' ? 'linear-gradient(90deg,#5a1a50,var(--purple))' : 'linear-gradient(90deg,#1a4a2a,var(--green))'
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`px-3 py-2 border text-center transition-all ${conviction >= 75 ? '' : 'animate-pulse'}`} style={{ 
                  borderColor: conviction >= 75 ? 'var(--green)' : conviction >= 50 ? 'var(--amber)' : 'var(--amber)',
                  background: conviction >= 75 ? 'rgba(39,201,122,0.06)' : conviction >= 50 ? 'rgba(245,166,35,0.04)' : 'rgba(245,166,35,0.04)'
                }}>
                  <div className="font-mono-tech text-[0.65rem] tracking-wider transition-colors" style={{ color: conviction >= 75 ? 'var(--green)' : conviction >= 50 ? 'var(--amber)' : 'var(--amber)' }}>
                    {conviction >= 75 ? '✓ THRESHOLD MET — READY TO FILE INDICTMENT' : conviction >= 50 ? '◑ PROGRESSING — ADDITIONAL EVIDENCE REQUIRED' : '⚠ INSUFFICIENT EVIDENCE — CANNOT PROCEED TO INDICTMENT'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN */}
          <div className="flex flex-col gap-3">
            {/* Investigation Actions */}
            <div className="bg-surface border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border2)] to-transparent"></div>
              <div className="font-mono-tech text-[0.58rem] tracking-[0.2em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--amber)', boxShadow: '0 0 5px var(--amber)' }}></span>
                <strong style={{ color: 'var(--text-mid)' }}>INVESTIGATION ACTIONS</strong> — DEPLOY TEAM RESOURCES
              </div>
              <div className="grid grid-cols-3 gap-2 p-3">
                {UI_ACTIONS.map((ui, idx) => {
                  const state = actionStates[idx];
                  const ac = ACTIONS[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => deployAction(idx)}
                      disabled={state !== null || isBusy}
                      className={`text-left px-3 py-3 border cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden ${ac.cls} ${state === 'processing' ? 'animate-pulse' : ''}`}
                      style={{ 
                        background: state === 'processing' ? 'rgba(245,166,35,0.04)' : state === 'done-pos' ? 'rgba(39,201,122,0.04)' : 'var(--surface2)',
                        borderColor: state === 'done-pos' ? 'var(--green)' : 'var(--border)'
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: ac.cls.includes('police') ? 'var(--blue)' : ac.cls.includes('forensic') ? 'var(--green)' : ac.cls.includes('legal') ? 'var(--purple)' : ac.cls.includes('judge') ? 'var(--amber)' : 'var(--red)' }}></div>
                      <div className="text-lg block mb-1">{ui.icon}</div>
                      <div className="font-mono-tech text-[0.48rem] tracking-wider mb-1" style={{ color: ac.cls.includes('police') ? 'var(--blue)' : ac.cls.includes('forensic') ? 'var(--green)' : ac.cls.includes('legal') ? 'var(--purple)' : ac.cls.includes('judge') ? 'var(--amber)' : 'var(--red)' }}>
                        {ui.dept}
                      </div>
                      <div className="text-[0.72rem] font-semibold leading-tight mb-2">{ui.title}</div>
                      {state === 'done-pos' && (
                        <div className="font-mono-tech text-[0.58rem]" style={{ color: 'var(--green)' }}>
                          ▲ +{ac.delta}% CONFIDENCE
                        </div>
                      )}
                      {!state && (
                        <div className="absolute bottom-2 right-2 font-mono-tech text-[0.46rem] tracking-wider opacity-40" style={{ color: 'var(--text-dim)' }}>
                          ► DEPLOY
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline Chart */}
            <div className="bg-surface border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border2)] to-transparent"></div>
              <div className="font-mono-tech text-[0.58rem] tracking-[0.2em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--blue)', boxShadow: '0 0 5px var(--blue)' }}></span>
                <strong style={{ color: 'var(--text-mid)' }}>CASE STRENGTH TIMELINE</strong>
              </div>
              <div className="px-4 py-3 flex items-end gap-1 h-24">
                {cvHistory.slice(-14).map((v, i) => {
                  const isCur = i === cvHistory.slice(-14).length - 1;
                  const hPct = Math.max(3, (v / 100) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div 
                        className="w-full min-h-[2px] transition-all duration-600"
                        style={{ 
                          height: `${hPct}%`,
                          background: isCur ? 'linear-gradient(to top,#102040,#3b9eff)' : v >= 75 ? 'linear-gradient(to top,#0e2a1a,#27c97a)' : v >= 45 ? 'linear-gradient(to top,#3a2a00,#f5a623)' : 'linear-gradient(to top,#2a0010,#e8394a)',
                          boxShadow: isCur ? '0 0 8px rgba(59,158,255,0.4)' : 'none'
                        }}
                        title={`${v}%`}
                      ></div>
                      <div className="font-mono-tech text-[0.46rem]" style={{ color: 'var(--text-dim)' }}>
                        {isCur ? 'NOW' : v.toFixed(0) + '%'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-surface border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border2)] to-transparent"></div>
              <div className="font-mono-tech text-[0.58rem] tracking-[0.2em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--amber)', boxShadow: '0 0 5px var(--amber)' }}></span>
                <strong style={{ color: 'var(--text-mid)' }}>TEAM ACTIVITY FEED</strong>
              </div>
              <div ref={feedRef} className="max-h-40 overflow-y-auto px-2 py-2 font-mono-tech text-[0.57rem]" style={{ scrollbarWidth: 'thin' }}>
                {activityFeed.map((f, i) => (
                  <div key={i} className="flex gap-2 px-2 py-1 border-b" style={{ borderColor: 'rgba(28,42,56,0.6)' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{f.ts}</span>
                    <span style={{ color: f.cls === 'p' ? 'var(--blue)' : f.cls === 'f' ? 'var(--green)' : f.cls === 'l' ? 'var(--purple)' : f.cls === 'j' ? 'var(--amber)' : 'var(--red)' }}>[{f.src}]</span>
                    <span style={{ color: f.mcls === 'al' ? 'var(--red)' : f.mcls === 'ok' ? 'var(--green)' : f.mcls === 'wn' ? 'var(--amber)' : 'var(--text)' }}>{f.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-3">
            {/* Case Clock */}
            <div className="bg-surface border relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border2)] to-transparent"></div>
              <div className="font-mono-tech text-[0.58rem] tracking-[0.2em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--amber)', boxShadow: '0 0 5px var(--amber)' }}></span>
                <strong style={{ color: 'var(--text-mid)' }}>INVESTIGATION WINDOW</strong>
              </div>
              <div className="px-4 py-4 flex flex-col items-center gap-2">
                <div className={`text-6xl tracking-wider text-center transition-colors ${secsLeft < 14400 ? 'animate-pulse' : ''}`} style={{ 
                  fontFamily: 'Bebas Neue, sans-serif',
                  color: secsLeft < 14400 ? 'var(--red)' : 'var(--amber)',
                  textShadow: secsLeft < 14400 ? '0 0 20px rgba(232,57,74,0.6)' : '0 0 20px rgba(245,166,35,0.4)'
                }}>
                  {fmtHours(secsLeft)}
                </div>
                <div className="font-mono-tech text-[0.53rem] tracking-[0.16em]" style={{ color: 'var(--text-dim)' }}>
                  HOURS REMAINING · 48HR HOLD LIMIT
                </div>
                <div className="w-full h-1 overflow-hidden" style={{ background: '#0a1018' }}>
                  <div className="h-full transition-all duration-1000" style={{ width: `${(secsLeft / (48 * 60 * 60)) * 100}%`, background: 'linear-gradient(90deg,var(--amber),#ffcc44)' }}></div>
                </div>
                <div className="w-full mt-2">
                  {[
                    { label: 'SCENE SECURED', time: '02:34', done: true, active: false },
                    { label: 'SUSPECT IDENTIFIED', time: '03:10', done: true, active: false },
                    { label: 'EVIDENCE COLLECTION', time: 'NOW', done: false, active: true },
                    { label: 'WARRANT & ARREST', time: 'T+24HR', done: false, active: false },
                    { label: 'INDICTMENT / CHARGE', time: 'T+48HR', done: false, active: false }
                  ].map((ph, i) => (
                    <div key={i} className="flex items-center gap-2 py-1 border-b font-mono-tech text-[0.57rem]" style={{ borderColor: 'rgba(28,42,56,0.5)' }}>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${ph.active ? 'animate-pulse' : ''}`} style={{ 
                        background: ph.done ? 'var(--green)' : ph.active ? 'var(--amber)' : 'var(--border2)',
                        boxShadow: ph.done ? '0 0 4px var(--green)' : ph.active ? '0 0 5px var(--amber)' : 'none'
                      }}></div>
                      <span className={`flex-1 ${ph.done ? 'line-through' : ''}`} style={{ color: ph.active ? 'var(--amber)' : 'var(--text-dim)' }}>{ph.label}</span>
                      <span className="text-[0.5rem]" style={{ color: 'var(--text-dim)' }}>{ph.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* NEXUS Advisory */}
            <div className="bg-surface border relative overflow-hidden flex flex-col flex-1" style={{ borderColor: 'var(--border)' }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border2)] to-transparent"></div>
              <div className="font-mono-tech text-[0.58rem] tracking-[0.2em] px-4 py-2 border-b flex items-center gap-2" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--amber)', boxShadow: '0 0 5px var(--amber)' }}></span>
                <strong style={{ color: 'var(--text-mid)' }}>NEXUS ADVISORY SYSTEM</strong>
              </div>
              <div className="px-4 py-4 border-b flex flex-col items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                <div className="flex gap-2 justify-center flex-wrap">
                  {[
                    { emoji: '🕵️', cls: 'police-b' },
                    { emoji: '🔬', cls: 'forensic-b' },
                    { emoji: '⚖️', cls: 'legal-b' },
                    { emoji: '🏛️', cls: 'judge-b' }
                  ].map((b, i) => (
                    <div key={i} className={`w-10 h-10 rounded border flex items-center justify-center text-lg relative ${b.cls}`} style={{ borderColor: 'var(--border2)' }}>
                      {b.emoji}
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full border animate-pulse" style={{ background: 'var(--green)', borderColor: 'var(--bg)' }}></div>
                    </div>
                  ))}
                </div>
                <div className="font-mono-tech text-[0.62rem] tracking-[0.15em]" style={{ color: 'var(--amber)' }}>MULTI-AGENCY AI COORDINATION</div>
                <div className="font-mono-tech text-[0.5rem] text-center" style={{ color: 'var(--text-dim)' }}>NEXUS synthesises input from all active team members</div>
              </div>
              <div ref={chatFeedRef} className="flex-1 px-3 py-3 overflow-y-auto flex flex-col gap-2 max-h-64" style={{ scrollbarWidth: 'thin' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i}>
                    <div className="font-mono-tech text-[0.47rem] mb-0.5" style={{ color: 'var(--text-dim)' }}>{msg.ts}</div>
                    <div className={`px-2.5 py-2 text-[0.69rem] leading-relaxed ${msg.type === 'user' ? 'text-right border-r-2' : 'border-l-2'}`} style={{
                      background: msg.type === 'nexus' ? 'rgba(245,166,35,0.04)' : 'rgba(255,255,255,0.02)',
                      border: msg.type === 'nexus' ? '1px solid rgba(245,166,35,0.18)' : '1px solid var(--border)',
                      borderLeftWidth: msg.type === 'nexus' ? '2px' : '1px',
                      borderRightWidth: msg.type === 'user' ? '2px' : '1px',
                      borderLeftColor: msg.type === 'nexus' ? 'var(--amber)' : 'var(--border)',
                      borderRightColor: msg.type === 'user' ? 'var(--text-dim)' : 'var(--border)',
                      color: msg.type === 'user' ? 'var(--text-mid)' : 'var(--text)'
                    }}>
                      {msg.type === 'nexus' && <div className="font-mono-tech text-[0.5rem] font-semibold mb-1" style={{ color: 'var(--amber)' }}>NEXUS ADVISORY</div>}
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="px-2.5 py-2 border border-l-2" style={{ background: 'rgba(245,166,35,0.03)', borderColor: 'rgba(245,166,35,0.15)', borderLeftColor: 'var(--amber)' }}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--amber)', animationDelay: `${i * 0.2}s` }}></div>
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
                  onKeyDown={e => e.key === 'Enter' && sendQuery()}
                  placeholder="Query the advisory system…"
                  className="flex-1 px-2.5 py-2 border font-mono-tech text-[0.63rem] outline-none transition-colors"
                  style={{ background: 'rgba(245,166,35,0.03)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
                <button
                  onClick={sendQuery}
                  className="px-3 py-2 border font-mono-tech text-[0.54rem] tracking-wider cursor-pointer transition-all"
                  style={{ background: 'rgba(245,166,35,0.1)', borderColor: 'var(--amber-dim)', color: 'var(--amber)' }}
                >
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Outcome Overlay */}
      {outcomeData && (
        <div className="fixed inset-0 z-[600] flex flex-col items-center justify-center gap-5" style={{ background: outcomeData.result === 'closed' ? 'rgba(0,20,10,0.96)' : 'rgba(20,5,0,0.96)' }}>
          <div className="text-8xl tracking-[0.15em] text-center animate-[oIn_0.5s_ease-out]" style={{ 
            fontFamily: 'Bebas Neue, sans-serif',
            color: outcomeData.result === 'closed' ? 'var(--green)' : 'var(--red)',
            textShadow: outcomeData.result === 'closed' ? '0 0 40px rgba(39,201,122,0.8)' : '0 0 40px rgba(232,57,74,0.8)'
          }}>
            {outcomeData.result === 'closed' ? 'CASE CLOSED' : 'CASE COLD'}
          </div>
          <div className="font-mono-tech text-xs tracking-[0.18em] text-center" style={{ color: 'var(--text-dim)' }}>
            {outcomeData.result === 'closed' ? 'INDICTMENT THRESHOLD MET · VOSS, D. CHARGED WITH MURDER 1ST DEGREE' : '48HR HOLD EXPIRED · INSUFFICIENT EVIDENCE · SUSPECT RELEASED'}
          </div>
          <div className="text-3xl text-center" style={{ fontFamily: 'Bebas Neue, sans-serif', color: outcomeData.result === 'closed' ? 'var(--green)' : 'var(--red)' }}>
            {outcomeData.result === 'closed' ? 'CONVICTION CONFIDENCE' : 'FINAL CONVICTION CONFIDENCE'}: {outcomeData.finalCV}%
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-3 border font-mono-tech text-sm tracking-wider cursor-pointer transition-all"
            style={{ background: 'transparent', borderColor: 'var(--text-dim)', color: 'var(--text-dim)' }}
          >
            ↺ NEW CASE
          </button>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
        @keyframes oIn { from{transform:scale(1.4);opacity:0} to{transform:scale(1);opacity:1} }
        .police { background: rgba(59,158,255,0.1); border-color: rgba(59,158,255,0.3); }
        .law { background: rgba(155,89,255,0.1); border-color: rgba(155,89,255,0.3); }
        .judge { background: rgba(245,166,35,0.1); border-color: rgba(245,166,35,0.3); }
        .forensic { background: rgba(39,201,122,0.1); border-color: rgba(39,201,122,0.3); }
        .police-b { background: rgba(59,158,255,0.08); border-color: rgba(59,158,255,0.3); }
        .legal-b { background: rgba(155,89,255,0.08); border-color: rgba(155,89,255,0.3); }
        .judge-b { background: rgba(245,166,35,0.08); border-color: rgba(245,166,35,0.3); }
        .forensic-b { background: rgba(39,201,122,0.08); border-color: rgba(39,201,122,0.3); }
      `}</style>
    </div>
  );
}