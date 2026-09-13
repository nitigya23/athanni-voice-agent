import React, { useRef, useEffect, useState } from 'react';
import { Copy, Check, MessageSquare, Bot, User, Trash2 } from 'lucide-react';

export default function TranscriptView({ messages = [], onClear }) {
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopy = () => {
    if (messages.length === 0) return;
    const text = messages
      .map((m) => `[${m.role.toUpperCase()}]: ${m.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a1228]/85 border border-[#182c60]/90 rounded-2xl flex flex-col h-full overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#182c60]/80 bg-[#060b18]/90">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Live Conversation
          </span>
          <span className="text-[11px] font-semibold bg-[#0b0f17] text-cyan-300 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
            {messages.length} lines
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <>
              <button
                onClick={handleCopy}
                title="Copy conversation"
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-200 border border-navy-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              {onClear && (
                <button
                  onClick={onClear}
                  title="Clear conversation"
                  className="p-1.5 rounded-xl hover:bg-red-950/30 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar min-h-[240px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12 space-y-2">
            <Bot className="w-10 h-10 opacity-30 text-cyan-400" />
            <p className="text-sm font-medium text-slate-300">Your live chat will show here</p>
            <p className="text-xs text-slate-500">Tap "Start Voice Call" to begin speaking with Shweta</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-2.5 text-sm ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 font-black shadow-sm'
                      : 'bg-navy-900 border border-navy-700 text-cyan-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4 text-slate-950" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 shadow-sm text-xs leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold rounded-tr-none shadow-[0_4px_15px_rgba(0,242,254,0.25)]'
                      : 'bg-[#0b0f17]/95 text-slate-100 rounded-tl-none border border-navy-700/60 shadow-[0_2px_10px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`font-bold text-[10px] uppercase tracking-wider ${isUser ? 'text-slate-950/80 font-extrabold' : 'text-cyan-400/80'}`}>
                      {isUser ? 'You (Customer)' : 'Shweta (Agent)'}
                    </span>
                    {msg.time && (
                      <span className={`text-[9px] ${isUser ? 'text-slate-950/70' : 'text-slate-500'}`}>{msg.time}</span>
                    )}
                  </div>
                  <p className="break-words font-medium">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
