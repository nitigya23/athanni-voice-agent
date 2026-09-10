# Athanni Softech's Voice Calling Agent
## Official User Guide & Comprehensive Feature Manual

---

## 1. Executive Summary

**Athanni Softech's Voice Calling Agent** is an enterprise-grade, ultra-low latency conversational AI voice assistant. Built on Vapi's real-time orchestration engine, it integrates state-of-the-art speech recognition (Deepgram Nova-2), advanced large language models (LLMs), and hyper-realistic human voice synthesis (ElevenLabs).

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
* **1-Click Embed Snippet Generator Modal:**
  Generates ready-to-copy code snippets for:
  * **Vanilla HTML / Webflow / WordPress / Shopify** (Floating script tag)
  * **React / Next.js** (Custom component code)
  * **Iframe Embed** (Full interactive portal frame)
* **Dark Mode & Fully Responsive Design:**
  Optimized for smartphones, tablets, and desktop displays with custom scrollbars and backdrop blur effects.

---

### 📞 2.3. Enterprise Telephony & Phone Integration

* **Dedicated Inbound & Outbound Phone Numbers:**
  Assign US, UK, Canadian, or local international phone numbers directly via Vapi or linked **Twilio / Vonage** SIP trunks.
* **Smart Call Forwarding Support:**
  Compatible with existing business phone systems. Clients can forward calls after business hours, when lines are busy, or 24/7 without changing their existing public phone number.
* **Outbound Calling Automation:**
  Can trigger automated outbound phone calls via Vapi's REST API whenever a new lead submits a web form.

---

### ⚡ 2.4. Data Integration & CRM Automation

* **Automated Post-Call Webhooks:**
  Pushes an automated JSON report to **Make.com**, **Zapier**, or a custom API the second a call finishes.
* **High-Fidelity Audio Recording Link:**
  Every call automatically generates a downloadable audio recording link for quality monitoring and compliance.
* **AI-Generated Call Summary:**
  Condenses lengthy voice conversations into bulleted key points, action items, and caller sentiment.
* **Structured Data Extraction:**
  Automatically parses caller name, contact information, appointment date/time, and qualification status.
* **Direct CRM Synchronization:**
  Enables 1-click sync into GoHighLevel, HubSpot, Salesforce, Zoho, Google Sheets, or Slack.

---

## 3. How to Use the Web Voice Agent

### Step 1: Access the Link
Navigate to your deployed URL (e.g. `https://athanni-voice-agent.vercel.app`) on Google Chrome, Apple Safari, or Microsoft Edge.

### Step 2: Grant Microphone Permissions
Click **"Start Voice Call"**. When prompted by your browser:
> *"athanni-voice-agent.vercel.app wants to use your microphone."*

Click **Allow**. (Microphones require secure `HTTPS`).

### Step 3: Speak Naturally
* Once the status shows **Listening**, speak as you would on a regular phone call.
* If you want to change topics or ask a question while the AI is talking, simply speak up—the agent will immediately pause and listen to you.

### Step 4: End & Review
* Click **"End Call"** when finished.
* Review the live transcript and click **"Copy"** to save the conversation notes.

---

## 4. Website Embedding Guide

### Option A: The Floating Voice Button (Zero Code)
Add this script before the closing `</body>` tag of any website:

```html
<!-- 1. Load Vapi Web SDK -->
<script
  src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"
  defer
></script>

<!-- 2. Voice Call Floating Trigger -->
<vapi-button
  public-key="90fb2000-8816-4057-9c1a-2c94bd7dfa67"
  assistant-id="4979a054-806c-45d1-bf84-e83f8a58d61e"
></vapi-button>
```

### Option B: Dedicated Full-Page / Embedded Section (Iframe)
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

## 5. Telephony & Phone Setup

1. In [Vapi Dashboard](https://dashboard.vapi.ai/) &rarr; **Phone Numbers**, buy or link a number.
2. Select your assistant ID: `4979a054-806c-45d1-bf84-e83f8a58d61e`.
3. Set up **Call Forwarding** on the client's office phone system to forward unanswered or after-hours calls to this Vapi number.

---

## 6. Support & Contact

Delivered and maintained by:  
**Athanni Softech**  
*Next-Generation AI Voice & Automation Solutions*
