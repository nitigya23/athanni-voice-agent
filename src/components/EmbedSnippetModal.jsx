import React, { useState } from 'react';
import { Code, X, Copy, Check, Globe, Layers } from 'lucide-react';

export default function EmbedSnippetModal({ isOpen, onClose, apiKey, assistantId }) {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const validKey = apiKey || 'YOUR_VAPI_PUBLIC_KEY';
  const validAsstId = assistantId || 'YOUR_ASSISTANT_ID';

  const snippets = {
    html: `<!-- 1. Place this script before closing </body> tag -->
<script
  src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"
  defer
></script>

<!-- 2. Place this button where you want the voice agent to appear -->
<vapi-button
  public-key="${validKey}"
  assistant-id="${validAsstId}"
></vapi-button>`,

    react: `// Install: npm install @vapi-ai/web
import { useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';

const vapi = new Vapi('${validKey}');

export default function VoiceWidget() {
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    vapi.on('call-start', () => setIsCalling(true));
    vapi.on('call-end', () => setIsCalling(false));
  }, []);

  const toggleCall = () => {
    if (isCalling) {
      vapi.stop();
    } else {
      vapi.start('${validAsstId}');
    }
  };

  return (
    <button
      onClick={toggleCall}
      className="px-4 py-2 bg-teal-500 text-white rounded-full font-medium"
    >
      {isCalling ? 'End Call' : 'Talk with Voice AI'}
    </button>
  );
}`,

    iframe: `<!-- Embed Full Voice Agent Frame (once hosted on Vercel/Netlify) -->
<iframe
  src="https://your-deployed-domain.com"
  width="100%"
  height="600"
  frameBorder="0"
  allow="microphone"
  style="border-radius: 16px;"
></iframe>`
  };

  const currentSnippet = snippets[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-teal-400" />
            <h3 className="font-semibold text-slate-100 text-sm">
              Embed & Ship Code Snippets
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-2">
          {[
            { id: 'html', label: 'HTML / Webflow / WP', icon: <Globe className="w-3.5 h-3.5" /> },
            { id: 'react', label: 'React / Next.js', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'iframe', label: 'Iframe Embed', icon: <Code className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-teal-400 text-teal-400 bg-teal-500/5 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Paste directly into your client's website:
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition-all shadow-md shadow-teal-600/20 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto custom-scrollbar max-h-72">
              <code>{currentSnippet}</code>
            </pre>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            * Remember: Browsers require users to grant microphone permissions over HTTPS before the voice agent can stream audio.
          </p>
        </div>
      </div>
    </div>
  );
}
