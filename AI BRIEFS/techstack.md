# Pressure Interview Pro - Technical Stack

This document outlines the core technologies and architecture used to build the Pressure Interview Pro platform.

---

## 1. Core Frontend Framework
*   **React (v19):** Modern component-based architecture for UI and state management.
*   **TypeScript:** Type-safe development environment for robust, error-resistant code.
*   **Vite:** High-performance build tool and development server with Hot Module Replacement (HMR).

## 2. Artificial Intelligence Intelligence (The Brain)
*   **Google Gemini Multimodal Live API:** Powers the real-time, low-latency "Victor" persona.
*   **Model:** `gemini-2.5-flash-native-audio-preview` (Streaming-optimized for audio).
*   **Multilingual Support:** Native reasoning and vocal synthesis in English, Spanish, and Russian.
*   **SDK:** `@google/genai` (Official integration for browser-based Live API sessions).

## 3. Real-Time Audio Engine
*   **Web Audio API:**
    *   **AudioContext:** Manages audio lifecycle and hardware interfacing.
    *   **Microphone Streaming:** Captured via `getUserMedia` and processed into 16-bit PCM (16kHz).
    *   **Model Audio Output:** Received as Base64 chunks, decoded, and played via `AudioBufferSourceNode` (24kHz).
    *   **Latency Control:** Fine-tuned buffer sizes (2048 samples) and parallel decoding for immediate responses.

## 4. Design & Aesthetics
*   **Vanilla CSS + Utility Utilities:** High-end glassmorphism and dark-mode aesthetic.
*   **Tailwind CSS:** Responsive layout management and rapid UI iteration.
*   **Dynamic Animations:** 
    *   Neon pulse indicators for session status.
    *   Custom scrollbars and transition effects for "Pressure" immersion.
*   **Lucide Icons:** Modern, minimal icon set for a premium feel.

## 6. Infrastructure & DevOps
*   **Vercel:** Production hosting with automated CI/CD pipelines linked to GitHub.
*   **Environment Variables:** Secure local and production storage for `VITE_GEMINI_API_KEY`.
*   **GitHub:** Version control and source of truth for the project.

---

## 💰 7. Cost & Operations Estimate (Gemini 2.0 Flash)

Based on current Google AI Studio / Vertex AI pricing for the **Flash** model, here is a breakdown of the estimated operational costs per session.

### **Unit Costs (Pay-As-You-Go)**
*   **Input Audio:** ~$0.10 / 1M tokens (~$0.008 per minute of user speaking)
*   **Output Audio:** ~$0.40 / 1M tokens (~$0.048 per minute of Victor speaking)
*   **Text Processing:** Negligible for short prompts.

### **The "Simulated Minute" Calculation**
In a typical 1-minute exchange (30s User / 30s Victor):
*   **User Phase:** $0.004
*   **Victor Phase:** $0.024
*   **Estimated Total:** **~$0.028 per minute**

### **Projections**
*   **Standard Interview (5 Min):** ~$0.14 - $0.20 USD
*   **High Performance (1 Hour of Active Interaction):** ~$1.68 - $2.40 USD

*Note: Costs are significantly lower if utilizing the Google AI Studio Free Tier (within rate limits).*

---
**Prepared By:** Antigravity AI Assistant  
**Last Updated:** February 4, 2026
