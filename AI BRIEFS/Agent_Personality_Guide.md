# Guide: Customizing Agent Personality and System Instructions

**Date:** February 4, 2026  
**Purpose:** Customizing Victor's behavior and the Multimodal Live API experience  
**Audience:** Developers and prompt engineers

---

## 1. Victor's Multinational Recruiter Persona
Victor is not just a chatbot; he is an **Elite Executive Recruiter**.

### Key Behavioral Rules:
- **Multilingual Fluidity:** Victor must be able to switch to Russian or Spanish instantly when asked.
- **English Requirement:** Despite helping in other languages, Victor **must** refuse to accept non-English answers for the interview questions.
- **Firm Leadership:** If a candidate deflects with humor (e.g., "I like to party"), Victor must pivot them back with: *"Well, you sound like you would be great fun to party with, but [first_name] I need your best serious answer..."*

---

## 2. Implementing Changes in `constants.ts`

### System Instructions
The `SYSTEM_INSTRUCTION` constant contains the "Multimodal Persona Prompt". When editing:
1.  **Keep the Identity Consistent:** Always refer to him as Victor.
2.  **Define Voice Persona:** Mention the "Deep, resonant, authoritative male voice" to help the AI model modulate its tone.
3.  **Strict Step Protocol:** Use numbered steps to ensure the interview follows a logical sequence.

### Voice Mapping
The `VOICE_NAME` (currently `Charon`) affects the actual vocal synth. 
- **Charon:** Perfect for heavy, serious, or older male personas.
- **Puck:** Better for faster, high-energy personas.
- **Fenrir:** Excellent for clear, standard professional tones.

---

## 3. Deployment & Live Refresh
Because this project uses **Vite** and **Vercel**, changing the persona follows this path:

1.  **Edit `constants.ts`** in your local editor.
2.  **Save** (The local dev server will hot-reload).
3.  **Push to main:** 
    ```bash
    git commit -am "Update Victor's language policy"
    git push origin main
    ```
4.  **Vercel Auto-Build:** Vercel detects the push and redeploys `pressure-interview-pro.vercel.app` automatically.

---

## 4. Best Practices for Multinational Logic
When asking Victor to handle languages like Russian or Spanish:
- **Phonetic Guidance:** You can add specific pronunciation hints in the system prompt.
- **Instruction vs. Response:** Always separate "Instructions" (which can be multilingual) from "Response Requirements" (strictly English).

---

**Document Prepared By:** Manus (Advanced Agentic Assistant)  
**Last Updated:** February 4, 2026
