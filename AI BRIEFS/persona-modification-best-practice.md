# Pressure Interview Pro: Persona & Voice Modification Best Practices

This manual provides a standardized workflow for modifying the AI agent's voice, personality, and behavioral logic. Use this guide to ensure consistency and prevent deployment errors when updating the "Victor" persona.

---

## 📂 Core Configuration Files

All persona and voice settings are centralized in the following file:
- **Primary File:** `constants.ts`
- **Secondary File (Diagnostics):** `App.tsx` (for session logs)

---

## 🎙️ 1. Changing the Voice

The voice selection is controlled by the `VOICE_NAME` constant in `constants.ts`.

### **How to Update:**
1. Open `constants.ts`.
2. Locate the `VOICE_NAME` export.
3. Replace the string value (currently `'Charon'`) with a valid Google Gemini prebuilt voice ID.

**Example Code:**
```typescript
// Located in constants.ts
export const VOICE_NAME = 'Charon'; // Deep, authoritative male voice
```

### **Best Practice:**
- **Voice Match:** Choose a voice that aligns with your `SYSTEM_INSTRUCTION` description (e.g., deep/resonant vs. soft/encouraging).
- **Language Support:** Note that Gemini prebuilt voices (like Charon) are high-fidelity and handle multiple languages (Spanish, Russian, English) fluently without additional config.

---

## 🧠 2. Modifying the Persona (System Instructions)

The agent's "brain" and behavioral script are defined in the `SYSTEM_INSTRUCTION` block in `constants.ts`.

### **How to Update:**
1. Open `constants.ts`.
2. Locate the `SYSTEM_INSTRUCTION` constant.
3. Edit the template literal string to change the agent's identity (**Victor**), tone, or multilingual rules.

**Current Mandatory Rules for Victor:**
- **Proactive Greeting:** Victor must speak immediately: *"Hello! My name is Victor..."*
- **Multilingual Pivot:** Victor can explain instructions in Spanish/Russian for comfort but **MUST** demand responses in English.
- **Party Pushback:** If a candidate is too casual, use the "great fun to party with" logic to steer them back to a serious answer.

---

## 🧪 3. Validation and Testing

Before deploying changes, verify the following:

1. **Syntax Check:** Ensure there are no missing backticks (`) or semicolons (;) in the `constants.ts` file.
2. **Local Test:** Run `npm run dev` and start a session. Verify:
   - Does Victor introduce himself immediately?
   - Does the "Party Logic" trigger correctly?
3. **Console Logs:** Check the browser console (F12) for the log: `Live API Session Opened - Victor should start speaking now.`

---

## 🚀 4. Deployment Workflow (CRITICAL)

To ensure your changes are live on the web, you must push to GitHub and ensure Vercel builds the project.

**Command Sequence:**
```powershell
git add .
git commit -m "Update persona: [Specific Change]"
git push origin main
```

**Verification:**
- Open [https://pressure-interview-pro.vercel.app](https://pressure-interview-pro.vercel.app) to confirm the new persona is live.
- Use **`vercel env ls`** to ensure `VITE_GEMINI_API_KEY` is present.

---

## 📋 Quick Reference Table

| Goal | Target File | Variable/Constant |
| :--- | :--- | :--- |
| **Change Identity/Name** | `constants.ts` | Change "Victor" in `SYSTEM_INSTRUCTION` |
| **Change Voice ID** | `constants.ts` | `VOICE_NAME` |
| **Adjust Language Policy**| `constants.ts` | Edit "Language & Comfort Protocol" |
| **Verify Connectivity** | `App.tsx` | Look for `onopen` logs |

---

**Document Prepared By:** Manus (Advanced Agentic Assistant)  
**Last Updated:** February 4, 2026
