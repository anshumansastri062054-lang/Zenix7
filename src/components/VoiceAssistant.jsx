import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * VoiceAssistant - Floating microphone button near the AI chatbox
 * Provides quick voice input access and navigation commands
 */
export default function VoiceAssistant({ userProfile }) {
  const [isListening, setIsListening] = useState(false);
  const [voiceState, setVoiceState] = useState('idle'); // idle, listening, processing
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
  }, []);

  const startListening = () => {
    if (!isSupported) {
      alert('Voice input is not supported in this browser. You can type your question in the chatbox.');
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceState('listening');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      const text = finalTranscript || event.results[0][0].transcript;

      if (text) {
        setVoiceState('processing');
        handleVoiceCommand(text);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setVoiceState('idle');
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access to use voice input.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setVoiceState('idle');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setVoiceState('idle');
  };

  const handleVoiceCommand = (text) => {
    const lower = text.toLowerCase();

    // Navigation commands
    if (lower.includes('dashboard') || lower.includes('home')) {
      navigate('/dashboard');
      return;
    }
    if (lower.includes('analyze') || lower.includes('business')) {
      navigate('/analyze');
      return;
    }
    if (lower.includes('idea') || lower.includes('find')) {
      navigate('/ideas');
      return;
    }
    if (lower.includes('scheme') || lower.includes('government')) {
      navigate('/schemes');
      return;
    }
    if (lower.includes('financial') || lower.includes('finance')) {
      navigate('/financial');
      return;
    }
    if (lower.includes('market') || lower.includes('location')) {
      navigate('/market');
      return;
    }

    // Non-navigation: open chatbox and send as question
    setTimeout(() => {
      const chatBtn = document.querySelector('[title="Ask Vyapar Mitra"]');
      if (chatBtn) {
        chatBtn.click();
        // Wait for chatbox to open, then set input value
        setTimeout(() => {
          const input = document.querySelector('input[placeholder*="Ask something"]');
          if (input) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(input, text);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            // Auto-send
            setTimeout(() => {
              const sendBtn = document.querySelector('button[type="submit"]');
              if (sendBtn) sendBtn.click();
            }, 300);
          }
        }, 300);
      }
    }, 100);
  };

  const getVoiceButtonUI = () => {
    switch (voiceState) {
      case 'listening':
        return { emoji: '🔴', label: 'Listening...', bg: 'bg-red-500', text: 'text-white', animate: 'animate-pulse' };
      case 'processing':
        return { emoji: '⏳', label: 'Processing...', bg: 'bg-yellow-500', text: 'text-white', animate: '' };
      default:
        return { emoji: '🎙️', label: 'Talk to AI', bg: 'bg-white', text: 'text-gray-600', animate: '' };
    }
  };

  const ui = getVoiceButtonUI();

  return (
    <button
      onClick={startListening}
      className={`fixed bottom-6 right-24 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 border border-gray-200 ${ui.bg} ${ui.text} ${ui.animate} hover:shadow-xl`}
      title="Talk to Vyapar Mitra"
    >
      <span className="text-xl">{ui.emoji}</span>
    </button>
  );
}
