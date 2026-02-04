# Guide: Context Caching for Victor

This guide explains how to optimize **Pressure Interview Pro** using Gemini's Context Caching to improve performance and reduce operational costs.

---

## 🏎️ 1. Latency: Does it speed things up?

**Yes.** Explicit caching **speeds up** the initial response time (TTFT - Time To First Token).

- **Without Caching:** The system must upload and process Victor's entire personality and rules every time a user clicks "Connect". This adds a few hundred milliseconds of overhead.
- **With Caching:** The instructions are pre-processed and "sitting ready" on Google’s servers. The moment the session starts, the model immediately knows who "Victor" is, leading to a snappier, more professional greeting.

---

## 📊 2. When to move to Explicit Caching?

The "Golden Rule" for switching is based on **Token Volume** and **Reuse Frequency**.

### **Move to Explicit Caching IF:**
1.  **Instruction Size > 32k Tokens:** If you add a massive library of 500+ interview questions or psychological case studies to Victor's brain.
2.  **High Traffic:** You have many users starting sessions throughout the day.
3.  **Instruction Stability:** You aren't changing the instructions every 5 minutes. (Caching is best for stable instructions).
4.  **Cost Optimization:** You calculate that the monthly "Storage Fee" ($1.00/1M tokens) is lower than the aggregate "Input Token" fees for all those sessions combined.

---

## 🛠️ 3. Implementation Workflow

### **Step 1: Check your current token count**
Victor currently uses ~2,000 tokens. You can see the exact count in the **usage_metadata** within the Browser Console (F12) when the session opens.

### **Step 2: Create a Cache (via SDK)**
*Note: This usually requires a server-side component to protect your API key.*

```javascript
const cache = await googleAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  .createContextCache({
    systemInstruction: SYSTEM_INSTRUCTION,
    ttl: 3600 // 1 hour (default)
  });
```

### **Step 3: Update `App.tsx`**
Once you have a `cachedContent` ID, you update the connection config:

```typescript
const session = ai.live.connect({
  model: GEMINI_MODEL,
  config: {
    cachedContent: "YOUR_CACHE_ID_HERE", // Reference the pinned rules
    // No need to send systemInstruction text anymore!
  }
});
```

---

## 📋 4. Pro/Con Summary

| Feature | Implicit (Current) | Explicit (Pinned) |
| :--- | :--- | :--- |
| **Speed** | Standard | **Fastest (Pre-processed)** |
| **Cost** | Regular per-token | **Cheaper for high volume** |
| **Complexity** | Zero (Automatic) | Medium (Requires ID mgmt) |
| **Best For** | Prototyping | **Production / Enterprise** |

---
**Prepared By:** Antigravity AI Assistant  
**Last Updated:** February 4, 2026
