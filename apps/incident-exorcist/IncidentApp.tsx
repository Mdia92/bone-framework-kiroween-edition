import React, { useState } from 'react';
import { generateIncidentSOP, IncidentResponse } from './api';
import { SOP } from '../../packages/shared/types';
import { AlertTriangle, Flame, ShieldAlert, Activity, Terminal, Lock, Target, Scan, History, RefreshCcw, Skull } from 'lucide-react';
import { HalloweenButton } from '../../components/HalloweenButton';

// Ghost Float Animation Component
const GhostFloat: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-float-up">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
        <path d="M40 10C30 10 25 18 25 28V50C25 52 23 54 21 54C19 54 17 52 17 50V54C17 58 20 60 23 60C25 60 27 58 27 56V54C29 54 31 52 31 50V54C31 58 34 60 37 60C39 60 41 58 41 56V54C43 54 45 52 45 50V54C45 58 48 60 51 60C53 60 55 58 55 56V54C57 54 59 52 59 50V54C59 58 62 60 65 60C68 60 71 58 71 54V50C71 52 69 54 67 54C65 54 63 52 63 50V28C63 18 58 10 48 10H40Z" fill="white" opacity="0.9"/>
        <circle cx="35" cy="28" r="3" fill="#0a0a0a"/>
        <circle cx="53" cy="28" r="3" fill="#0a0a0a"/>
        <path d="M35 38C35 38 38 42 44 42C50 42 53 38 53 38" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

// Summoning Circle Animation Component
const SummoningCircle: React.FC<{ stage: string }> = ({ stage }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative">
        <div className="w-32 h-32 border-4 border-exorcist-accent rounded-full animate-spin-slow opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-exorcist-accent font-bold uppercase tracking-wider animate-pulse">
            {stage}
          </span>
        </div>
      </div>
    </div>
  );
};

