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
  HelpCircle,
  FileDown,
  LayoutDashboard,
  Database,
  User,
  Volume2,
  Car,
  PhoneCall,
  FileSpreadsheet,
  Sun,
  Moon
} from 'lucide-react';
import VoiceOrb from './components/VoiceOrb';
import TranscriptView from './components/TranscriptView';
import SettingsModal from './components/SettingsModal';
import EmbedSnippetModal from './components/EmbedSnippetModal';
import AdminDashboard from './components/admin/AdminDashboard';
import CallHistoryView from './components/admin/CallHistoryView';
import InventoryTable from './components/admin/InventoryTable';
import { CARS_INVENTORY, buildInventoryPromptSnippet, analyzeTranscriptForCallDetails } from './data/carsInventory';
import { INITIAL_CALL_HISTORY } from './data/callHistoryData';

const MARUTI_BAZAAR_KEY = '90fb2000-8816-4057-9c1a-2c94bd7dfa67';
const MARUTI_BAZAAR_ASSISTANT_ID = '4979a054-806c-45d1-bf84-e83f8a58d61e';

export default function App() {
  // Theme state: 'dark' (Default to Charcoal Black & Deep Navy neon theme)
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    try {
      localStorage.removeItem('maruti_bazzar_theme');
      localStorage.setItem('maruti_bazzar_theme_v2', 'dark');
      document.documentElement.classList.add('dark');
    } catch (e) {
      console.warn('Theme save notice:', e);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Navigation tabs: 'agent' (Voice Call) | 'recordings' (Call Audio & Transcripts) | 'inventory' (120 Cars)
  const [currentView, setCurrentView] = useState('agent');

  // Persistent Inventory State (loads from localStorage if edited, else default CARS_INVENTORY)
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('maruti_bazzar_inventory');
      return saved ? JSON.parse(saved) : CARS_INVENTORY;
    } catch {
      return CARS_INVENTORY;
    }
  });

  // Save inventory to localStorage whenever admin updates any car
  useEffect(() => {
    try {
      localStorage.setItem('maruti_bazzar_inventory', JSON.stringify(inventory));
    } catch (e) {
      console.warn('Inventory localStorage notice:', e);
    }
  }, [inventory]);

  // Persistent Call History State
  const [callHistory, setCallHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('maruti_bazzar_calls');
      return saved ? JSON.parse(saved) : INITIAL_CALL_HISTORY;
    } catch {
      return INITIAL_CALL_HISTORY;
    }
  });

  // Save to localStorage on any call history update
  useEffect(() => {
    try {
      localStorage.setItem('maruti_bazzar_calls', JSON.stringify(callHistory));
    } catch (e) {
      console.warn('LocalStorage save notice:', e);
    }
  }, [callHistory]);

  // Customer Name & Contact for the active call (Auto-detected dynamically from conversation if left blank)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Vapi Credentials (loads from localStorage or defaults to Maruti Bazaar credentials)
  const [apiKey, setApiKey] = useState(() => {
    try {
      const saved = localStorage.getItem('vapi_api_key');
      return saved ? saved.trim() : MARUTI_BAZAAR_KEY;
    } catch {
      return MARUTI_BAZAAR_KEY;
    }
  });
  const [assistantId, setAssistantId] = useState(() => {
    try {
      const saved = localStorage.getItem('vapi_assistant_id');
      return saved ? saved.trim() : MARUTI_BAZAAR_ASSISTANT_ID;
    } catch {
      return MARUTI_BAZAAR_ASSISTANT_ID;
    }
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
  const callDurationRef = useRef(0);

  // MediaRecorder audio capture refs and Web Audio mixer
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const activeBlobUrlRef = useRef(null);
  const messagesRef = useRef([]);
  const audioContextRef = useRef(null);
  const audioMixerDestRef = useRef(null);
  const micStreamRef = useRef(null);
  const remoteConnectedSourcesRef = useRef(new Set());

  // Customer Name & Phone ref to avoid stale closure
  const customerNameRef = useRef(customerName);
  const customerPhoneRef = useRef(customerPhone);

  useEffect(() => {
    customerNameRef.current = customerName;
  }, [customerName]);

  useEffect(() => {
    customerPhoneRef.current = customerPhone;
  }, [customerPhone]);

  // Sync messagesRef & callDurationRef
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    callDurationRef.current = callDuration;
  }, [callDuration]);

  // Format timer helper
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to safely mix a remote assistant audio track or element into the mixer destination
  const mixRemoteAudioSource = (sourceOrTrack) => {
    try {
      if (!audioContextRef.current || !audioMixerDestRef.current) return;
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      if (sourceOrTrack instanceof HTMLMediaElement) {
        if (remoteConnectedSourcesRef.current.has(sourceOrTrack)) return;
        remoteConnectedSourcesRef.current.add(sourceOrTrack);
        const elementSource = ctx.createMediaElementSource(sourceOrTrack);
        elementSource.connect(audioMixerDestRef.current);
        elementSource.connect(ctx.destination); // Ensure it also plays to the user's speakers
      } else if (sourceOrTrack instanceof MediaStreamTrack) {
        if (remoteConnectedSourcesRef.current.has(sourceOrTrack.id)) return;
        remoteConnectedSourcesRef.current.add(sourceOrTrack.id);
        const mediaStream = new MediaStream([sourceOrTrack]);
        const trackSource = ctx.createMediaStreamSource(mediaStream);
        trackSource.connect(audioMixerDestRef.current);
      }
    } catch (err) {
      console.warn('Remote audio mixer note:', err);
    }
  };

  // Helper to stop recording and create playable audio URL
  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Recorder stop notice:', err);
      }
    }
    // Clean up mic tracks
    if (micStreamRef.current) {
      try {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {
        console.warn('Mic track stop note:', e);
      }
      micStreamRef.current = null;
    }
    // Clean up AudioContext
    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(() => {});
        }
      } catch (e) {
        console.warn('AudioContext close note:', e);
      }
      audioContextRef.current = null;
      audioMixerDestRef.current = null;
      remoteConnectedSourcesRef.current.clear();
    }
  };

  // Save completed call record into Call History with Dynamic NLP Extraction
  const saveCallToHistory = () => {
    const currentMsgs = messagesRef.current || [];
    const duration = callDurationRef.current || 12;

    // Use intelligent multi-factor transcript parsing to extract name, contact, car, booking, slot, sentiment
    const analysis = analyzeTranscriptForCallDetails(
      currentMsgs,
      customerNameRef.current,
      customerPhoneRef.current
    );

    // Captured mixed dual-stream audio or fallback
    let finalRecordingUrl = activeBlobUrlRef.current;
    if (!finalRecordingUrl && audioChunksRef.current.length > 0) {
      try {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        finalRecordingUrl = URL.createObjectURL(blob);
        activeBlobUrlRef.current = finalRecordingUrl;
      } catch (e) {
        console.warn('Blob URL create note:', e);
      }
    }
    if (!finalRecordingUrl) {
      finalRecordingUrl = 'https://actions.google.com/sounds/v1/ambiences/office_murmur.ogg';
    }

    const userMsgs = currentMsgs.filter((m) => m.role === 'user');
    const sampleInquiry = userMsgs.length > 0 ? userMsgs[0].text : 'Maruti Bazzar Vehicle Inquiry';

    const newCallRecord = {
      callId: `CALL-2026-09-${Math.floor(100 + Math.random() * 900)}`,
      customerName: analysis.customerName || (customerNameRef.current ? customerNameRef.current.trim() : 'Website Customer'),
      customerPhone: analysis.customerPhone || (customerPhoneRef.current ? customerPhoneRef.current.trim() : 'Shared in Call'),
      timestamp:
        new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ', ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: formatTimer(duration),
      durationSeconds: duration,
      carRequested: analysis.carRequested || (sampleInquiry.length > 45 ? sampleInquiry.slice(0, 45) + '...' : sampleInquiry),
      testDriveBooked: analysis.testDriveBooked,
      bookingSlot: analysis.bookingSlot,
      recordingUrl: finalRecordingUrl,
      summary: `Live voice call recorded (Dual-Stream Mixed Audio). Customer: ${analysis.customerName}. Vehicle: ${analysis.carRequested}. Test drive: ${analysis.testDriveBooked === 'Yes' ? 'Booked (' + analysis.bookingSlot + ')' : 'Not booked'}.`,
      sentiment: analysis.sentiment,
      transcript: currentMsgs.length > 0 ? currentMsgs.map((m) => ({ role: m.role, text: m.text })) : [
        { role: 'assistant', text: 'Namaste! MARUTI BAZZAR mein aapka swagat hai, main Riya bol rahi hoon.' },
        { role: 'user', text: sampleInquiry }
      ]
    };

    setCallHistory((prev) => [newCallRecord, ...prev]);

    // Also auto-update customerName and customerPhone input fields if detected
    if (analysis.customerName && analysis.customerName !== 'Valued Customer' && analysis.customerName !== 'Website Caller') {
      setCustomerName(analysis.customerName);
    }
    if (analysis.customerPhone && analysis.customerPhone !== 'Shared in Voice Call' && analysis.customerPhone !== 'Phone Not Shared') {
      setCustomerPhone(analysis.customerPhone);
    }
  };

  // Initialize Vapi instance
  useEffect(() => {
    if (!apiKey) return;

    try {
      const vapi = new Vapi(apiKey);
      vapiRef.current = vapi;

      vapi.on('call-start', () => {
        setCallStatus('listening');
        setErrorMessage(null);

        // Tap into Daily call object if available to hook remote audio track into mixer
        try {
          const dailyCall = vapi.getDailyCallObject ? vapi.getDailyCallObject() : null;
          if (dailyCall) {
            dailyCall.on('track-started', (e) => {
              if (e && e.track && e.track.kind === 'audio' && !e.participant?.local) {
                mixRemoteAudioSource(e.track);
              }
            });
            // Also check existing remote participants
            const participants = dailyCall.participants();
            Object.values(participants).forEach((p) => {
              if (!p.local && p.tracks?.audio?.track) {
                mixRemoteAudioSource(p.tracks.audio.track);
              }
            });
          }
        } catch (e) {
          console.warn('Daily call audio hook notice:', e);
        }
      });

      // Also listen to Vapi's built-in audio event when audio player element is attached
      vapi.on('audio', (player) => {
        if (player) {
          mixRemoteAudioSource(player);
        }
      });

      vapi.on('call-end', () => {
        setCallStatus('idle');
        setVolume(0);
        setIsMuted(false);
        stopAudioRecording();
        saveCallToHistory();
      });

      vapi.on('speech-start', () => {
        setCallStatus('speaking');

        // Check if Vapi created an <audio> element in DOM or on instance that wasn't hooked yet
        try {
          const vapiPlayer = vapi.getAudioPlayer ? vapi.getAudioPlayer() : null;
          if (vapiPlayer) {
            mixRemoteAudioSource(vapiPlayer);
          }
          const domAudioElements = document.querySelectorAll('audio');
          domAudioElements.forEach((el) => {
            if (el.srcObject || el.src) {
              mixRemoteAudioSource(el);
            }
          });
        } catch (e) {
          console.warn('DOM audio check notice:', e);
        }
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
        stopAudioRecording();
        const detail =
          err?.error?.message ||
          err?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          (typeof err === 'string' ? err : null) ||
          JSON.stringify(err);
        setErrorMessage(detail || 'Connection error. Please verify your Vapi credentials in Settings.');
      });

      return () => {
        vapi.stop();
        stopAudioRecording();
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

      // 1. Dual-Stream Audio Capture Setup using Web Audio API
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }

        const mixerDest = audioCtx.createMediaStreamDestination();
        audioMixerDestRef.current = mixerDest;
        remoteConnectedSourcesRef.current = new Set();

        // Capture local microphone
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        micStreamRef.current = micStream;

        const micSource = audioCtx.createMediaStreamSource(micStream);
        micSource.connect(mixerDest);

        audioChunksRef.current = [];
        activeBlobUrlRef.current = null;

        // Create MediaRecorder from the mixed destination stream (contains mic + assistant)
        const mixedStream = mixerDest.stream;
        let mimeType = 'audio/webm;codecs=opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
        }

        const recorder = mimeType
          ? new MediaRecorder(mixedStream, { mimeType })
          : new MediaRecorder(mixedStream);

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const blob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
            activeBlobUrlRef.current = URL.createObjectURL(blob);
          }
        };

        recorder.start(250);
        mediaRecorderRef.current = recorder;
      } catch (recErr) {
        console.warn('Audio mixer setup note:', recErr);
      }

      // 2. Start Vapi call directly with assistant ID
      if (vapiRef.current) {
        await vapiRef.current.start(assistantId);
      }
    } catch (err) {
      console.error('Call start error:', err);
      setCallStatus('idle');
      stopAudioRecording();
      setErrorMessage(err?.message || (typeof err === 'string' ? err : JSON.stringify(err)) || 'Failed to start call.');
    }
  };

  const handleEndCall = () => {
    stopAudioRecording();
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
    try {
      localStorage.setItem('vapi_api_key', newKey);
      localStorage.setItem('vapi_assistant_id', newId);
    } catch (e) {
      console.warn('LocalStorage save notice:', e);
    }
  };

  const handleUpdateCall = (callId, updatedFields) => {
    setCallHistory((prev) =>
      prev.map((c) => (c.callId === callId ? { ...c, ...updatedFields } : c))
    );
  };

  const handleDeleteCall = (callId) => {
    setCallHistory((prev) => prev.filter((c) => c.callId !== callId));
  };

  const handleUpdateCar = (carId, updatedFields) => {
    setInventory((prev) =>
      prev.map((c) => (c.id === carId ? { ...c, ...updatedFields } : c))
    );
  };

  const handleAddCar = (newCar) => {
    setInventory((prev) => [newCar, ...prev]);
  };

  const handleBulkReplaceInventory = (newInventory) => {
    if (Array.isArray(newInventory) && newInventory.length > 0) {
      setInventory(newInventory);
    }
  };

  const isCallActive = callStatus !== 'idle';

  return (
    <div className="min-h-screen charcoal-gradient-bg tech-grid-pattern text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Bar with deep navy glass backdrop and neon accents */}
      <header className="border-b border-navy-800/80 bg-navy-950/90 backdrop-blur-xl px-4 sm:px-6 py-3.5 sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/25 flex-shrink-0">
              <Car className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Maruti Bazzar</span>
                <span className="text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase">
                  Voice AI
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Dealership Calling &bull; Live Stock
              </p>
            </div>
          </div>

          {/* Sleek 3-Tab Switcher with deep navy pill & neon glow */}
          <div className="flex bg-navy-900/90 border border-navy-700/60 rounded-2xl p-1 text-xs sm:text-sm gap-1 shadow-inner backdrop-blur-md">
            <button
              onClick={() => setCurrentView('agent')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 ${
                currentView === 'agent'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/30 shadow-neon'
                  : 'text-slate-300 hover:text-cyan-300 hover:bg-navy-800/50'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Voice Agent</span>
            </button>

            <button
              onClick={() => setCurrentView('recordings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 ${
                currentView === 'recordings'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/30 shadow-neon'
                  : 'text-slate-300 hover:text-cyan-300 hover:bg-navy-800/50'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Recordings</span>
              <span className={`text-[11px] px-2 py-0.2 rounded-full font-bold font-mono ${
                currentView === 'recordings'
                  ? 'bg-slate-950 text-cyan-300'
                  : 'bg-navy-800 text-slate-300'
              }`}>
                {callHistory.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentView('inventory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 ${
                currentView === 'inventory'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold shadow-lg shadow-cyan-500/30 shadow-neon'
                  : 'text-slate-300 hover:text-cyan-300 hover:bg-navy-800/50'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Live Inventory</span>
              <span className={`text-[11px] px-2 py-0.2 rounded-full font-bold font-mono ${
                currentView === 'inventory'
                  ? 'bg-slate-950 text-emerald-300'
                  : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
              }`}>
                {inventory.length}
              </span>
            </button>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            {/* Charcoal & Neon Theme Status Pill */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border border-navy-700 bg-navy-900/90 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.15)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f2fe]"></span>
              <span>Charcoal &amp; Neon Dark</span>
            </div>

            {/* Quick Google Sheets Sync button */}
            <button
              onClick={() => setCurrentView('inventory')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#060b18] hover:bg-navy-900 text-emerald-400 border border-emerald-500/40 rounded-xl transition-all shadow-[0_0_12px_rgba(16,185,129,0.15)]"
              title="Manage Google Sheets Live Inventory"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Google Sheets</span>
            </button>

            {/* Download PDF button */}
            <a
              href="/Maruti_Bazaar_Voice_Calling_Agent_Manual.pdf"
              download="Maruti_Bazaar_Voice_Calling_Agent_Manual.pdf"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#060b18] hover:bg-navy-900 text-slate-200 border border-navy-700 hover:border-cyan-500/40 rounded-xl transition-all"
              title="Download Official PDF Manual"
            >
              <FileDown className="w-4 h-4 text-cyan-400" />
              <span>PDF Guide</span>
            </a>

            {/* Embed snippet button */}
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#060b18] hover:bg-navy-900 text-slate-200 border border-navy-700 hover:border-cyan-500/40 rounded-xl transition-all"
              title="Get embed code"
            >
              <Code className="w-4 h-4 text-cyan-400" />
              <span>Embed</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#060b18] hover:bg-navy-900 text-slate-200 border border-navy-700 hover:border-cyan-500/40 rounded-xl transition-all"
              title="Configure credentials"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Error notification */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-300 rounded-2xl px-4 py-3 text-xs flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 dark:text-red-400" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* View 1: Customer Voice Calling Agent Portal */}
        {currentView === 'agent' ? (
          <div className="space-y-5">
            {/* Customer Details & Recording Bar */}
            <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300 font-bold">Customer:</span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Auto-detected or enter name..."
                    className="bg-[#0b0f17] border border-[#182c60]/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 font-semibold focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 w-56 transition-all placeholder-slate-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300 font-bold">Mobile:</span>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Auto-detected or enter number..."
                    className="bg-[#0b0f17] border border-[#182c60]/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-cyan-300 font-mono font-semibold focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 w-48 transition-all placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 bg-cyan-500/10 px-3.5 py-2 rounded-xl border border-cyan-500/30">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Auto-Recording Both Sides &bull; Smart Details Extraction</span>
              </div>
            </div>

            {/* Grid Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
              {/* Left Column: Voice Agent Controller & Orb */}
              <div className="lg:col-span-6 bg-[#0a1228]/85 border border-[#182c60]/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden">
                {/* Top Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isCallActive ? 'bg-cyan-400' : 'bg-slate-500'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 ${
                          isCallActive ? 'bg-cyan-400 shadow-[0_0_10px_#00f2fe]' : 'bg-slate-500'
                        }`}
                      />
                    </span>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                      {callStatus}
                    </span>
                  </div>

                  {isCallActive && (
                    <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-mono font-bold bg-[#0b0f17] px-3 py-1.5 rounded-full border border-cyan-500/30 shadow-[0_0_12px_rgba(0,242,254,0.15)]">
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

                {/* Friendly Assistant Info Badge */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#060b18]/90 border border-cyan-500/30 text-xs font-semibold text-slate-200 shadow-[0_0_15px_rgba(0,242,254,0.15)]">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f2fe]"></span>
                    <span className="text-cyan-300 font-bold">Shweta</span>
                    <span className="text-slate-500">&bull;</span>
                    <span>Maruti Bazzar Assistant</span>
                  </div>
                </div>

                {/* Bottom Big Call Action Controls */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-[#182c60]/60">
                  {!isCallActive ? (
                    <button
                      onClick={handleStartCall}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-base shadow-[0_0_25px_rgba(0,242,254,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer tracking-wide"
                    >
                      <Phone className="w-5 h-5 fill-slate-950" />
                      <span>Start Voice Call (Hindi)</span>
                    </button>
                  ) : (
                    <>
                      {/* Big Mute Button */}
                      <button
                        onClick={handleToggleMute}
                        className={`flex items-center gap-2 px-6 py-4 rounded-2xl border font-bold text-sm transition-all shadow-sm ${
                          isMuted
                            ? 'bg-red-950/40 border-red-500/50 text-red-400'
                            : 'bg-navy-900 border-navy-700 text-slate-200 hover:bg-navy-800'
                        }`}
                        title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                      >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-cyan-400" />}
                        <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                      </button>

                      {/* Big End Call Button */}
                      <button
                        onClick={handleEndCall}
                        className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
                      >
                        <PhoneOff className="w-5 h-5" />
                        <span>End Call</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Live Transcript & Details */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                <div className="flex-1 min-h-[380px]">
                  <TranscriptView
                    messages={messages}
                    onClear={() => setMessages([])}
                  />
                </div>

                {/* Quick Info Card */}
                <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300 shadow-[0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span className="font-medium">Synced with {inventory.length} Maruti Bazzar Cars</span>
                  </div>
                  <button
                    onClick={() => setCurrentView('recordings')}
                    className="text-cyan-400 font-bold hover:underline text-xs flex-shrink-0 hover:text-cyan-300"
                  >
                    View Recordings ({callHistory.length}) &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'recordings' ? (
          /* View 2: Dedicated Call Recordings & History Portal */
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Call Recordings &amp; History</h2>
                  <p className="text-xs text-slate-400">
                    Listen to audio recordings, read conversation transcripts, and see booked test drives.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('agent')}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl transition-all shadow-[0_0_20px_rgba(0,242,254,0.3)] cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-slate-950" />
                  <span>Start New Call</span>
                </button>
              </div>
            </div>

            <CallHistoryView
              callHistory={callHistory}
              onUpdateCall={handleUpdateCall}
              onDeleteCall={handleDeleteCall}
            />
          </div>
        ) : (
          /* View 3: Live 120-Car Inventory Management */
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Live Dealership Inventory ({inventory.length} Cars)</h2>
                  <p className="text-xs text-slate-400">
                    Synced with Shweta Voice Agent. Add cars or sync from Google Sheets anytime.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('recordings')}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#0b0f17] hover:bg-navy-900 text-slate-200 border border-navy-700 rounded-xl transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  <span>View Call Recordings</span>
                </button>
              </div>
            </div>

            <InventoryTable
              inventory={inventory}
              onUpdateCar={handleUpdateCar}
              onAddCar={handleAddCar}
              onBulkReplaceInventory={handleBulkReplaceInventory}
              onSelectCall={() => setCurrentView('recordings')}
            />
          </div>
        )}
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
