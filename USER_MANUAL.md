# Athanni Softech's Voice Calling Agent
## Official User Guide & Deployment Manual

---

## 1. Executive Summary

**Athanni Softech's Voice Calling Agent** is an ultra-low latency, conversational AI voice assistant powered by Vapi, state-of-the-art speech recognition (Deepgram), large language models, and natural human-like text-to-speech synthesis (ElevenLabs).

This voice agent enables businesses to automate inbound customer inquiries, qualify leads, schedule appointments, and provide 24/7 interactive support directly through a web browser or phone line.

---

## 2. How to Use the Web Voice Agent

### Step 1: Open the Application
Navigate to your deployed web URL (e.g. `https://athanni-voice-agent.vercel.app`) on Google Chrome, Apple Safari, Microsoft Edge, or Mozilla Firefox (desktop or mobile).

### Step 2: Grant Microphone Permissions
When you first click **"Start Voice Call"**, your web browser will display a security prompt:
> *"athanni-voice-agent.vercel.app wants to use your microphone."*

Click **Allow**. (Note: Microphones only work over secure `HTTPS` connections).

### Step 3: Starting the Conversation
* Click the large glowing sphere or the **"Start Voice Call"** button.
* The visualizer will transition from **Idle** to **Connecting**, and then to **Listening**.
* Speak clearly into your microphone as you would during a regular phone call.

### Step 4: Understanding the Voice Orb Visualizer
The central interactive sphere dynamically reflects the agent's real-time state:

| State | Orb Color | Meaning |
| :--- | :--- | :--- |
| **Idle** | Deep Slate / Cyan Glow | Standby mode, waiting for call to start. |
| **Connecting** | Amber / Orange Pulse | Establishing WebRTC encrypted voice session. |
| **Listening** | Emerald / Teal Ripples | Agent is listening to your voice input. |
| **Thinking** | Soft Violet / Indigo | LLM is reasoning and generating response. |
| **Speaking** | Indigo / Purple Waves | AI is speaking back to you in real-time. |

### Step 5: Live Transcript & Call History
* The right-hand panel displays every exchange between you and the AI in real time.
* Click **"Copy"** at the top-right of the transcript panel at any time to copy the entire conversation text to your clipboard.

### Step 6: In-Call Controls
* **Mute Microphone**: Click the microphone icon to temporarily mute your voice (the orb turns red-gray to indicate you are muted). Click again to unmute.
* **End Call**: Click the red **"End Call"** button to terminate the session.

---

## 3. Embedding onto Your Client's Website

You can embed Athanni Softech's Voice Agent onto any existing website (Webflow, WordPress, Shopify, Wix, Squarespace, or custom code) using either of the following methods:

### Option A: The Floating Voice Button (Zero-Code Widget)
Paste this script just before the closing `</body>` tag on the client's website:

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
To embed the entire interface (visualizer + live transcript) inside a designated webpage section:

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
*(Important: The `allow="microphone"` attribute is required for browser voice access).*

---

## 4. Connecting to a Traditional Phone Line (Inbound & Outbound)

If your client wants to receive calls from regular phone numbers:

1. **Assign a Dedicated Phone Number:**
   * In the [Vapi Dashboard](https://dashboard.vapi.ai/), go to **Phone Numbers**.
   * Purchase a US, UK, or local number directly, or link your existing **Twilio / Vonage** account.
   * Attach Assistant ID: `4979a054-806c-45d1-bf84-e83f8a58d61e`.

2. **Call Forwarding from Existing Business Lines:**
   * The client does not need to change their existing business phone number.
   * They can enable **conditional call forwarding** (e.g., when busy or after hours) or **unconditional call forwarding** from their current telecom provider to the Vapi number.

---

## 5. Capturing Leads & CRM Automation

To send transcripts, summaries, and lead information automatically to your client's CRM (HubSpot, GoHighLevel, Salesforce, Google Sheets, or Slack):

1. Go to [dashboard.vapi.ai/assistants](https://dashboard.vapi.ai/assistants) and select your assistant (`4979a054-806c-45d1-bf84-e83f8a58d61e`).
2. Under **Server URL**, enter a webhook URL from **Make.com**, **Zapier**, or your backend.
3. At the end of every call, Vapi automatically pushes a JSON payload containing:
   * **Call Recording URL** (high-fidelity audio)
   * **Structured Call Summary**
   * **Full Timestamped Transcript**
   * **Customer Details** (name, phone number, booked slots, user intent)

---

## 6. Best Practices for Optimal Call Quality

* **Headphones / Quiet Space:** For the cleanest experience, use headphones or ensure there is minimal background speaker echo.
* **Natural Conversation:** Speak naturally. The agent supports natural turn-taking and handles brief conversational pauses seamlessly.
* **Barge-in / Interruptibility:** If you start speaking while the agent is talking, the agent will automatically pause and listen to your new input.

---

## 7. Support & Contact

Developed and delivered by:
**Athanni Softech**  
*Next-Generation AI Voice & Automation Solutions*
