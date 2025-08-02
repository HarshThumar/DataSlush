import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';

const ChatInterface = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI Talent Assistant powered by LangChain and Gemini AI. I can help you find the perfect candidates for your job openings. What kind of role are you looking to fill?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.message,
        candidates: data.candidates || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `I'm sorry, I'm having trouble connecting to my AI brain right now. Error: ${error.message}. Please make sure the backend server is running and try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickSuggestion = (suggestion) => {
    setInputValue(suggestion);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-avatar">
          <span>🤖</span>
        </div>
        <div className="chat-info">
          <h3>AI Talent Assistant</h3>
          <p>Powered by LangChain & Gemini AI</p>
        </div>
        <div className="chat-status">
          <span className="status-dot"></span>
          Online
        </div>
        <button 
          className="chat-close-btn"
          onClick={onClose}
          title="Close Chat"
        >
          ✕
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              {message.candidates && message.candidates.length > 0 && (
                <div className="candidates-preview">
                  <h4>Top Candidates:</h4>
                  <div className="candidates-grid">
                    {message.candidates.slice(0, 3).map((candidate, index) => (
                      <div key={index} className="candidate-card">
                        <div className="candidate-rank">#{candidate.rank || index + 1}</div>
                        <div className="candidate-name">{candidate.name}</div>
                        <div className="candidate-score">{(candidate.score * 100).toFixed(1)}% match</div>
                        <div className="candidate-location">{candidate.location}</div>
                        <div className="candidate-skills">{candidate.skills}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the role you're looking for..."
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="send-button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <div className="quick-suggestions">
          <button onClick={() => handleQuickSuggestion("I need a video editor for entertainment content")}>
            Video Editor
          </button>
          <button onClick={() => handleQuickSuggestion("Looking for TikTok content creator")}>
            TikTok Creator
          </button>
          <button onClick={() => handleQuickSuggestion("Need operations manager for productivity channel")}>
            Operations Manager
          </button>
          <button onClick={() => handleQuickSuggestion("Urgent: Need experienced video editor ASAP")}>
            Urgent Hire
          </button>
          <button onClick={() => handleQuickSuggestion("Looking for creative team player with 3+ years experience")}>
            Creative Team Player
          </button>
          <button onClick={() => handleQuickSuggestion("Remote video editor with Adobe Premiere experience")}>
            Remote Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 