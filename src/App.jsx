import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Settings,
  Code,
  Sparkles,
  Clock,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import VoiceOrb from './components/VoiceOrb';
import TranscriptView from './components/TranscriptView';
import SettingsModal from './components/SettingsModal';
import EmbedSnippetModal from './components/EmbedSnippetModal';

export default function App() {
  // Read initial keys from environment or localStorage
  const [apiKey, setApiKey] = useState(() => {
    return import.meta.env.VITE_VAPI_PUBLIC_KEY || localStorage.getItem('vapi_public_key') || '';
  });
  const [assistantId, setAssistantId] = useState(() => {
    return import.meta.env.VITE_VAPI_ASSISTANT_ID || localStorage.getItem('vapi_assistant_id') || '';
  });

  const [callStatus, setCallStatus] = useState('idle'); // 'idle' | 'connecting' | 'listening' | 'speaking' | 'thinking'
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [messages, setMessages] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const vapiRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize Vapi instance whenever apiKey changes
  useEffect(() => {
    if (!apiKey) return;

    try {
      const vapi = new Vapi(apiKey);
      vapiRef.current = vapi;

      vapi.on('call-start', () => {
        setCallStatus('listening');
        setErrorMessage(null);
      });

      vapi.on('call-end', () => {
        setCallStatus('idle');
        setVolume(0);
        setIsMuted(false);
      });

      vapi.on('speech-start', () => {
        setCallStatus('speaking');
      });

      vapi.on('speech-end', () => {
        setCallStatus('listening');
      });

      vapi.on('volume-level', (vol) => {
        setVolume(vol);
      });

      vapi.on('message', (message) => {
        if (message.type === 'transcript') {
          const role = message.role === 'assistant' ? 'assistant' : 'user';
          const text = message.transcript;
          const isFinal = message.transcriptType === 'final';

          setMessages((prev) => {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            // If the last message is from the same role and wasn't marked final, update it
            if (prev.length > 0 && prev[prev.length - 1].role === role && !prev[prev.length - 1].isFinal) {
              const updated = [...prev];
              updated[updated.length - 1] = { role, text, time, isFinal };
              return updated;
            }
            return [...prev, { role, text, time, isFinal }];
          });
        }
      });

      vapi.on('error', (err) => {
        console.error('Vapi Error:', err);
        setCallStatus('idle');
        setErrorMessage(err?.message || 'Connection error. Please verify your Vapi keys.');
      });

      return () => {
        vapi.stop();
      };
    } catch (err) {
      console.error('Vapi init failed', err);
    }
  }, [apiKey]);

  // Call duration counter
  useEffect(() => {
    if (callStatus !== 'idle' && callStatus !== 'connecting') {
      timerRef.current = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (callStatus === 'idle') setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  const handleStartCall = async () => {
    setErrorMessage(null);
    if (!apiKey || !assistantId) {
      setIsSettingsOpen(true);
      return;
    }

    try {
      setCallStatus('connecting');
      if (vapiRef.current) {
        await vapiRef.current.start(assistantId);
      }
    } catch (err) {
      console.error(err);
      setCallStatus('idle');
      setErrorMessage(err?.message || 'Failed to start call. Ensure microphone permissions are enabled.');
    }
  };

  const handleEndCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setCallStatus('idle');
    setVolume(0);
  };

  const handleToggleMute = () => {
    if (!vapiRef.current) return;
    const nextMute = !isMuted;
    vapiRef.current.setMuted(nextMute);
    setIsMuted(nextMute);
  };

  const handleSaveSettings = ({ apiKey: newKey, assistantId: newId }) => {
    setApiKey(newKey);
    setAssistantId(newId);
    localStorage.setItem('vapi_public_key', newKey);
    localStorage.setItem('vapi_assistant_id', newId);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCallActive = callStatus !== 'idle';

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col selection:bg-teal-500/30">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-wide">
              Athanni Softech's Voice Calling Agent
            </h1>
            <p className="text-[11px] text-teal-400 font-medium">
              Live AI Voice Assistant &amp; Client Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Embed snippet button */}
          <button
            onClick={() => setIsEmbedOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60 rounded-xl transition-all"
            title="Get embed code for client site"
          >
            <Code className="w-3.5 h-3.5 text-teal-400" />
            <span>Embed Code</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60 rounded-xl transition-all"
            title="Configure Vapi credentials"
          >
            <Settings className="w-3.5 h-3.5 text-teal-400" />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Missing Credentials Alert */}
        {(!apiKey || !assistantId) && (
          <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-teal-500/10 border border-teal-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-teal-200">
                  Step 1: Configure Your Vapi Credentials
                </h4>
                <p className="text-xs text-slate-400">
                  Connect your Vapi Public Key &amp; Assistant ID to test your voice agent directly in this browser.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold shadow-md shadow-teal-500/20 transition-all flex-shrink-0"
            >
              Enter Keys Now
            </button>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
          {/* Left Column: Voice Agent Controller & Orb */}
          <div className="lg:col-span-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-sm shadow-xl relative overflow-hidden">
            {/* Top Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isCallActive ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isCallActive ? 'bg-emerald-500' : 'bg-slate-600'
                    }`}
                  />
                </span>
                <span className="text-xs font-medium text-slate-400 capitalize">
                  {callStatus}
                </span>
              </div>

              {isCallActive && (
                <div className="flex items-center gap-1.5 text-xs text-teal-300 font-mono bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(callDuration)}</span>
                </div>
              )}
            </div>

            {/* Interactive Voice Orb */}
            <VoiceOrb
              status={callStatus}
              volume={volume}
              isMuted={isMuted}
              onClick={isCallActive ? handleEndCall : handleStartCall}
            />

            {/* Bottom Call Action Controls */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800/60">
              {!isCallActive ? (
                <button
                  onClick={handleStartCall}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold text-sm shadow-lg shadow-teal-500/25 transition-all transform active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Start Voice Call</span>
                </button>
              ) : (
                <>
                  {/* Mute Button */}
                  <button
                    onClick={handleToggleMute}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isMuted
                        ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                    title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {/* End Call Button */}
                  <button
                    onClick={handleEndCall}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-600/25 transition-all active:scale-95"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Call</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Live Transcript & Details */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex-1 min-h-[380px]">
              <TranscriptView
                messages={messages}
                onClear={() => setMessages([])}
              />
            </div>

            {/* Client Handoff Quick Info Card */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>WebRTC Ultra-Low Latency Voice Streaming via Deepgram + ElevenLabs</span>
              </div>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="text-teal-400 hover:underline text-[11px] font-medium flex-shrink-0"
              >
                Ship to Client &rarr;
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        assistantId={assistantId}
        onSave={handleSaveSettings}
      />

      <EmbedSnippetModal
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
        apiKey={apiKey}
        assistantId={assistantId}
      />
    </div>
  );
}
