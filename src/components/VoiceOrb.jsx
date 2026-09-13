import React from 'react';
import { Mic, MicOff, Bot, Sparkles, PhoneCall, Volume2 } from 'lucide-react';

export default function VoiceOrb({ status, volume = 0, isMuted = false, onClick }) {
  // Volume is typically 0 to 1
  const scale = 1 + Math.min(volume * 0.8, 0.4);

  const getStatusDisplay = () => {
    switch (status) {
      case 'connecting':
        return {
          title: 'Connecting to Shweta...',
          desc: 'Connecting your call, please wait a moment',
          color: 'from-amber-400 via-orange-500 to-cyan-500',
          ringColor: 'border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]',
          badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: <Sparkles className="w-4 h-4 animate-spin text-amber-400" />,
        };
      case 'listening':
        return {
          title: isMuted ? 'Microphone is Muted' : 'Shweta is Listening...',
          desc: isMuted ? 'Tap Unmute below to talk' : 'Speak clearly in Hindi or English',
          color: isMuted ? 'from-slate-500 to-slate-700' : 'from-cyan-400 via-teal-400 to-emerald-400',
          ringColor: isMuted ? 'border-red-500/50' : 'border-cyan-400 shadow-[0_0_30px_rgba(0,242,254,0.5)]',
          badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          icon: isMuted ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 animate-pulse text-cyan-400" />,
        };
      case 'speaking':
        return {
          title: 'Shweta is Speaking',
          desc: 'Listen to Shweta\'s response',
          color: 'from-cyan-400 via-blue-500 to-indigo-600',
          ringColor: 'border-cyan-400 shadow-[0_0_30px_rgba(0,242,254,0.6)]',
          badgeBg: 'bg-navy-900/90 text-cyan-300 border-cyan-500/40',
          icon: <Volume2 className="w-4 h-4 animate-bounce text-cyan-400" />,
        };
      case 'thinking':
        return {
          title: 'Checking car details...',
          desc: 'Looking up inventory information',
          color: 'from-purple-500 via-indigo-500 to-cyan-400',
          ringColor: 'border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.5)]',
          badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          icon: <Sparkles className="w-4 h-4 animate-pulse text-purple-400" />,
        };
      case 'idle':
      default:
        return {
          title: 'Ready to Call',
          desc: 'Click "Start Call" below to talk about cars',
          color: 'from-cyan-500 to-blue-600',
          ringColor: 'border-cyan-500/40 shadow-[0_0_20px_rgba(0,242,254,0.2)]',
          badgeBg: 'bg-navy-900/90 text-cyan-300 border-cyan-500/30',
          icon: <Bot className="w-4 h-4 text-cyan-400" />,
        };
    }
  };

  const current = getStatusDisplay();
  const isActive = status === 'listening' || status === 'speaking' || status === 'thinking';

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      {/* Outer Glow container */}
      <div className="relative flex items-center justify-center w-56 h-56 my-2">
        {/* Animated Background Ripple Rings when active */}
        {isActive && (
          <>
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr ${current.color} opacity-20 blur-xl animate-ping`}
              style={{ animationDuration: '3s' }}
            />
            <div
              className="absolute -inset-4 rounded-full border border-cyan-500/30 animate-pulse"
              style={{ transform: `scale(${scale * 1.08})` }}
            />
            <div
              className="absolute -inset-8 rounded-full border border-cyan-500/15"
              style={{ transform: `scale(${scale * 1.2})` }}
            />
          </>
        )}

        {/* Ambient Blur Orb */}
        <div
          className={`absolute w-44 h-44 rounded-full bg-gradient-to-br ${current.color} opacity-30 blur-2xl transition-all duration-300`}
          style={{ transform: `scale(${scale * 1.05})` }}
        />

        {/* Central Core Interactive Sphere */}
        <button
          onClick={onClick}
          disabled={status === 'connecting'}
          aria-label={isActive ? 'End call' : 'Start call'}
          className={`relative z-10 w-40 h-40 rounded-full flex flex-col items-center justify-center 
            bg-gradient-to-b from-navy-900 via-charcoal-900 to-charcoal-950
            border-2 ${current.ringColor}
            shadow-[0_0_35px_rgba(0,0,0,0.9)] transition-all duration-200 group hover:scale-105 active:scale-95 cursor-pointer`}
          style={{
            transform: isActive ? `scale(${scale})` : undefined,
          }}
        >
          {/* Internal Glow Gradient */}
          <div
            className={`absolute inset-2 rounded-full bg-gradient-to-tr ${current.color} opacity-20 group-hover:opacity-35 transition-opacity duration-300`}
          />

          {/* Dynamic Inner Wave Icon / State */}
          <div className="relative z-20 flex flex-col items-center gap-1.5">
            <div className="p-3 rounded-full bg-navy-950/90 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
              {current.icon}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {status === 'idle' ? 'Ready' : status}
            </span>
          </div>

          {/* Audio Wave Bars when speaking or listening */}
          {isActive && (
            <div className="absolute bottom-5 flex items-center gap-1">
              {[0.4, 0.8, 1, 0.7, 0.3].map((heightMultiplier, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-cyan-400 rounded-full transition-all duration-75 shadow-[0_0_8px_#00f2fe]"
                  style={{
                    height: `${Math.max(4, Math.min(22, (volume * 36 + 4) * heightMultiplier))}px`,
                    opacity: 0.7 + volume * 0.3,
                  }}
                />
              ))}
            </div>
          )}
        </button>
      </div>

      {/* Status Label & Subtext */}
      <div className="text-center mt-3 space-y-1">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${current.badgeBg} shadow-sm`}>
          {current.icon}
          <span>{current.title}</span>
        </div>
        <p className="text-xs text-slate-400 max-w-xs">{current.desc}</p>
      </div>
    </div>
  );
}
