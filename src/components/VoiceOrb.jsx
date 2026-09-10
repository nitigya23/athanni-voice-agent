import React from 'react';
import { Mic, MicOff, Bot, Sparkles, PhoneCall, Volume2 } from 'lucide-react';

export default function VoiceOrb({ status, volume = 0, isMuted = false, onClick }) {
  // Volume is typically 0 to 1
  const scale = 1 + Math.min(volume * 0.8, 0.4);

  const getStatusDisplay = () => {
    switch (status) {
      case 'connecting':
        return {
          title: 'Connecting...',
          desc: 'Negotiating secure WebRTC session',
          color: 'from-amber-500 to-orange-500',
          ringColor: 'border-amber-500/30',
          badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <Sparkles className="w-5 h-5 animate-spin" />,
        };
      case 'listening':
        return {
          title: isMuted ? 'Microphone Muted' : 'Listening to you...',
          desc: isMuted ? 'Unmute to speak' : 'Speak clearly into your microphone',
          color: isMuted ? 'from-slate-600 to-slate-700' : 'from-emerald-500 to-teal-400',
          ringColor: 'border-teal-500/40',
          badgeBg: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
          icon: isMuted ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5 animate-pulse text-teal-300" />,
        };
      case 'speaking':
        return {
          title: 'AI is speaking',
          desc: 'Listen to the response',
          color: 'from-indigo-500 via-purple-500 to-pink-500',
          ringColor: 'border-indigo-500/40',
          badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          icon: <Volume2 className="w-5 h-5 animate-bounce text-indigo-300" />,
        };
      case 'thinking':
        return {
          title: 'AI is thinking...',
          desc: 'Processing intent & LLM reasoning',
          color: 'from-purple-500 to-indigo-500',
          ringColor: 'border-purple-500/30',
          badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          icon: <Sparkles className="w-5 h-5 animate-pulse text-purple-300" />,
        };
      case 'idle':
      default:
        return {
          title: 'Agent Ready',
          desc: 'Click "Start Voice Call" to test live conversation',
          color: 'from-teal-500 to-cyan-500',
          ringColor: 'border-teal-500/20',
          badgeBg: 'bg-slate-800/80 text-slate-300 border-slate-700',
          icon: <Bot className="w-5 h-5 text-teal-400" />,
        };
    }
  };

  const current = getStatusDisplay();
  const isActive = status === 'listening' || status === 'speaking' || status === 'thinking';

  return (
    <div className="flex flex-col items-center justify-center p-8 select-none">
      {/* Outer Glow container */}
      <div className="relative flex items-center justify-center w-64 h-64 my-4">
        {/* Animated Background Ripple Rings when active */}
        {isActive && (
          <>
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr ${current.color} opacity-20 blur-xl animate-ping`}
              style={{ animationDuration: '3s' }}
            />
            <div
              className={`absolute -inset-4 rounded-full border border-teal-500/20 animate-pulse`}
              style={{ transform: `scale(${scale * 1.1})` }}
            />
            <div
              className={`absolute -inset-8 rounded-full border border-teal-500/10`}
              style={{ transform: `scale(${scale * 1.25})` }}
            />
          </>
        )}

        {/* Ambient Blur Orb */}
        <div
          className={`absolute w-52 h-52 rounded-full bg-gradient-to-br ${current.color} opacity-30 blur-2xl transition-all duration-300`}
          style={{ transform: `scale(${scale * 1.05})` }}
        />

        {/* Central Core Interactive Sphere */}
        <button
          onClick={onClick}
          disabled={status === 'connecting'}
          aria-label={isActive ? 'End call' : 'Start call'}
          className={`relative z-10 w-44 h-44 rounded-full flex flex-col items-center justify-center 
            bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 ${current.ringColor}
            shadow-2xl shadow-teal-500/10 transition-all duration-200 group hover:scale-105 active:scale-95`}
          style={{
            transform: isActive ? `scale(${scale})` : undefined,
          }}
        >
          {/* Internal Glow Gradient */}
          <div
            className={`absolute inset-2 rounded-full bg-gradient-to-tr ${current.color} opacity-20 group-hover:opacity-35 transition-opacity duration-300`}
          />

          {/* Dynamic Inner Wave Icon / State */}
          <div className="relative z-20 flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-slate-800/80 border border-slate-700/60 shadow-inner">
              {current.icon}
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {status === 'idle' ? 'Start Call' : status}
            </span>
          </div>

          {/* Audio Wave Bars when speaking or listening */}
          {isActive && (
            <div className="absolute bottom-6 flex items-center gap-1">
              {[0.4, 0.8, 1, 0.7, 0.3].map((heightMultiplier, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-teal-400 rounded-full transition-all duration-75"
                  style={{
                    height: `${Math.max(4, Math.min(24, (volume * 40 + 4) * heightMultiplier))}px`,
                    opacity: 0.6 + volume * 0.4,
                  }}
                />
              ))}
            </div>
          )}
        </button>
      </div>

      {/* Status Label & Subtext */}
      <div className="text-center mt-2 space-y-1.5">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${current.badgeBg}`}>
          {current.icon}
          <span>{current.title}</span>
        </div>
        <p className="text-xs text-slate-400 max-w-xs">{current.desc}</p>
      </div>
    </div>
  );
}
