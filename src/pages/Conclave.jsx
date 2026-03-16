import React, { useState } from "react";

export default function Conclave() {
  const [certainty, setCertainty] = useState(42.8);
  const [evidenceType, setEvidenceType] = useState('forensic');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [intelFeed, setIntelFeed] = useState([
    { tag: 'FORENSICS', msg: 'CCTV Footage recovered from 4th & Main. Target identified.' },
    { tag: 'INTERROGATION', msg: 'Witness testimony corroborates presence of secondary suspect.' }
  ]);
  const [maddoxLog, setMaddoxLog] = useState('[WAITING FOR DATA]... \n\nCouncil, the current certainty rating is insufficient for a legal verdict. Please provide primary forensic links.');

  const submitToConclave = () => {
    if (!evidenceDesc.trim()) return;

    // Add to intel feed
    setIntelFeed(prev => [
      { tag: evidenceType.toUpperCase(), msg: evidenceDesc },
      ...prev
    ]);

    // Update certainty
    const boost = Math.random() * 15;
    const newCertainty = Math.min(99.9, certainty + boost);
    setCertainty(newCertainty);

    // Generate Maddox feedback
    let feedback = "";
    if (evidenceType === 'forensic') {
      feedback = "DNA/Physical markers accepted. Error margin reduced by 0.04%.";
    } else if (evidenceType === 'digital') {
      feedback = "Network nodes confirmed. Timeline consistency increased.";
    } else if (evidenceType === 'testimony') {
      feedback = "Subjective data received. Weighting adjusted according to legal precedent.";
    } else {
      feedback = "Psychological profile integrated. Behavioral pattern analysis updated.";
    }

    setMaddoxLog(`[MADDOX]: ${feedback}\n\nVerdict probability has reached ${newCertainty.toFixed(1)}%. Continue investigation.`);
    setEvidenceDesc('');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' }}></div>

      {/* Header */}
      <header className="h-[70px] border-b-2 flex items-center px-8 justify-between relative z-20" style={{ 
        background: 'linear-gradient(90deg, var(--judge-blue), var(--bg))',
        borderColor: 'var(--gold)',
        boxShadow: '0 0 30px rgba(255, 204, 0, 0.2)'
      }}>
        <div>
          <div className="font-hud tracking-[0.5em] font-black text-2xl" style={{ color: 'var(--gold)' }}>
            MERCY // JUSTICE CONCLAVE
          </div>
          <div className="text-[0.6rem] tracking-[0.15em] mt-1" style={{ color: 'var(--text)' }}>
            AUTHORITY LEVEL: HIGH JUDGE // REGION: LA-04
          </div>
        </div>
        <div className="text-right font-mono-tech text-sm">
          SESSION_TOKEN: 77-B91 <br/>
          <span style={{ color: 'var(--gold)' }}>STATUS: ADJUDICATING</span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-[350px_1fr_380px] gap-4 p-5 flex-grow relative z-10">
        
        {/* LEFT: Field Intel Stream */}
        <div className="bg-panel border flex flex-col relative" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-2 font-hud text-[0.7rem] tracking-[0.15em] flex justify-between" style={{ background: 'var(--border)', color: '#fff' }}>
            <span>FIELD_INTEL_STREAM</span>
            <span>LIVE</span>
          </div>
          <div className="p-4 overflow-y-auto flex-grow">
            {intelFeed.map((item, i) => (
              <div key={i} className="border-b py-2.5 text-sm" style={{ borderColor: 'rgba(0, 212, 255, 0.2)' }}>
                <span className="font-mono-tech text-[0.6rem] uppercase" style={{ color: 'var(--police-blue)' }}>
                  [{item.tag}]
                </span>
                <br/>
                {item.msg}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: The Scales (Data Synthesis) */}
        <div className="bg-panel border flex flex-col items-center justify-center px-10 py-12 text-center relative" style={{ borderColor: 'var(--border)' }}>
          {/* Certainty Gauge */}
          <div className="w-[280px] h-[280px] rounded-full border-4 flex flex-col items-center justify-center mb-8 relative" style={{ 
            borderStyle: 'double',
            borderColor: 'var(--gold)',
            boxShadow: '0 0 50px rgba(255, 204, 0, 0.1), inset 0 0 30px rgba(0, 212, 255, 0.05)'
          }}>
            <div className="font-hud text-6xl font-black" style={{ color: 'var(--gold)', textShadow: '0 0 15px var(--gold)' }}>
              {certainty.toFixed(1)}%
            </div>
            <div className="text-[0.7rem] tracking-[0.2em] mt-2" style={{ color: 'var(--gold)' }}>
              VERDICT CERTAINTY
            </div>
            <div className="text-[0.5rem] mt-3" style={{ color: 'var(--text)' }}>
              THRESHOLD FOR CONVICTION: 99.9%
            </div>
          </div>

          {/* Input Group */}
          <div className="w-full max-w-[500px] mt-5">
            <div className="text-[0.7rem] mb-2.5 text-left tracking-wider" style={{ color: 'var(--police-blue)' }}>
              SUBMIT OFFICIAL RECORD:
            </div>
            <select 
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value)}
              className="w-full px-3 py-3 mb-2.5 font-mono-tech text-sm"
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--gold)', color: 'var(--gold)' }}
            >
              <option value="forensic">FORENSIC (Physical/DNA)</option>
              <option value="digital">DIGITAL (Logs/Pings)</option>
              <option value="testimony">TESTIMONY (Affidavits)</option>
              <option value="motive">MOTIVE (Psychological Profile)</option>
            </select>
            <input 
              type="text"
              value={evidenceDesc}
              onChange={(e) => setEvidenceDesc(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitToConclave()}
              placeholder="Summary of findings..."
              className="w-full px-3 py-3 mb-2.5 font-mono-tech text-sm"
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--gold)', color: 'var(--gold)' }}
            />
            <button
              onClick={submitToConclave}
              className="w-full px-3 py-3 font-mono-tech font-bold cursor-pointer transition-all"
              style={{ background: 'var(--gold)', color: '#000', border: '1px solid var(--gold)' }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 20px var(--gold)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              VALIDATE & INJECT TO MADDOX
            </button>
          </div>
        </div>

        {/* RIGHT: Maddox Consultant */}
        <div className="bg-panel border flex flex-col relative" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-2 font-hud text-[0.7rem] tracking-[0.15em] flex justify-between items-center" style={{ background: 'var(--border)', color: '#fff' }}>
            <span>MADDOX_CONSULTANT_V8</span>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--gold)', boxShadow: '0 0 5px var(--gold)' }}></span>
          </div>
          <div className="p-5 font-mono-tech text-[0.8rem] leading-relaxed">
            {/* Maddox Portrait */}
            <div className="h-[150px] border mb-5 flex items-center justify-center overflow-hidden" style={{ 
              background: 'linear-gradient(to bottom, transparent, var(--judge-blue))',
              borderColor: 'var(--gold)'
            }}>
              <div className="w-full h-12 opacity-50" style={{ 
                background: 'repeating-linear-gradient(90deg, var(--gold) 0px, transparent 2px, transparent 4px, var(--gold) 6px)',
                filter: 'brightness(1.5)'
              }}></div>
            </div>

            {/* Maddox Log */}
            <div style={{ color: 'var(--text)' }} className="whitespace-pre-line">
              {maddoxLog}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}