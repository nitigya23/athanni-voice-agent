# Maruti Bazaar Voice Calling Agent
## Official User Guide, Implementation Manual & Testing Reference

---

## 🔑 Live Testing Credentials & Portal Links

| Resource | Value / Link |
| :--- | :--- |
| **Production Web App** | [https://athanni-voice-agent.vercel.app](https://athanni-voice-agent.vercel.app) |
| **Vapi Public API Key** | `90fb2000-8816-4057-9c1a-2c94bd7dfa67` |
| **Vapi Assistant ID** | `4979a054-806c-45d1-bf84-e83f8a58d61e` |
| **Vapi API Keys Dashboard** | [https://dashboard.vapi.ai/api-keys](https://dashboard.vapi.ai/api-keys) |
| **Vapi Assistant Settings** | [https://dashboard.vapi.ai/assistants](https://dashboard.vapi.ai/assistants) |
| **GitHub Source Code Repository** | [https://github.com/nitigya23/athanni-voice-agent](https://github.com/nitigya23/athanni-voice-agent) |
| **Official PDF Download** | [Download PDF Manual](https://github.com/nitigya23/athanni-voice-agent/raw/main/Maruti_Bazaar_Voice_Calling_Agent_Manual.pdf) |

---

## 1. Executive Summary

**Maruti Bazaar Voice Calling Agent** is an enterprise-grade, ultra-low latency conversational AI voice assistant. Built on Vapi's real-time orchestration engine, it integrates state-of-the-art speech recognition (Deepgram Nova-2), advanced large language models (LLMs), and hyper-realistic human voice synthesis (ElevenLabs).

Designed for agencies and enterprises, this solution automates customer support, inbound lead qualification, appointment booking, and routine phone interactions 24 hours a day, 7 days a week, across web browsers and telephone networks.

---

## 2. Complete Feature Breakdown

### 🎙️ 2.1. Core Voice & Conversational AI Features

* **Ultra-Low Latency Streaming (<700ms Response Time):**
  Uses WebRTC audio streaming to deliver lightning-fast response times, eliminating the awkward pauses common in traditional chatbots.
* **Human-Grade Neural Voice Synthesis (ElevenLabs):**
  Produces fluid, natural speech complete with emotional inflection, realistic pauses, and human intonation.
* **Continuous Real-Time Speech Recognition (Deepgram Nova-2):**
  High-accuracy, multi-accent speech-to-text processing that understands diverse pronunciations, industry jargon, and background audio.
* **Barge-In & Natural Interruption Handling:**
  Callers can interrupt the AI at any moment mid-sentence. The agent immediately silences its voice output, updates its context, and listens to the caller's new inquiry.
* **Smart Voice Activity Detection (VAD):**
  Distinguishes between natural speech pauses, thinking hesitations, and completed statements to avoid premature cutoffs.
* **Adaptive Noise & Echo Suppression:**
  Filters out ambient noise, background chatter, and speaker feedback for clear audio quality on mobile devices and laptops.

---

### 💻 2.2. Web Portal & Interactive UI Features

* **3D Audio-Reactive Voice Orb:**
  An interactive central visualizer with dynamic glowing ripples and animations that transitions seamlessly across 5 lifecycle states:
  * **Idle**: Ambient cyan pulse indicating the agent is online and ready.
  * **Connecting**: Amber pulse during WebRTC session handshake.
  * **Listening**: Emerald/teal ripple waves responding to the user's speech.
  * **Thinking**: Violet breathing glow while the LLM reasons.
  * **Speaking**: Indigo wave animations while the AI is talking.
* **Dynamic Audio Waveform Meter:**
  Real-time audio level bars that react directly to microphone input and speaker volume.
* **Live Dual-Channel Transcript:**
  Displays the conversation in real time with distinct avatars, role badges (`YOU` vs `ASSISTANT`), and precise message timestamps.
* **1-Click Transcript Copy to Clipboard:**
  Allows clients, managers, and QA teams to copy the full conversation transcript for instant sharing, ticket logging, or CRM entry.
* **In-Call Controls:**
  * **Instant Mute/Unmute**: Visual feedback when the caller's microphone is muted (turns crimson/slate).
  * **Live Call Timer**: Counts call duration in real time.
  * **1-Click Call Disconnect**: Gracefully terminates the WebRTC session and audio streams.
* **In-App Credentials Manager (Settings Modal):**
  Allows clients to test and switch between multiple Assistant IDs and Public Keys directly in the browser with persistent local storage.

---

## 3. Production Code Snippets (From the Web App)

### Snippet 1: Zero-Code Floating Button (HTML / Webflow / WordPress / Shopify / Wix)
Paste this script directly before the closing `</body>` tag of any website:

```html
<!-- 1. Load Vapi Web SDK -->
<script
  src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"
  defer
></script>

<!-- 2. Athanni Softech Live Voice Trigger -->
<vapi-button
  public-key="90fb2000-8816-4057-9c1a-2c94bd7dfa67"
  assistant-id="4979a054-806c-45d1-bf84-e83f8a58d61e"
></vapi-button>
```

---

### Snippet 2: React / Next.js Component (Real Code from `src/App.jsx`)
Uses `@vapi-ai/web` for custom WebRTC call state and live streaming transcripts:

```javascript
import { useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';

const vapi = new Vapi('90fb2000-8816-4057-9c1a-2c94bd7dfa67');
const ASSISTANT_ID = '4979a054-806c-45d1-bf84-e83f8a58d61e';

export default function VoiceAgentButton() {
  const [status, setStatus] = useState('idle'); // idle | listening | speaking | thinking
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    vapi.on('call-start', () => setStatus('listening'));
    vapi.on('call-end', () => setStatus('idle'));
    vapi.on('speech-start', () => setStatus('speaking'));
    vapi.on('speech-end', () => setStatus('listening'));
    vapi.on('message', (msg) => {
      if (msg.type === 'transcript') {
        setMessages((prev) => [...prev, { role: msg.role, text: msg.transcript }]);
      }
    });
    return () => vapi.stop();
  }, []);

  const handleToggleCall = () => {
    if (status === 'idle') {
      vapi.start(ASSISTANT_ID);
    } else {
      vapi.stop();
    }
  };

  return (
    <button onClick={handleToggleCall} className="px-6 py-3 bg-teal-500 text-white rounded-xl">
      {status === 'idle' ? 'Start Voice Call' : `End Call (${status})`}
    </button>
  );
}
```

---

### Snippet 3: Full-Portal Iframe Embed
Embeds the complete Maruti Bazaar portal inside a website section:

```html
<iframe
  src="https://athanni-voice-agent.vercel.app"
  width="100%"
  height="720"
  frameborder="0"
  allow="microphone"
  style="border-radius: 20px; border: 1px solid #1e293b; overflow: hidden;"
></iframe>
```

---

## 4. Telephony & CRM Automation

1. **Dedicated Phone Numbers:**
   * In [Vapi Phone Numbers](https://dashboard.vapi.ai/phone-numbers), buy or import a number (Twilio/Vonage).
   * Assign Assistant ID: `4979a054-806c-45d1-bf84-e83f8a58d61e`.
2. **Call Forwarding:**
   * Forward client's existing business phone to the Vapi number on busy or after-hours.
3. **Automated CRM Webhook:**
   * Under [Assistant Settings](https://dashboard.vapi.ai/assistants), set **Server URL** to forward recordings, summaries, and transcripts to Make.com / HubSpot / Zapier.

---

## 5. Support & Contact

Delivered and maintained by:  
**Maruti Bazaar**  
*Next-Generation AI Voice & Automation Solutions*
