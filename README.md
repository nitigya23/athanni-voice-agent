# Vapi Voice Calling Web Client & Demo Portal

A responsive, modern web application and widget to demo, test, and ship your Vapi AI voice calling agent to clients.

## Features
- **Live Voice Interaction**: Powered by `@vapi-ai/web` with real-time WebRTC audio streaming.
- **Dynamic Audio Visualizer**: 3D pulsing orb that reacts dynamically to voice volume, speaking, listening, and thinking states.
- **Live Transcripts**: Displays real-time conversation messages with speaker labels, timestamps, and a 1-click copy button.
- **Interactive Settings Modal**: Switch between different Assistant IDs and Public Keys directly in the UI without editing code.
- **Embed Snippet Generator**: 1-click generation of ready-to-paste snippets for HTML/Webflow, React/Next.js, and iframe embeds.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure credentials (Optional)
Create a `.env` file or click the **Settings** icon in the UI:
```env
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
VITE_VAPI_ASSISTANT_ID=your_vapi_assistant_id
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```
The output files in `dist/` can be dropped onto Vercel, Netlify, or any static web host.
