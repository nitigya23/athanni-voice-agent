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
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col h-full overflow-hidden backdrop-blur-md shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/40">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Live Transcript
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
            {messages.length} lines
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <>
              <button
                onClick={handleCopy}
                title="Copy conversation"
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {onClear && (
                <button
                  onClick={onClear}
                  title="Clear transcript"
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar min-h-[220px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-10 space-y-2">
            <Bot className="w-8 h-8 opacity-40 text-slate-400" />
            <p className="text-sm">Conversation transcript will stream live here</p>
            <p className="text-xs text-slate-600">Start the call to begin chatting</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 text-sm ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                    isUser
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                      : 'bg-slate-800 border border-slate-700 text-teal-300'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm text-xs leading-relaxed ${
                    isUser
                      ? 'bg-teal-700/70 text-teal-50 rounded-tr-none border border-teal-600/50'
                      : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-[10px] opacity-70 uppercase tracking-wider">
                      {isUser ? 'You' : 'Assistant'}
                    </span>
                    {msg.time && (
                      <span className="text-[9px] opacity-40">{msg.time}</span>
                    )}
                  </div>
                  <p className="break-words">{msg.text}</p>
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
