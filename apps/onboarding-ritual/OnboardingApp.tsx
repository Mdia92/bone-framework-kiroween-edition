import React, { useState } from 'react';
import { generateOnboardingPlan } from './api';
import { SOP, SOPStep } from '../../packages/shared/types';
import { Scroll, Sparkles, BookOpen, Feather, PlayCircle, ChevronRight, ChevronLeft, StopCircle } from 'lucide-react';
import { HalloweenButton } from '../../components/HalloweenButton';

// Ghost Float Animation Component (Onboarding themed)
const GhostFloat: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-float-up">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
        <path d="M40 10C30 10 25 18 25 28V50C25 52 23 54 21 54C19 54 17 52 17 50V54C17 58 20 60 23 60C25 60 27 58 27 56V54C29 54 31 52 31 50V54C31 58 34 60 37 60C39 60 41 58 41 56V54C43 54 45 52 45 50V54C45 58 48 60 51 60C53 60 55 58 55 56V54C57 54 59 52 59 50V54C59 58 62 60 65 60C68 60 71 58 71 54V50C71 52 69 54 67 54C65 54 63 52 63 50V28C63 18 58 10 48 10H40Z" fill="#0d9488" opacity="0.9"/>
        <circle cx="35" cy="28" r="3" fill="white"/>
        <circle cx="53" cy="28" r="3" fill="white"/>
        <path d="M35 38C35 38 38 42 44 42C50 42 53 38 53 38" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
};

// Summoning Circle Animation Component
const SummoningCircle: React.FC<{ stage: string }> = ({ stage }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="relative">
        <div className="w-32 h-32 border-4 border-ritual-teal rounded-full animate-spin-slow opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-ritual-teal font-bold uppercase tracking-wider animate-pulse">
            {stage}
          </span>
        </div>
      </div>
    </div>
  );
};

