import { useState, useEffect } from 'react';
import { IncidentApp } from './apps/incident-exorcist/IncidentApp';
import { OnboardingApp } from './apps/onboarding-ritual/OnboardingApp';
import { ArrowRight, Github } from 'lucide-react';
import { SkullLogo } from './components/SkullLogo';
import { PumpkinLogo } from './components/PumpkinLogo';

type AppSelection = 'dashboard' | 'incident' | 'onboarding';

export default function App() {
  const [currentApp, setCurrentApp] = useState<AppSelection>('dashboard');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (currentApp === 'incident') {
    return (
      <div className="relative">
        <button 
          onClick={() => setCurrentApp('dashboard')}
          className="fixed top-4 right-4 z-50 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur hover:bg-black/80 transition text-xs font-bold uppercase tracking-wider border border-white/10"
        >
          Exit to Dashboard
        </button>
        <IncidentApp />
      </div>
    );
  }

  if (currentApp === 'onboarding') {
    return (
      <div className="relative">
        <button 
          onClick={() => setCurrentApp('dashboard')}
          className="fixed top-4 right-4 z-50 bg-white/50 text-slate-800 px-4 py-2 rounded-full backdrop-blur hover:bg-white/80 transition text-xs font-bold uppercase tracking-wider border border-slate-200/50 shadow-sm"
        >
          Exit to Dashboard
        </button>
        <OnboardingApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen halloween-bg text-white selection:bg-purple-500 selection:text-white overflow-x-hidden font-sans">
      {/* Skull Pattern with Parallax and Drift */}
      <div 
        className="skull-pattern skull-pattern-animated"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />

      {/* Background Ambience - Enhanced Neon Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[100vw] h-[100vw] bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-[80vw] h-[80vw] bg-violet-900/15 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/4 right-1/4 w-[60vw] h-[60vw] bg-blue-900/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col min-h-screen">
        
        {/* Hero Section - Premium Glassmorphism Card */}
        <header className="mb-12 hero-glass-card rounded-3xl p-10 md:p-16 animate-in text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <PumpkinLogo size={64} className="drop-shadow-[0_0_20px_rgba(255,107,26,0.8)] skull-float" />
            <SkullLogo size={56} className="text-white drop-shadow-[0_0_12px_rgba(139,69,255,0.7)]" />
            <PumpkinLogo size={64} className="drop-shadow-[0_0_20px_rgba(255,107,26,0.8)] skull-float" />
          </div>
          
          {/* Main Hero Title with Spooky Font and Glitch */}
          <h1 className="font-creepster text-6xl md:text-8xl mb-4 text-white hero-title-glitch tracking-wide">
            🎃 Bone Framework 🎃
          </h1>
          <div className="font-creepster text-3xl md:text-5xl mb-8 text-purple-300">
            Kiroween Edition 👻
          </div>
          
          {/* Subheadlines with Creepster Font */}
          <div className="space-y-3">
            <h2 className="font-creepster text-3xl md:text-4xl text-purple-300 leading-tight">
              🎃 Summon living runbooks from operational chaos 🎃
            </h2>
            <h3 className="font-creepster text-2xl md:text-3xl text-purple-400 leading-tight">
              One undead SOP skeleton. Two digital daemons. Zero forgotten rituals. 👻
            </h3>
          </div>
        </header>

        {/* Helper Text - Outside Hero, Above Cards */}
        <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto text-center leading-relaxed font-sans mb-12">
          Pick your ritual: exorcise recurring incidents or weave 30/60/90-day onboarding rites from a single description.
        </p>

        {/* App Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Incident Exorcist Card */}
          <button 
            onClick={() => setCurrentApp('incident')}
            className="group relative h-80 rounded-2xl glass-panel p-8 text-left transition-all hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/0 to-red-900/15 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 bg-red-950/50 rounded-lg flex items-center justify-center mb-6 text-red-400 border border-red-900/30 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300">
                  <span className="text-2xl fire-flicker">🔥</span>
                </div>
                <h2 className="text-3xl font-bold text-red-50 mb-3">Incident Exorcist</h2>
                <p className="text-zinc-400 text-sm mb-4 italic">
                  Bind recurring outages into a reusable ritual.
                </p>
                <p className="text-zinc-300 text-sm">
                  Drop your chaotic incident thread here and let the bone marrow bind it into a repeatable ritual.
                </p>
              </div>
              <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-sm tracking-wider">
                Summon Incident Daemon <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Onboarding Ritual Card */}
          <button 
            onClick={() => setCurrentApp('onboarding')}
            className="group relative h-80 rounded-2xl glass-panel p-8 text-left transition-all hover:border-teal-500/50 hover:shadow-[0_0_40px_rgba(20,184,166,0.15)] overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-teal-900/0 to-teal-900/15 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 bg-teal-950/50 rounded-lg flex items-center justify-center mb-6 text-teal-400 border border-teal-900/30 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all duration-300">
                  <span className="text-2xl skull-float">💀</span>
                </div>
                <h2 className="text-3xl font-bold text-teal-50 mb-3">Onboarding Ritual</h2>
                <p className="text-zinc-400 text-sm mb-4 italic">
                  Weave a 30/60/90 rite from a single role description.
                </p>
                <p className="text-zinc-300 text-sm">
                  Describe your new hire once. The skeleton weaves a 30/60/90 rite they'll actually survive.
                </p>
              </div>
              <div className="flex items-center gap-2 text-teal-400 font-bold uppercase text-sm tracking-wider">
                Cast Onboarding Ritual <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

        </div>

        <footer className="mt-auto pt-20 border-t border-purple-900/30 text-zinc-500 text-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-6">
              <span className="text-purple-400/80">🦴 Spine</span>
              <span className="text-purple-400/80">🫁 Ribs</span>
              <span className="text-red-400/80">👹 Daemons</span>
              <span className="text-orange-400/80">🎃 Pumpkins</span>
            </div>
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              <span>Monorepo v1.0.0</span>
            </div>
          </div>
          <div className="flex gap-6 text-xs opacity-60">
            <span>packages/bone-framework</span>
            <span>packages/shared</span>
            <span>apps/incident-exorcist</span>
            <span>apps/onboarding-ritual</span>
          </div>
        </footer>
      </div>
    </div>
  );
}