export const IncidentApp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [summoningStage, setSummoningStage] = useState('');
  const [showGhost, setShowGhost] = useState(false);
  
  // State for current view
  const [currentResult, setCurrentResult] = useState<IncidentResponse | null>(null);
  
  // State for Ghost of Incidents Past
  const [history, setHistory] = useState<IncidentResponse[]>([]);

  const handleSummonSOP = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setShowGhost(false);
    
    try {
      // Summoning animation stages
      setSummoningStage('Invoking Bone Marrow...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setSummoningStage('Binding Ribs...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setSummoningStage('Assembling Skeleton...');
      
      const result = await generateIncidentSOP(input);
      setCurrentResult(result);
      
      // Show ghost on success
      setShowGhost(true);
      setTimeout(() => setShowGhost(false), 2000);
      
      // Add to history (prevent duplicates by ID)
      setHistory(prev => {
        const exists = prev.find(h => h.sop.id === result.sop.id);
        if (exists) return prev;
        // Keep last 3
        return [result, ...prev].slice(0, 3);
      });
    } catch (err: any) {
      setError(err.message || "Exorcism failed.");
    } finally {
      setLoading(false);
      setSummoningStage('');
    }
  };

  const restoreFromHistory = (item: IncidentResponse) => {
    setCurrentResult(item);
  };

  const sop = currentResult?.sop;
  const health = currentResult?.boneHealth;

  return (
    <div className="min-h-screen bg-exorcist-dark text-red-50 p-6 font-mono border-l-8 border-exorcist-red flex flex-col md:flex-row gap-6 relative overflow-hidden">
      {/* Floating Embers Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="ember ember-1">🔥</div>
        <div className="ember ember-2">🎃</div>
        <div className="ember ember-3">🔥</div>
        <div className="ember ember-4">💀</div>
        <div className="ember ember-5">🎃</div>
      </div>
      
      <GhostFloat show={showGhost} />
      
      {/* LEFT COLUMN: Main App */}
      <div className="flex-1">
        <header className="mb-8 flex items-center justify-between relative">
          <div>
            <h1 className="text-4xl font-black text-exorcist-accent uppercase tracking-widest flex items-center gap-3 spooky-text">
              <Flame className="w-10 h-10 animate-pulse fire-flicker" />
              🎃 Summoning Circle 🎃
            </h1>
            <p className="text-red-400 opacity-70 mt-2">Incident Exorcist // Bone Framework // Digital Daemon 👻</p>
          </div>
          <div className="bg-exorcist-red/20 border border-exorcist-red px-4 py-2 rounded text-xs tracking-wider animate-pulse">
            STATUS: ACTIVE 🔥
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* INPUT SECTION - SUMMONING CIRCLE */}
          <section className="space-y-4">
            <div className="bg-black/40 p-6 rounded-lg border border-red-900/50 backdrop-blur-sm relative hover:border-red-700/70 transition-all">
              {loading && summoningStage && <SummoningCircle stage={summoningStage} />}
              <label className="block text-red-500 font-bold mb-2 flex items-center gap-2 spooky-text">
                <Terminal className="w-4 h-4" />
                INSCRIBE THE CHAOS 💀
              </label>
              <textarea
                className="w-full h-64 bg-black border border-red-900 rounded p-4 text-red-100 focus:outline-none focus:border-exorcist-accent focus:ring-1 focus:ring-exorcist-accent transition-all resize-none"
                placeholder="Drop your chaotic incident thread here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <div className="mt-4 flex justify-end">
                <div title="Bind chaos into a repeatable incident response ritual">
                  <HalloweenButton
                    onClick={handleSummonSOP}
                    disabled={!input}
                    loading={loading}
                    icon={loading ? Activity : ShieldAlert}
                    variant="exorcist"
                    className="px-8 py-3"
                  >
                    {loading ? 'BINDING...' : 'SUMMON SOP'}
                  </HalloweenButton>
                </div>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-950/50 border border-red-500 text-red-300 rounded text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            {/* X-RAY MODE */}
            {health && sop && (
              <div className="bg-black/80 p-6 rounded-lg border border-dashed border-zinc-700 relative overflow-hidden hover:border-zinc-600 transition-all">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Scan className="w-32 h-32 skull-float" />
                </div>
                <h3 className="text-xl font-bold text-zinc-300 mb-4 flex items-center gap-2 spooky-text">
                  <Scan className="w-5 h-5 text-exorcist-accent" /> 
                  X-RAY MODE 💀
                </h3>
                
                <div className="flex items-center gap-4 mb-4">
                  {sop.source === 'stub' ? (
                    <div className="px-3 py-1 rounded text-sm font-bold border bg-blue-900/20 border-blue-500 text-blue-400">
                      STABLE SKELETON (Fallback Mode)
                    </div>
                  ) : (
                    <div className={`px-3 py-1 rounded text-sm font-bold border ${health.status === 'SOLID' ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-orange-900/20 border-orange-500 text-orange-400'}`}>
                      {health.status === 'SOLID' ? 'SOLID BONE' : 'WEAK BONE'}
                    </div>
                  )}
                </div>

                {sop.source === 'stub' ? (
                  <p className="text-xs text-blue-400/70 italic">
                    Using a deterministic fallback SOP – no live AI for this ritual, but the skeleton still stands. 🎃
                  </p>
                ) : health.diagnostics.length > 0 ? (
                  <ul className="space-y-2">
                    {health.diagnostics.map((diag, i) => (
                      <li key={i} className="text-xs text-orange-300 flex items-start gap-2">
                        <span className="mt-0.5 block w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                        {diag}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-green-400/70 italic">
                    Structural integrity scan passed. No fractures detected.
                  </p>
                )}
              </div>
            )}
          </section>

          {/* OUTPUT SECTION - GRIMOIRE ENTRY */}
          <section>
            {sop ? (
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden shadow-2xl shadow-red-900/20 hover:shadow-red-900/40 transition-all">
                {/* Header */}
                <div className="bg-red-950/30 p-6 border-b border-red-900/30">
                  <div className="text-xs text-red-500/70 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Skull className="w-3 h-3 skull-float" />
                    Bound in the Grimoire 🔥
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white">{sop.title}</h2>
                      {sop.source === 'stub' && (
                        <div className="mt-2 inline-flex items-center gap-2 text-xs bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full border border-blue-700/50">
                          🎃 Fallback Mode: No API key detected
                        </div>
                      )}
                      {sop.source === 'llm' && (
                        <div className="mt-2 inline-flex items-center gap-2 text-xs bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full border border-purple-700/50">
                          ✨ Live AI Generated
                        </div>
                      )}
                    </div>
                    <span className="text-xs bg-red-900 text-red-100 px-2 py-1 rounded shrink-0">ID: {sop.id.slice(0,8)}</span>
                  </div>
                  <p className="text-zinc-400 mt-2">{sop.summary}</p>
                </div>

                {/* Triggers & Guardrails */}
                <div className="grid grid-cols-2 border-b border-zinc-800">
                  <div className="p-4 border-r border-zinc-800">
                    <h3 className="text-xs font-bold text-red-500 uppercase mb-2 flex items-center gap-2">
                      <Target className="w-3 h-3" /> Triggers
                    </h3>
                    <ul className="list-disc list-inside text-sm text-zinc-400">
                      {sop.triggers.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 bg-red-900/10">
                    <h3 className="text-xs font-bold text-exorcist-accent uppercase mb-2 flex items-center gap-2">
                      <Lock className="w-3 h-3" /> Guardrails
                    </h3>
                    <ul className="list-disc list-inside text-sm text-zinc-400">
                      {sop.guardrails.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                  </div>
                </div>
                
                {/* Steps */}
                <div className="p-6 space-y-6">
                  {sop.steps.map((step) => (
                    <div key={step.id} className="relative pl-8 border-l-2 border-zinc-800 hover:border-exorcist-accent transition-colors group hover:bg-zinc-800/30 rounded-r-lg pr-4 py-2">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-900 border-2 border-zinc-700 group-hover:border-exorcist-accent group-hover:bg-exorcist-red transition-all group-hover:scale-125"></div>
                      
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Step {step.order}</span>
                        <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">{step.phase}</span>
                        <span className="text-xs text-red-400 font-bold">{step.owner}</span>
                        {step.estimatedDuration && <span className="text-xs text-zinc-600">⏱ {step.estimatedDuration}</span>}
                        {/* Bone Density Indicator */}
                        <span className="text-xs bg-green-900/20 text-green-400 px-2 py-0.5 rounded border border-green-700/30 flex items-center gap-1">
                          🦴 Solid bone
                        </span>
                      </div>
                      
                      <h3 className="text-lg text-zinc-200">{step.action}</h3>
                      
                      {step.warning && (
                        <div className="mt-2 p-3 bg-red-900/20 border-l-2 border-red-500 text-red-200 text-sm flex gap-2 items-start">
                          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                          {step.warning}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-700 border-2 border-dashed border-zinc-800 rounded-lg p-12">
                <Activity className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-center max-w-sm">
                  Awaiting raw chaos input. The Daemon is dormant.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* RIGHT COLUMN: Ghosts of Incidents Past (Grimoire History) */}
      <div className="w-full md:w-64 shrink-0 border-l border-red-900/20 pl-6 md:block hidden">
        <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2 spooky-text">
          <History className="w-4 h-4 skull-float" />
          Ghosts of Incidents Past 👻
        </h3>
        
        <div className="space-y-4">
          {history.length === 0 && (
            <div className="text-xs text-zinc-600 italic">No previous hauntings recorded.</div>
          )}
          {history.map((item, idx) => (
            <div 
              key={item.sop.id} 
              onClick={() => restoreFromHistory(item)}
              className={`
                p-3 rounded border cursor-pointer transition-all hover:scale-105
                ${item.sop.id === sop?.id 
                  ? 'bg-red-900/20 border-exorcist-accent text-white shadow-lg shadow-red-900/30' 
                  : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 hover:bg-black/60'}
              `}
            >
              <div className="text-xs font-bold truncate mb-1">{item.sop.title}</div>
              <div className="text-[10px] opacity-60 flex justify-between">
                <span>{new Date(item.sop.generatedAt).toLocaleTimeString()}</span>
                <span className={item.boneHealth.status === 'SOLID' ? 'text-green-500' : 'text-orange-500'}>
                  {item.boneHealth.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};