export const OnboardingApp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sop, setSop] = useState<SOP | null>(null);
  const [summoningStage, setSummoningStage] = useState('');
  const [showGhost, setShowGhost] = useState(false);

  // Form State
  const [role, setRole] = useState('');
  const [tools, setTools] = useState('');
  const [goals, setGoals] = useState('');

  // Simulator State
  const [simMode, setSimMode] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(0);

  const handleRitual = async () => {
    if (!role || !tools) return;
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
      
      const result = await generateOnboardingPlan(role, tools, goals);
      setSop(result);
      
      // Show ghost on success
      setShowGhost(true);
      setTimeout(() => setShowGhost(false), 2000);
      
      setSimMode(false); // Reset simulator
      setSimStepIndex(0);
    } catch (err: any) {
      setError(err.message || "Ritual failed.");
    } finally {
      setLoading(false);
      setSummoningStage('');
    }
  };

  const toggleSimulator = () => {
    if (!sop) return;
    setSimMode(!simMode);
    setSimStepIndex(0);
  };

  const nextStep = () => {
    if (sop && simStepIndex < sop.steps.length - 1) setSimStepIndex(prev => prev + 1);
  };

  const prevStep = () => {
    if (simStepIndex > 0) setSimStepIndex(prev => prev - 1);
  };

  // Helper to group steps by phase
  const groupedSteps = sop ? sop.steps.reduce((acc, step) => {
    const key = step.phase || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(step);
    return acc;
  }, {} as Record<string, SOPStep[]>) : {};

  return (
    <div className="min-h-screen bg-ritual-light text-slate-800 p-6 font-serif border-t-8 border-ritual-teal relative overflow-hidden">
      {/* Floating Mystical Elements Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="mystical-float mystical-1">✨</div>
        <div className="mystical-float mystical-2">🎃</div>
        <div className="mystical-float mystical-3">💀</div>
        <div className="mystical-float mystical-4">🎃</div>
        <div className="mystical-float mystical-5">✨</div>
      </div>
      
      <GhostFloat show={showGhost} />
      
      <header className="mb-12 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-ritual-gold opacity-50"></div>
        <h1 className="text-5xl font-medium text-ritual-teal pt-8 mb-2 flex justify-center items-center gap-4">
          <Scroll className="w-12 h-12 text-ritual-gold skull-float" />
          🎃 Weaver of Welcomes 🎃
        </h1>
        <p className="text-slate-500 italic">Onboarding Ritual // Bone Framework // Digital Daemon 👻</p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* INPUT - SUMMONING CIRCLE */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative hover:shadow-[0_15px_50px_-15px_rgba(13,148,136,0.2)] transition-all">
            {loading && summoningStage && <SummoningCircle stage={summoningStage} />}
            <h2 className="text-xl text-ritual-teal font-semibold mb-6 flex items-center gap-2">
              <Feather className="w-5 h-5 skull-float" />
              Ritual Inscription 📜
            </h2>
            <p className="text-sm text-slate-500 mb-6 italic">
              Describe your new hire once. The skeleton weaves a 30/60/90 rite they'll actually survive.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded p-3 focus:outline-none focus:border-ritual-teal"
                  placeholder="e.g. Senior Product Designer"
                  value={role} onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tools & Access</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded p-3 focus:outline-none focus:border-ritual-teal h-24 resize-none"
                  placeholder="e.g. Figma, Linear, Slack, MacBook Pro"
                  value={tools} onChange={(e) => setTools(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Success Goals</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded p-3 focus:outline-none focus:border-ritual-teal h-24 resize-none"
                  placeholder="e.g. Ship first feature, audit design system"
                  value={goals} onChange={(e) => setGoals(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8">
              <div title="Weave a 30/60/90 day onboarding plan from your description">
                <HalloweenButton
                  onClick={handleRitual}
                  disabled={!role}
                  loading={loading}
                  icon={loading ? Sparkles : BookOpen}
                  variant="ritual"
                  className="w-full py-4 text-lg font-serif"
                >
                  {loading ? 'Weaving...' : 'Cast Onboarding Ritual'}
                </HalloweenButton>
              </div>
            </div>
            {error && (
               <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* OUTPUT - GRIMOIRE ENTRY */}
        <div className="lg:col-span-8">
          {sop ? (
            <div className="bg-white min-h-[600px] p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col hover:shadow-lg transition-all">
              <div className="text-center mb-6 pb-6 border-b border-slate-100 relative">
                <div className="text-xs text-ritual-teal/70 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                  <Scroll className="w-3 h-3 skull-float" />
                  Woven into the Skeleton ✨
                </div>
                <h2 className="text-3xl text-slate-800 font-serif">{sop.title}</h2>
                
                {/* Source Badge */}
                <div className="mt-2 flex justify-center">
                  {sop.source === 'stub' && (
                    <div className="inline-flex items-center gap-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-300">
                      🎃 Fallback Mode: No API key detected
                    </div>
                  )}
                  {sop.source === 'llm' && (
                    <div className="inline-flex items-center gap-2 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full border border-purple-300">
                      ✨ Live AI Generated
                    </div>
                  )}
                </div>
                
                <p className="text-slate-500 mt-2">{sop.summary}</p>
                
                {/* Simulator Toggle */}
                <button 
                  onClick={toggleSimulator}
                  className={`
                    absolute top-0 right-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all
                    ${simMode ? 'bg-ritual-gold text-white border-ritual-gold' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}
                  `}
                >
                  {simMode ? <StopCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                  Ritual Simulator (Preview)
                </button>
              </div>

              {simMode ? (
                /* SIMULATOR VIEW */
                <div className="flex-1 flex flex-col justify-center items-center max-w-2xl mx-auto w-full">
                  <div className="w-full mb-4 flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Step {simStepIndex + 1} of {sop.steps.length}</span>
                    <span>{sop.steps[simStepIndex].phase}</span>
                  </div>
                  
                  <div className="w-full bg-slate-50 border-2 border-ritual-teal/20 rounded-xl p-10 shadow-lg mb-8 relative">
                    <div className="absolute top-4 right-4 text-ritual-teal/20">
                      <Sparkles className="w-12 h-12" />
                    </div>
                    <div className="text-sm text-ritual-teal font-bold uppercase tracking-wider mb-2">
                       {sop.steps[simStepIndex].owner}
                    </div>
                    <h3 className="text-2xl font-serif text-slate-800 leading-relaxed">
                      {sop.steps[simStepIndex].action}
                    </h3>
                    {sop.steps[simStepIndex].artifact && (
                      <div className="mt-6 p-3 bg-white border border-slate-200 rounded inline-flex items-center gap-2 text-sm text-slate-600">
                        <Scroll className="w-4 h-4 text-ritual-gold" />
                        Artifact Required: <span className="font-bold">{sop.steps[simStepIndex].artifact}</span>
                      </div>
                    )}

                    {/* TODO: AI Critique Placeholder */}
                    {/* 
                      <div className="mt-8 border-t border-slate-200 pt-4 opacity-50">
                         <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">AI Critique Logic</span>
                         <p className="text-xs text-slate-400 mt-1">Check if step is too vague...</p>
                      </div>
                    */}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={prevStep}
                      disabled={simStepIndex === 0}
                      className="px-6 py-2 rounded-full border border-slate-200 text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                     <button 
                      onClick={nextStep}
                      disabled={simStepIndex === sop.steps.length - 1}
                      className="px-6 py-2 rounded-full bg-ritual-teal text-white disabled:opacity-50 hover:bg-teal-800 transition flex items-center gap-2"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* STANDARD 30/60/90 VIEW WITH CANDLE ICONS */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
                  {Object.entries(groupedSteps).map(([phase, steps], idx) => {
                    // Skull icon based on phase
                    const skullIcon = idx === 0 ? '💀' : idx === 1 ? '💀💀' : '💀💀💀';
                    
                    return (
                      <div key={phase} className="bg-slate-50 rounded-lg p-4 border border-slate-100 hover:border-ritual-teal/30 transition-all">
                        <h3 className="text-center text-ritual-teal font-bold uppercase tracking-widest text-sm mb-2 pb-2 border-b border-slate-200 flex items-center justify-center gap-2">
                          <span className="text-lg skull-float">{skullIcon}</span>
                          {phase}
                        </h3>
                        <div className="space-y-4 mt-4">
                          {steps.map(step => (
                            <div key={step.id} className="bg-white p-3 rounded shadow-sm border border-slate-100 hover:border-ritual-teal/30 hover:shadow-md transition-all">
                              <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{step.owner}</div>
                              <div className="text-sm text-slate-800 leading-snug">{step.action}</div>
                              {step.artifact && (
                                 <div className="mt-2 text-xs text-ritual-gold flex items-center gap-1">
                                   <Scroll className="w-3 h-3 skull-float" /> {step.artifact}
                                 </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-12 border-4 border-double border-slate-200 rounded-xl">
              <BookOpen className="w-24 h-24 mb-6 opacity-20" />
              <p className="text-lg font-serif italic text-center">
                The scroll awaits. <br/> Inscribe the initiate's path to begin the weaving.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};