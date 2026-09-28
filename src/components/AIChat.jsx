import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getAIResponse, AI_MODE } from '../services/aiService';
import { useNavigate } from 'react-router-dom';

const SUGGESTED_QUESTIONS = [
  "Why is my demand score this high?",
  "What are the main risks?",
  "Explain my competition score.",
  "Can I afford this business?",
  "What should I verify locally?",
  "Which schemes may be relevant?"
];

const VOICE_COMMANDS = [
  { keywords: ["dashboard", "home"], path: "/dashboard" },
  { keywords: ["analyze", "analysis", "business"], path: "/analyze" },
  { keywords: ["idea", "ideas", "find", "suggest"], path: "/ideas" },
  { keywords: ["scheme", "schemes", "government"], path: "/schemes" },
  { keywords: ["financial", "finance", "loan"], path: "/financial" },
  { keywords: ["market", "location"], path: "/market" }
];

export default function AIChat({ context, initialMessage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceState, setVoiceState] = useState('idle'); // idle, listening, processing, speaking
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // Check voice support
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsVoiceSupported(supported);
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = initialMessage || "Hi! I'm Vyapar Mitra. I can help you understand your business analysis, market conditions, financial estimates and potential government schemes.";
      setMessages([{
        role: "assistant",
        content: welcomeMsg,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [isOpen, initialMessage]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle send message
  const handleSend = async (text) => {
    const question = text || input.trim();
    if (!question || isLoading) return;

    setInput('');
    setError('');

    // Add user message
    setMessages(prev => [...prev, {
      role: "user",
      content: question,
      timestamp: new Date().toISOString()
    }]);

    setIsLoading(true);
    setVoiceState('processing');

    try {
      // Check for voice commands first
      const lowerQ = question.toLowerCase();
      const command = VOICE_COMMANDS.find(cmd =>
        cmd.keywords.some(kw => lowerQ.includes(kw))
      );

      if (command && !lowerQ.includes('score') && !lowerQ.includes('why')) {
        // It's a navigation command
        setMessages(prev => [...prev, {
          role: "assistant",
          content: `Navigating to ${command.keywords[0]}...`,
          timestamp: new Date().toISOString()
        }]);
        setTimeout(() => {
          navigate(command.path);
          setIsOpen(false);
        }, 1000);
        setIsLoading(false);
        setVoiceState('idle');
        return;
      }

      // Get AI response
      const response = await getAIResponse(question, context);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: response.response,
        mode: response.mode,
        timestamp: new Date().toISOString()
      }]);

      // Auto-speak if not muted
      if (!isMuted) {
        speak(response.response);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Live AI is temporarily unavailable. I'll answer using Demo AI.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
      setVoiceState('idle');
    }
  };

  // Text-to-speech
  const speak = (text) => {
    if (!('speechSynthesis' in window) || isMuted) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setVoiceState('speaking');
    utterance.onend = () => setVoiceState('idle');

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState('idle');
  };

  // Voice input
  const startVoiceInput = () => {
    if (!isVoiceSupported) {
      setError("Voice input is not supported in this browser. You can type your question.");
      return;
    }

    if (voiceState === 'listening') {
      stopListening();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setVoiceState('listening');
      setError('');
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      if (transcript) {
        setInput(transcript);
        // Auto-send after speech recognition
        setTimeout(() => {
          handleSend(transcript);
        }, 500);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setVoiceState('idle');
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.');
      } else {
        setError("Sorry, I couldn't understand that. Please try again or type your question.");
      }
    };

    recognition.onend = () => {
      setVoiceState('idle');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setVoiceState('idle');
  };

  // Handle suggested question click
  const handleSuggestedClick = (question) => {
    handleSend(question);
  };

  // Get context display name
  const getContextDisplay = () => {
    if (!context) return 'No context';
    const bizName = context.business?.name || 'Business';
    const city = context.location?.city || 'Location';
    return `${bizName} • ${city}`;
  };

  // Voice state UI
  const getVoiceButton = () => {
    switch (voiceState) {
      case 'listening':
        return { text: '🔴 Listening...', color: 'bg-red-500 text-white animate-pulse' };
      case 'processing':
        return { text: '⏳ Thinking...', color: 'bg-yellow-500 text-white' };
      case 'speaking':
        return { text: '🔊 Speaking...', color: 'bg-green-500 text-white' };
      default:
        return { text: '🎙️ Talk to AI', color: 'bg-blue-100 text-blue-600 hover:bg-blue-200' };
    }
  };

  const voiceBtn = getVoiceButton();

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        }`}
        title="Ask Vyapar Mitra"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden max-sm:w-[calc(100vw-2rem)] max-sm:right-4 max-sm:left-4 max-sm:h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold">Vyapar Mitra Advisor</h3>
                  <p className="text-xs text-blue-100">Ask me about your business analysis.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  title={isMuted ? "Unmute Voice" : "Mute Voice"}
                >
                  {isMuted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Context Indicator */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Context: {getContextDisplay()}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${AI_MODE === 'demo' ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'}`}>
                {AI_MODE === 'demo' ? 'DEMO AI' : 'LIVE AI'}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <div className={`flex items-center justify-between mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    <span className="text-xs">
                      {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => msg.role === 'assistant' && speak(msg.content)}
                        className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                        title="Read aloud"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Vyapar Mitra is thinking...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedClick(q)}
                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something about your business..."
                  className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {isVoiceSupported && (
                  <button
                    type="button"
                    onClick={startVoiceInput}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${voiceBtn.color}`}
                    title={voiceBtn.text}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
            {!isVoiceSupported && (
              <p className="text-xs text-yellow-600 mt-2">Voice input is not supported in this browser. You can type your question.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
