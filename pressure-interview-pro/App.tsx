
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { InterviewStatus, Message } from './types';
import { GEMINI_MODEL, SYSTEM_INSTRUCTION, VOICE_NAME } from './constants';
import { createBlob, decode, decodeAudioData } from './services/audioUtils';

const App: React.FC = () => {
  const [status, setStatus] = useState<InterviewStatus>(InterviewStatus.IDLE);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const micStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const [currentInputText, setCurrentInputText] = useState('');
  const [currentOutputText, setCurrentOutputText] = useState('');

  // Use refs to track transcriptions accurately within Live API session closures
  const inputTranscriptionRef = useRef('');
  const outputTranscriptionRef = useRef('');

  const stopSession = useCallback(() => {
    setStatus(InterviewStatus.DISCONNECTED);

    // Stop microphone stream
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }

    // Stop script processor
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }

    // Stop audio sources
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) { }
    });
    sourcesRef.current.clear();

    // Close contexts
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }

    // Session will be closed by the server or by losing references
    sessionPromiseRef.current = null;
  }, []);

  const startSession = async () => {
    try {
      setError(null);
      setStatus(InterviewStatus.CONNECTING);
      setMessages([]);
      setCurrentInputText('');
      setCurrentOutputText('');
      inputTranscriptionRef.current = '';
      outputTranscriptionRef.current = '';

      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key is not configured.");
      }

      // Initialize a new GoogleGenAI instance for the session
      const ai = new GoogleGenAI({ apiKey });

      // Initialize Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      nextStartTimeRef.current = 0;

      // Get Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: GEMINI_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_NAME } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus(InterviewStatus.ACTIVE);

            if (!inputAudioContextRef.current || !micStreamRef.current) return;
            const source = inputAudioContextRef.current.createMediaStreamSource(micStreamRef.current);
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (event) => {
              const inputData = event.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);

              // CRITICAL: Solely rely on sessionPromise resolves to send data
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            if (message.serverContent?.outputTranscription) {
              outputTranscriptionRef.current += message.serverContent.outputTranscription.text;
              setCurrentOutputText(outputTranscriptionRef.current);
            } else if (message.serverContent?.inputTranscription) {
              inputTranscriptionRef.current += message.serverContent.inputTranscription.text;
              setCurrentInputText(inputTranscriptionRef.current);
            }

            if (message.serverContent?.turnComplete) {
              const userText = inputTranscriptionRef.current;
              const assistantText = outputTranscriptionRef.current;

              // Fix: Explicitly type Message array to avoid 'role' string mismatch error
              setMessages(prev => {
                const newMsgs: Message[] = [];
                if (userText.trim()) {
                  newMsgs.push({ role: 'user', text: userText, timestamp: Date.now() });
                }
                if (assistantText.trim()) {
                  newMsgs.push({ role: 'assistant', text: assistantText, timestamp: Date.now() });
                }
                return [...prev, ...newMsgs];
              });

              inputTranscriptionRef.current = '';
              outputTranscriptionRef.current = '';
              setCurrentInputText('');
              setCurrentOutputText('');
            }

            // Handle Audio Data
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const audioCtx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);

              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                audioCtx,
                24000,
                1
              );

              const source = audioCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current) {
                try { source.stop(); } catch (e) { }
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Session Error:', e);
            setError("The session encountered an error.");
            stopSession();
          },
          onclose: (e) => {
            console.log('Session Closed:', e);
            setStatus(InterviewStatus.DISCONNECTED);
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start session.");
      setStatus(InterviewStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-slate-900 text-slate-100">
      <div className="max-w-3xl w-full bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </span>
              Pressure Interview Pro
            </h1>
            <p className="text-slate-400 text-sm mt-1">AI Corporate Psychologist Assessment</p>
          </div>

          <div className="flex items-center gap-3">
            {status === InterviewStatus.ACTIVE && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-semibold animate-pulse border border-green-800/50">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                LIVE SESSION
              </div>
            )}
            {status === InterviewStatus.CONNECTING && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs font-semibold animate-pulse border border-blue-800/50">
                CONNECTING...
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-slate-600">
          {messages.length === 0 && status === InterviewStatus.IDLE && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-slate-600 shadow-xl">
                <img
                  src="/psychologist.jpg"
                  alt="Corporate Psychologist"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">Ready for the pressure?</h2>
              <p className="text-slate-400 max-w-sm">
                Our AI Corporate Psychologist will conduct a brief assessment of your life events and evaluate them for executive leadership qualities.
              </p>
            </div>
          )}

          {messages.length === 0 && (status === InterviewStatus.CONNECTING || status === InterviewStatus.ACTIVE) && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative w-32 h-32 mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 animate-pulse-green shadow-2xl shadow-green-500/50"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-300 via-green-400 to-emerald-500 animate-pulse-green-delayed"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-200 via-green-300 to-emerald-400 animate-pulse-green-slow"></div>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-green-400">
                {status === InterviewStatus.CONNECTING ? 'Connecting...' : 'Session Active'}
              </h2>
              <p className="text-slate-400 max-w-sm">
                {status === InterviewStatus.CONNECTING
                  ? 'Establishing connection with the psychologist...'
                  : 'The psychologist is listening...'}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-700 text-slate-100 rounded-tl-none border border-slate-600'
                  }`}>
                  <p className="text-sm font-medium mb-1 opacity-70">
                    {msg.role === 'user' ? 'You' : 'Psychologist'}
                  </p>
                  <p className="text-base leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {(currentInputText || currentOutputText) && (
              <div className="space-y-2 opacity-50">
                {currentInputText && (
                  <div className="flex justify-end">
                    <div className="bg-blue-900/30 p-3 rounded-xl max-w-[80%] italic">
                      {currentInputText}...
                    </div>
                  </div>
                )}
                {currentOutputText && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700/30 p-3 rounded-xl max-w-[80%] italic">
                      {currentOutputText}...
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer / Controls */}
        <div className="p-6 bg-slate-900/50 border-t border-slate-700">
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800 text-red-400 rounded-lg text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            {status === InterviewStatus.IDLE || status === InterviewStatus.DISCONNECTED || status === InterviewStatus.ERROR ? (
              <button
                onClick={startSession}
                className="w-full max-w-xs bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                START INTERVIEW
              </button>
            ) : (
              <button
                onClick={stopSession}
                className="w-full max-w-xs bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                END SESSION
              </button>
            )}

            <p className="text-slate-500 text-xs text-center">
              Ensure your microphone is enabled. Use a quiet environment for the best psychological assessment.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default App;
