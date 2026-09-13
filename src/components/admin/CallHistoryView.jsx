import React, { useState, useRef, useMemo } from 'react';
import {
  PhoneCall,
  Play,
  Pause,
  Clock,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Volume2,
  Search,
  Car,
  Download,
  Edit3,
  Trash2,
  Save,
  ChevronRight,
  Sparkles,
  LayoutList,
  Columns,
  X,
  TrendingUp,
  Tag
} from 'lucide-react';

export default function CallHistoryView({
  callHistory = [],
  activeCallHighlight = null,
  onUpdateCall = () => {},
  onDeleteCall = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'BOOKED' | 'UNBOOKED'
  const [selectedCallId, setSelectedCallId] = useState(() => {
    return activeCallHighlight || (callHistory.length > 0 ? callHistory[0].callId : null);
  });
  const [playingCallId, setPlayingCallId] = useState(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [viewLayout, setViewLayout] = useState('split'); // 'split' | 'table'
  const [editingCall, setEditingCall] = useState(null);

  const audioRef = useRef(null);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = callHistory.length;
    const booked = callHistory.filter((c) => c.testDriveBooked === 'Yes').length;
    const unbooked = total - booked;
    const conversionRate = total > 0 ? Math.round((booked / total) * 100) : 0;
    return { total, booked, unbooked, conversionRate };
  }, [callHistory]);

  // Filtered calls
  const filteredCalls = useMemo(() => {
    return callHistory.filter((call) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        call.customerName.toLowerCase().includes(q) ||
        call.customerPhone.includes(q) ||
        call.carRequested.toLowerCase().includes(q) ||
        call.callId.toLowerCase().includes(q);

      const matchesTab =
        activeTab === 'ALL' ||
        (activeTab === 'BOOKED' && call.testDriveBooked === 'Yes') ||
        (activeTab === 'UNBOOKED' && call.testDriveBooked === 'No');

      return matchesSearch && matchesTab;
    });
  }, [callHistory, searchQuery, activeTab]);

  // Active selected call
  const activeCall = useMemo(() => {
    if (!selectedCallId && filteredCalls.length > 0) return filteredCalls[0];
    return callHistory.find((c) => c.callId === selectedCallId) || filteredCalls[0] || null;
  }, [callHistory, selectedCallId, filteredCalls]);

  // Audio Play/Pause handling
  const handleToggleAudio = (call) => {
    if (!call) return;
    if (playingCallId === call.callId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingCallId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingCallId(call.callId);
      setSelectedCallId(call.callId);
      if (audioRef.current && call.recordingUrl) {
        audioRef.current.src = call.recordingUrl;
        audioRef.current.play().catch((err) => console.log('Playback note:', err));
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const prog = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setPlaybackProgress(prog);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingCall) return;
    onUpdateCall(editingCall.callId, editingCall);
    setEditingCall(null);
  };

  return (
    <div className="space-y-4">
      {/* Native audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setPlayingCallId(null);
          setPlaybackProgress(0);
        }}
        onError={() => {
          setPlayingCallId(null);
          setPlaybackProgress(0);
        }}
      />

      {/* 1. Quick KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Total Calls</span>
            <PhoneCall className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats.total}</div>
          <div className="text-[11px] text-cyan-400 font-bold mt-0.5">Recorded Calls</div>
        </div>

        <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Test Drives Booked</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">{stats.booked}</div>
          <div className="text-[11px] text-emerald-400 font-bold mt-0.5">Slots Confirmed</div>
        </div>

        <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Inquiries Only</span>
            <XCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-200 font-mono">{stats.unbooked}</div>
          <div className="text-[11px] text-slate-400 font-semibold mt-0.5">No Booking Yet</div>
        </div>

        <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Booking Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono drop-shadow-[0_0_8px_rgba(0,242,254,0.4)]">{stats.conversionRate}%</div>
          <div className="text-[11px] text-cyan-400 font-bold mt-0.5">Customer Conversion</div>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {/* Search */}
        <div className="relative w-full md:w-88">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or car..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b0f17] border border-[#182c60]/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
          />
        </div>

        {/* Tab Filters & View Toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Status Tabs */}
          <div className="flex bg-[#0b0f17] border border-[#182c60]/80 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-navy-900 text-cyan-300 shadow-[0_0_10px_rgba(0,242,254,0.2)] border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({callHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('BOOKED')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'BOOKED'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Booked ({stats.booked})</span>
            </button>
            <button
              onClick={() => setActiveTab('UNBOOKED')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'UNBOOKED'
                  ? 'bg-navy-900 text-slate-200 border border-navy-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Inquiries ({stats.unbooked})</span>
            </button>
          </div>

          {/* Layout Toggle (Split View vs Full Table) */}
          <div className="flex bg-[#0b0f17] border border-[#182c60]/80 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewLayout('split')}
              className={`p-2 rounded-lg transition-all ${
                viewLayout === 'split' ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-extrabold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Cards & Player Split View"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('table')}
              className={`p-2 rounded-lg transition-all ${
                viewLayout === 'table' ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-extrabold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content: Split Master-Detail or Compact Table */}
      {viewLayout === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Organized Call Cards List */}
          <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto custom-scrollbar pr-1">
            {filteredCalls.length === 0 ? (
              <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl p-8 text-center text-slate-500 shadow-sm">
                <PhoneCall className="w-8 h-8 mx-auto mb-2 opacity-40 text-cyan-400" />
                <p className="text-xs font-semibold text-slate-400">No calls match your filter</p>
              </div>
            ) : (
              filteredCalls.map((call) => {
                const isSelected = activeCall?.callId === call.callId;
                const isPlaying = playingCallId === call.callId;
                const isBooked = call.testDriveBooked === 'Yes';

                return (
                  <div
                    key={call.callId}
                    onClick={() => setSelectedCallId(call.callId)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-navy-900/90 border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.25)]'
                        : 'bg-[#0a1228]/70 border-[#182c60]/70 hover:border-cyan-500/40 hover:bg-[#0a1228] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white flex items-center gap-1.5 text-sm">
                          <User className="w-4 h-4 text-cyan-400" />
                          {call.customerName}
                        </span>
                        <span className="text-xs font-mono font-semibold text-cyan-300">
                          {call.customerPhone}
                        </span>
                      </div>

                      {/* Status Tag */}
                      {isBooked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Booked
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 bg-[#0b0f17] px-2.5 py-0.5 rounded-full border border-navy-800">
                          Inquiry
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-200 font-semibold truncate mb-2">
                      <Car className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
                      {call.carRequested}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-[#182c60]/60">
                      <span>{call.timestamp}</span>
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-slate-300">{call.duration}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAudio(call);
                          }}
                          className={`p-1.5 rounded-xl transition-colors ${
                            isPlaying
                              ? 'bg-amber-500 text-slate-950 animate-pulse'
                              : 'bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30'
                          }`}
                          title="Play/Pause recording"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Inspection Drawer (Player, Details, Full Transcript) */}
          <div className="lg:col-span-7 bg-[#0a1228]/85 border border-[#182c60]/90 rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col min-h-[550px] max-h-[700px]">
            {activeCall ? (
              <div className="flex flex-col h-full space-y-4">
                {/* Header info */}
                <div className="flex items-start justify-between border-b border-[#182c60]/80 pb-3 gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-cyan-400" />
                        {activeCall.customerName}
                      </h3>
                      <span className="font-mono text-xs text-cyan-300 font-bold">
                        {activeCall.customerPhone}
                      </span>
                      <span className="text-[11px] bg-[#0b0f17] text-slate-300 px-2.5 py-0.5 rounded-full font-mono font-semibold border border-navy-800">
                        {activeCall.callId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {activeCall.timestamp} &bull; Call Length: <strong className="text-slate-200">{activeCall.duration}</strong>
                    </p>
                  </div>

                  {/* Top actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingCall({ ...activeCall })}
                      className="p-2.5 bg-navy-900 hover:bg-navy-800 text-slate-200 rounded-xl text-xs font-semibold border border-navy-700 transition-colors flex items-center gap-1.5"
                      title="Edit Customer Details"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    {activeCall.recordingUrl && (
                      <a
                        href={activeCall.recordingUrl}
                        download={`${activeCall.callId}_recording.webm`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-navy-900 hover:bg-navy-800 text-slate-200 hover:text-cyan-400 rounded-xl text-xs font-semibold border border-navy-700 transition-colors flex items-center gap-1.5"
                        title="Download Audio File"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Audio</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Built-in Audio Player Bar */}
                <div className="bg-[#0b0f17] border border-[#182c60]/80 rounded-2xl p-4 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleAudio(activeCall)}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer ${
                          playingCallId === activeCall.callId
                            ? 'bg-amber-500 text-slate-950 shadow-amber-500/20 animate-pulse'
                            : 'bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                        }`}
                      >
                        {playingCallId === activeCall.callId ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                      <div>
                        <div className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4 text-cyan-400" />
                          <span>Voice Recording (Caller &amp; Agent)</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {playingCallId === activeCall.callId ? 'Playing audio recording now...' : 'Click to listen to this phone call'}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30">
                      {activeCall.duration}
                    </span>
                  </div>

                  {/* Playback progress bar */}
                  {playingCallId === activeCall.callId && (
                    <div className="w-full bg-navy-900 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-200 shadow-[0_0_8px_#00f2fe]"
                        style={{ width: `${playbackProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Test Drive Booking Card */}
                <div
                  className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${
                    activeCall.testDriveBooked === 'Yes'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'bg-[#0b0f17] border-[#182c60]/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {activeCall.testDriveBooked === 'Yes' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-xs sm:text-sm">
                        {activeCall.testDriveBooked === 'Yes'
                          ? 'Test Drive Booked & Confirmed'
                          : 'General Inquiry (No Test Drive Booked)'}
                      </span>
                      {activeCall.testDriveBooked === 'Yes' && (
                        <p className="text-xs font-semibold text-emerald-300 mt-0.5">
                          Scheduled Slot: <strong>{activeCall.bookingSlot}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] font-bold bg-[#060b18] text-slate-300 px-3 py-1 rounded-xl border border-navy-800">
                    {activeCall.sentiment || 'Vehicle Lead'}
                  </span>
                </div>

                {/* Full Transcript Box */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Conversation Transcript
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {activeCall.transcript?.length || 0} messages
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 bg-[#0b0f17] border border-[#182c60]/80 rounded-2xl p-4">
                    {activeCall.transcript?.map((msg, i) => {
                      const isUser = msg.role === 'user';
                      return (
                        <div
                          key={i}
                          className={`flex gap-2.5 text-xs ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[10px] ${
                              isUser ? 'bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 font-black' : 'bg-navy-900 text-cyan-300 border border-navy-700'
                            }`}
                          >
                            {isUser ? 'C' : 'AI'}
                          </div>
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                              isUser
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold rounded-tr-none'
                                : 'bg-[#060b18] text-slate-100 rounded-tl-none border border-navy-700/60 shadow-xs'
                            }`}
                          >
                            <p className={`font-bold text-[10px] uppercase tracking-wider mb-0.5 ${isUser ? 'text-slate-950/80 font-black' : 'text-cyan-400'}`}>
                              {isUser ? activeCall.customerName : 'Shweta (Maruti Bazzar)'}
                            </p>
                            <p className="text-xs font-medium">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="m-auto text-center text-slate-500 text-xs">
                Select a call from the list to view recording &amp; transcript details
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Compact Full Table View */
        <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#182c60]/80 bg-[#0b0f17] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Call ID</th>
                  <th className="py-3.5 px-4">Customer Name &amp; Phone</th>
                  <th className="py-3.5 px-4">Vehicle Inquired</th>
                  <th className="py-3.5 px-4 text-center">Test Drive Booked?</th>
                  <th className="py-3.5 px-4">Scheduled Slot</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182c60]/60">
                {filteredCalls.map((call) => {
                  const isPlaying = playingCallId === call.callId;
                  const isBooked = call.testDriveBooked === 'Yes';
                  return (
                    <tr
                      key={call.callId}
                      onClick={() => {
                        setSelectedCallId(call.callId);
                        setViewLayout('split');
                      }}
                      className="hover:bg-navy-900/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">{call.callId}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{call.customerName}</div>
                        <div className="text-[11px] font-mono text-cyan-300">{call.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-200">{call.carRequested}</td>
                      <td className="py-3.5 px-4 text-center">
                        {isBooked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-[#0b0f17] px-2.5 py-0.5 rounded-full border border-navy-800">
                            <XCircle className="w-3 h-3 text-slate-400" /> No
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{call.bookingSlot}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{call.duration}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAudio(call);
                          }}
                          className={`p-2 rounded-xl transition-colors mr-1 ${
                            isPlaying
                              ? 'bg-amber-500 text-slate-950 animate-pulse'
                              : 'bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold'
                          }`}
                          title="Play recording"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Customer Details Modal */}
      {editingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-[#0a1228] border border-[#182c60] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#182c60] bg-[#060b18]">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Edit Customer Record</span>
              </h3>
              <button
                onClick={() => setEditingCall(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Customer Name:</label>
                <input
                  type="text"
                  value={editingCall.customerName}
                  onChange={(e) =>
                    setEditingCall({ ...editingCall, customerName: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Customer Contact / Phone:</label>
                <input
                  type="text"
                  value={editingCall.customerPhone}
                  onChange={(e) =>
                    setEditingCall({ ...editingCall, customerPhone: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Car Inquired / Requested:</label>
                <input
                  type="text"
                  value={editingCall.carRequested}
                  onChange={(e) =>
                    setEditingCall({ ...editingCall, carRequested: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Test Drive Booked?</label>
                <select
                  value={editingCall.testDriveBooked}
                  onChange={(e) =>
                    setEditingCall({ ...editingCall, testDriveBooked: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-teal-500"
                >
                  <option value="Yes">Yes (Test Drive Scheduled)</option>
                  <option value="No">No (Inquiry Only)</option>
                </select>
              </div>

              {editingCall.testDriveBooked === 'Yes' && (
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Scheduled Slot Date &amp; Time:</label>
                  <input
                    type="text"
                    value={editingCall.bookingSlot}
                    onChange={(e) =>
                      setEditingCall({ ...editingCall, bookingSlot: e.target.value })
                    }
                    placeholder="e.g. 15 Sep 2026, 11:00 AM"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCall(null)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md shadow-teal-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
