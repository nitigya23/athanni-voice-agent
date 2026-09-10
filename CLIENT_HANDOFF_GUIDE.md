# Client Handoff Guide: Vapi Voice AI Agent

This document explains how to ship, embed, and deploy the AI Voice Calling Agent demo to your client.

---

## 1. Quick Test / Standalone Demo Link

You can deploy this web application for free on **Vercel**, **Netlify**, or **Cloudflare Pages** so your client can test the voice agent from their phone or laptop with a single URL.

### Deploy in 3 Minutes:
1. Push this folder to a GitHub repository.
2. Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the repository and add two environment variables:
   - `VITE_VAPI_PUBLIC_KEY`: Your Vapi Public Key (from [dashboard.vapi.ai/api-keys](https://dashboard.vapi.ai/api-keys))
   - `VITE_VAPI_ASSISTANT_ID`: The Assistant ID you created.
4. Click **Deploy**. Send the live `.vercel.app` URL to your client!

---

## 2. Embedding Directly on the Client's Website

If your client wants visitors to talk to the AI directly on their existing site (Webflow, WordPress, Shopify, Wix, Squarespace, or custom HTML):

### Option A: The Vapi Floating Button Widget (Zero Code)
Add this snippet directly into their website's `<head>` or before the closing `</body>` tag:

```html
<!-- Load Vapi Widget -->
<script
  src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"
  defer
></script>

<!-- Initialize with your Assistant -->
<vapi-button
  public-key="YOUR_VAPI_PUBLIC_KEY"
  assistant-id="YOUR_ASSISTANT_ID"
></vapi-button>
```

### Option B: Embedded Iframe
If they want this exact visualizer and live transcript inside a section or portal on their website:
```html
<iframe
  src="https://your-deployed-demo-url.vercel.app"
  width="100%"
  height="700"
  frameborder="0"
  allow="microphone"
  style="border-radius: 20px; overflow: hidden;"
></iframe>
```
*(Note: The `allow="microphone"` attribute is mandatory for browser microphone access).*

---

## 3. Shipping to a Live Phone Number (Optional Telephony)

If the client also wants customers to reach the agent via regular telephone:

1. **Get a Phone Number:**
   - In [Vapi Dashboard](https://dashboard.vapi.ai/) &rarr; **Phone Numbers**, click **Buy Number** (or connect their existing Twilio/Vonage account).
2. **Assign Assistant:**
   - Select the assistant you built from the dropdown.
3. **Connect to Client's Line:**
   - The client can set up **Call Forwarding** from their existing business line to the Vapi number whenever lines are busy, after hours, or 24/7.

---

## 4. Capturing Leads & CRM Data

In the Vapi Assistant settings:
* Under **Server URL**, enter a webhook endpoint (from **Make.com**, **Zapier**, or your API).
* When each call ends, Vapi automatically sends:
  * Full audio recording link
  * Complete transcript
  * AI-generated summary
  * Extracted customer details (name, phone, booking date/time)
* Route this webhook into the client's CRM (HubSpot, GoHighLevel, Salesforce, Google Sheets, or Slack).
