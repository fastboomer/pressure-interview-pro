# Pressure Interview Pro: Persona & Voice Modification Best Practices

This manual provides a standardized workflow for modifying the AI agent's voice, personality, and behavioral logic. Use this guide to ensure consistency and prevent deployment errors when updating the "Corporate Psychologist" persona.

---

## 📂 Core Configuration Files

All persona and voice settings are centralized in the following file:
- **Primary File:** `constants.ts`
- **Secondary File (Logic):** `App.tsx` (for UI labels or interaction states)

---

## 🎙️ 1. Changing the Voice

The voice selection is controlled by the `VOICE_NAME` constant in `constants.ts`.

### **How to Update:**
1. Open `constants.ts`.
2. Locate the `VOICE_NAME` export.
3. Replace the string value (e.g., `'Charon'`) with your desired Google Gemini prebuilt voice ID.

**Example Code:**
```typescript
// Located in constants.ts
export const VOICE_NAME = 'Charon'; // Replace 'Charon' with 'Fenrir', 'Aoide', etc.
```

### **Best Practice:**
- **Voice Match:** Ensure the voice gender and tone match the descriptions provided in the `SYSTEM_INSTRUCTION`. If you change to a female voice, update the "male voice" description in the instructions.
- **Prebuilt Options:** Use valid Gemini prebuilt voice IDs (e.g., Charon, Fenrir, Aoide, Puck, Kore).

---

## 🧠 2. Modifying the Persona (System Instructions)

The agent's "brain" and behavioral script are defined in the `SYSTEM_INSTRUCTION` block in `constants.ts`.

### **How to Update:**
1. Open `constants.ts`.
2. Locate the `SYSTEM_INSTRUCTION` constant.
3. Edit the template literal string to change the agent's identity, tone, or specific interview script.

**Key Sections to Maintain:**
- **The Role:** (e.g., "You are a professional corporate psychologist...")
- **The Script:** The numbered list (1-9) defining the interview flow.
- **The Tone:** Guidance on authoritative, resonant, or witty communication.

### **Best Practice:**
- **Flow Preservation:** Do not remove the numbered script steps unless you are deliberately changing the interview structure. The frontend depends on these phases to keep the user engaged.
- **Authority:** Maintain the "Pressure" aspect of the interview by instructing the AI to be "friendly but firm" and provocative in its evaluations.

---

## 🧪 3. Validation and Testing

Before deploying changes, verify the following:

1. **Syntax Check:** Ensure there are no missing backticks (`) or semicolons (;) in the `constants.ts` file.
2. **Local Test:** Run `npm run dev` and start a session. Verify:
   - Does the new voice sound correct?
   - Does the AI follow the new persona instructions?
   - Is the "Pressure" tone maintained?

---

## 🚀 4. Deployment Workflow

Once the modification is complete, the changes must be pushed to the repository to reflect on the live internet.

**Command Sequence:**
```powershell
git add .
git commit -m "feat: update persona to [Persona Name] and voice to [Voice Name]"
git push
```

**Verification:**
- Check the Vercel dashboard to ensure the build finishes (usually 1-2 minutes).
- Refresh [https://pressure-interview-pro.vercel.app](https://pressure-interview-pro.vercel.app) to confirm the new persona is live.

---

## 📋 Quick Reference Table

| Goal | Target File | Variable/Constant |
| :--- | :--- | :--- |
| **Change Voice** | `constants.ts` | `VOICE_NAME` |
| **Change Tone/Script** | `constants.ts` | `SYSTEM_INSTRUCTION` |
| **Update App Title** | `index.html` | `<title>` tag |
| **Fix 404/Build Errors** | `vercel.json` | Project Root Config |

---

**Document Prepared By:** Manus (Advanced Agentic Assistant)  
**Last Updated:** February 3, 2026
