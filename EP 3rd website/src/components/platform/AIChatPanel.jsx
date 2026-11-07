import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  MapPin, 
  BookOpen, 
  HelpCircle 
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { getAIContextualResponse } from '../../data/mockServicesData';

export default function AIChatPanel({ isOpen, onClose, currentTab }) {
  const { selectedLocation } = useLocation();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Welcome to EcoPredict Environmental Research Assistant. I am actively referenced to environmental observations for ${selectedLocation.name}, ${selectedLocation.country}. How can I assist your analysis?`,
      timestamp: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const getSuggestions = () => {
    switch (currentTab) {
      case 'energy':
        return [
          "Why was solar recommended over wind?",
          "What if I add battery storage (BESS)?",
          "How does solar output drop during monsoon?"
        ];
      case 'site':
        return [
          "Is this terrain safe from flash flooding?",
          "What environmental mitigations are needed?",
          "How does local air quality affect residential plans?"
        ];
      case 'risk':
        return [
          "How much will extreme heat increase by 2050?",
          "Is drought a primary risk for this region?",
          "What is the historical temperature trend?"
        ];
      case 'scenario':
        return [
          "What happens if temperature increases by 2°C?",
          "How does rainfall deficit impact groundwater?",
          "Can solar handle a +30% peak demand surge?"
        ];
      default:
        return [
          "Give me an environmental summary for this location.",
          "Which renewable source has highest viability?",
          "What forward climate hazards should I watch for?"
        ];
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: 'user', text: query, timestamp: 'Now' };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = getAIContextualResponse(query, selectedLocation, currentTab, null);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          timestamp: 'Just now'
        }
      ]);
      setIsTyping(false);
    }, 550);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '420px',
        maxWidth: 'calc(100vw - 48px)',
        height: '600px',
        maxHeight: 'calc(100vh - 48px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #D9D7D0',
        boxShadow: 'var(--shadow-modal)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E5E3DD',
          backgroundColor: '#F7F6F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#F4EEDC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B08D3C',
            }}
          >
            <BookOpen style={{ width: '15px', height: '15px' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#242424' }}>
              Ask EcoPredict
            </div>
            <div style={{ fontSize: '0.72rem', color: '#66645F', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin style={{ width: '10px', height: '10px', color: '#B08D3C' }} />
              <span>{selectedLocation.name} Context Synced</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#77756F',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <X style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      {/* Suggestion Chips */}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid #E5E3DD',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        {getSuggestions().map((sug, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sug)}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              backgroundColor: '#F7F6F2',
              border: '1px solid #D9D7D0',
              color: '#3A3A37',
              fontSize: '0.75rem',
              fontWeight: '500',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#B08D3C'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#D9D7D0'}
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: '18px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backgroundColor: '#FFFFFF',
        }}
      >
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: isUser ? '#F4EEDC' : '#F7F6F2',
                border: isUser ? '1px solid #D7C28A' : '1px solid #E5E3DD',
                color: '#242424',
                fontSize: '0.86rem',
                lineHeight: 1.6,
              }}
            >
              {m.text}
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8A8882', fontSize: '0.78rem' }}>
            <span>Retrieving environmental intelligence...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #E5E3DD',
          backgroundColor: '#F7F6F2',
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          type="text"
          placeholder={`Ask about ${selectedLocation.name}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9D7D0',
            borderRadius: '6px',
            padding: '8px 12px',
            color: '#242424',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          className="btn-gold"
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
          }}
        >
          <Send style={{ width: '14px', height: '14px' }} />
        </button>
      </form>
    </div>
  );
}
