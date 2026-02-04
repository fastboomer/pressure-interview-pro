# Guide: Customizing Agent Personality and System Instructions

**Date:** February 3, 2026  
**Purpose:** Understanding how to modify AI agent behavior and system-level instructions  
**Audience:** Developers and power users working with AI assistants

---

## Table of Contents
1. [Overview](#overview)
2. [Understanding Agent Architecture](#understanding-agent-architecture)
3. [System Instructions vs. Agent Personality](#system-instructions-vs-agent-personality)
4. [How to Modify Agent Personality](#how-to-modify-agent-personality)
5. [How to Change System Instructions](#how-to-change-system-instructions)
6. [Best Practices](#best-practices)
7. [Examples](#examples)
8. [Troubleshooting](#troubleshooting)

---

## Overview

AI agents like Antigravity operate based on two key components:
1. **System Instructions** - Core behavioral guidelines and capabilities
2. **Agent Personality** - Tone, style, and interaction patterns

Understanding the distinction between these components is crucial for effective customization.

---

## Understanding Agent Architecture

### The Hierarchy of AI Behavior

```
┌─────────────────────────────────────┐
│     Base Model (e.g., Gemini)       │
│  (Fundamental capabilities & knowledge)
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      System Instructions            │
│  (Rules, constraints, capabilities) │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Agent Personality              │
│  (Tone, style, communication)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      User Interaction               │
│  (Specific requests & context)      │
└─────────────────────────────────────┘
```

---

## System Instructions vs. Agent Personality

### System Instructions
**What they are:**
- Core operational guidelines
- Capability definitions
- Safety constraints
- Tool usage rules
- Workflow procedures

**Examples:**
- "You have access to file system tools"
- "Always use absolute paths for file operations"
- "Follow security best practices"
- "Prioritize user requests over proactive actions"

**Controlled by:**
- Platform administrators
- System configuration files
- Environment settings

---

### Agent Personality
**What it is:**
- Communication style and tone
- Level of formality
- Verbosity preferences
- Emoji and formatting usage
- Proactiveness level

**Examples:**
- Friendly vs. professional tone
- Concise vs. detailed explanations
- Technical vs. accessible language
- Enthusiastic vs. neutral demeanor

**Controlled by:**
- User preferences
- Conversation context
- Custom instructions
- Prompt engineering

---

## How to Modify Agent Personality

### Method 1: Direct Conversation Instructions
The simplest way to adjust personality is through direct requests:

```
"Please be more concise in your responses"
"Use a more formal tone for this project"
"Explain things as if I'm a beginner"
"Be more enthusiastic and use emojis"
```

**Persistence:** Lasts for current conversation

---

### Method 2: User Rules (Persistent)
For permanent personality changes, use the user rules system:

1. **Access Settings:** Look for user preferences or settings
2. **Add Custom Rules:** Define personality preferences
3. **Save Configuration:** Rules persist across conversations

**Example User Rules:**
```markdown
- Always use a professional, formal tone
- Limit responses to 3 paragraphs unless more detail is requested
- Use bullet points for lists instead of numbered items
- Avoid emojis and casual language
- Prioritize code examples over lengthy explanations
```

---

### Method 3: Conversation-Level Prompts
Set the tone at the beginning of a conversation:

```
"For this session, I'd like you to act as a senior software architect. 
Use technical terminology, be direct and concise, and focus on 
architectural decisions rather than implementation details."
```

---

### Method 4: Project-Specific Instructions
Create a `.agent/` directory in your project with custom instructions:

**File:** `.agent/personality.md`
```markdown
---
type: personality
scope: project
---

# Project-Specific Agent Behavior

For this project, please:
- Use startup/entrepreneurial language
- Be enthusiastic about rapid iteration
- Prioritize speed over perfection
- Use casual, collaborative tone
- Celebrate small wins
```

---

## How to Change System Instructions

### Understanding System-Level Access

⚠️ **Important:** System instructions are typically controlled by:
- Platform administrators (Google, OpenAI, etc.)
- Enterprise IT departments
- Application developers (for embedded agents)

**Users typically cannot modify core system instructions**, but can work within them.

---

### What You CAN Control

#### 1. **Tool Preferences**
Specify which tools or approaches to prioritize:

```
"For this project, prefer using grep_search over view_file when 
searching for code patterns"

"Always run tests after making code changes"

"Use the browser_subagent for any web-related tasks"
```

---

#### 2. **Workflow Customization**
Create custom workflows in `.agent/workflows/`:

**File:** `.agent/workflows/deploy.md`
```markdown
---
description: Deploy application to production
---

# Deployment Workflow

1. Run all tests: `npm test`
2. Build production bundle: `npm run build`
3. Commit changes: `git add . && git commit -m "chore: production build"`
4. Push to main: `git push origin main`
5. Verify Vercel deployment
6. Test live URL
7. Update project documentation
```

---

#### 3. **Skill Extensions**
Add custom skills to extend agent capabilities:

**File:** `.agent/skills/code-review/SKILL.md`
```markdown
---
name: Code Review Protocol
description: Systematic code review process
---

# Code Review Skill

When reviewing code, follow this process:

1. **Security Check**
   - Look for exposed API keys
   - Check for SQL injection vulnerabilities
   - Verify input validation

2. **Performance Analysis**
   - Identify unnecessary re-renders
   - Check for memory leaks
   - Optimize database queries

3. **Code Quality**
   - Ensure consistent formatting
   - Verify proper error handling
   - Check for code duplication

4. **Documentation**
   - Verify JSDoc comments
   - Check README accuracy
   - Ensure type definitions
```

---

### What You CANNOT Control

❌ **Core Safety Constraints**
- Cannot disable safety filters
- Cannot bypass content policies
- Cannot override security restrictions

❌ **Fundamental Capabilities**
- Cannot add tools not provided by platform
- Cannot change base model behavior
- Cannot modify token limits

❌ **Platform Rules**
- Cannot override rate limits
- Cannot change authentication requirements
- Cannot modify logging/monitoring

---

## Best Practices

### For Personality Customization

✅ **Do:**
- Be specific about desired tone and style
- Provide examples of preferred communication
- Adjust gradually and test results
- Document preferences for team consistency
- Consider context (formal for docs, casual for brainstorming)

❌ **Don't:**
- Make contradictory requests
- Expect personality to override safety rules
- Assume changes persist without configuration
- Forget to communicate changes to team members

---

### For System Instructions

✅ **Do:**
- Work within existing capabilities
- Create clear, documented workflows
- Use project-specific configuration files
- Test custom instructions thoroughly
- Share successful patterns with team

❌ **Don't:**
- Attempt to bypass safety constraints
- Create overly complex instruction hierarchies
- Assume all platforms support custom instructions
- Forget to version control configuration files

---

## Examples

### Example 1: Concise Technical Assistant

**User Rule:**
```markdown
- Provide code-first responses
- Limit explanations to 2-3 sentences
- Use inline comments instead of separate explanations
- Skip pleasantries and get straight to solutions
- Only ask clarifying questions if absolutely necessary
```

**Result:**
```
User: "How do I add a new route?"

Agent:
// Add to App.tsx
<Route path="/new-page" element={<NewPage />} />

// Create component
// src/components/NewPage.tsx
export const NewPage = () => <div>New Page</div>;
```

---

### Example 2: Educational Mentor

**User Rule:**
```markdown
- Explain the "why" behind every suggestion
- Use analogies and real-world examples
- Break down complex concepts into steps
- Encourage questions and exploration
- Celebrate learning moments
```

**Result:**
```
User: "How do I add a new route?"

Agent:
Great question! Let's break down routing in React:

Think of routes like chapters in a book - each URL is a different 
"chapter" (page) in your app. React Router acts as the table of 
contents, directing users to the right chapter.

Here's how to add a new route:

1. **Define the Route** (Tell the router about your new page)
   <Route path="/new-page" element={<NewPage />} />
   
   The `path` is like the chapter number, and `element` is the 
   actual content.

2. **Create the Component** (Write the chapter content)
   export const NewPage = () => <div>New Page</div>;

Want to try adding a route yourself? I can guide you through it!
```

---

### Example 3: Project-Specific Agent

**File:** `.agent/project-context.md`
```markdown
---
type: context
---

# Pressure Interview Pro - Agent Context

This is an interview simulation platform. When working on this project:

**Tone:** Professional and encouraging (it's about helping people succeed)
**Focus:** User experience and AI interaction quality
**Priorities:** 
1. Smooth interview flow
2. Helpful, constructive feedback
3. Accessible to all skill levels

**Avoid:**
- Overly technical jargon in user-facing content
- Intimidating or discouraging language
- Complex features that distract from core purpose

**Encourage:**
- Clear, actionable feedback
- Positive reinforcement
- Incremental improvements
```

---

## Troubleshooting

### Issue: Agent Ignores Personality Instructions

**Possible Causes:**
1. Instructions conflict with system rules
2. Instructions are too vague
3. Instructions weren't properly saved

**Solutions:**
- Be more specific and provide examples
- Check that custom rules are in correct format
- Verify file locations and naming conventions
- Restart conversation to load new rules

---

### Issue: Inconsistent Behavior

**Possible Causes:**
1. Multiple conflicting instructions
2. Context window limitations
3. Ambiguous requests

**Solutions:**
- Consolidate instructions into clear hierarchy
- Remind agent of preferences mid-conversation
- Use explicit instructions for each request
- Document expected behavior with examples

---

### Issue: Can't Achieve Desired Behavior

**Possible Causes:**
1. Requesting behavior outside agent capabilities
2. Conflicting with safety constraints
3. Platform limitations

**Solutions:**
- Verify capability is supported
- Rephrase request to work within constraints
- Use alternative approaches
- Provide feedback to platform developers

---

## Advanced: Creating Custom Agent Profiles

For teams or complex projects, create reusable agent profiles:

**File:** `.agent/profiles/senior-architect.md`
```markdown
---
profile: senior-architect
description: Technical leadership perspective
---

# Senior Architect Profile

When using this profile:

**Communication Style:**
- Strategic and high-level
- Focus on trade-offs and long-term implications
- Use architectural patterns and principles
- Reference industry standards

**Decision Framework:**
- Scalability first
- Maintainability over cleverness
- Security by default
- Performance considerations

**Code Review Focus:**
- Architecture alignment
- Design patterns
- Technical debt implications
- Team knowledge transfer
```

**Activation:**
```
"Please use the senior-architect profile for this discussion"
```

---

## Conclusion

Understanding the distinction between agent personality and system instructions empowers you to:
- Customize AI interactions for your workflow
- Create consistent team experiences
- Work more efficiently with AI assistants
- Build project-specific agent behaviors

**Remember:**
- Personality = How the agent communicates
- System Instructions = What the agent can do
- Both can be customized within platform constraints
- Documentation ensures consistency

---

## Additional Resources

### Platform-Specific Guides
- Google AI Studio: Custom instructions documentation
- OpenAI: System message guidelines
- Anthropic: Constitutional AI principles

### Community Resources
- AI agent customization forums
- Prompt engineering best practices
- Agent workflow repositories

### Related Topics
- Prompt engineering techniques
- AI safety and alignment
- Multi-agent systems
- Context management strategies

---

**Document Prepared By:** Antigravity AI Assistant  
**Last Updated:** February 3, 2026  
**Version:** 1.0
