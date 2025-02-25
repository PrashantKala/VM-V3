import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import botIcon from '../images/chatBotIcon.png'; // Import your bot image
import newChatIcon from '../images/newChat.jpg'; // Import new chat icon

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Add initial welcome message when opening the chatbot
      setMessages([{ text: "Hi! I'm GeoCybermind. How can I assist you today?", sender: 'bot' }]);
    }
  };

  const startNewChat = () => {
    setMessages([{ text: "Hi! I'm GeoCybermind. How can I assist you today?", sender: 'bot' }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = { text: inputValue, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInputValue('');
      setIsLoading(true);

      try {
        const response = await axios.post(
          'http://localhost:5000/api/chat',
          { message: inputValue }
        );
        console.log(response);

        const botMessage = {
          text: response.data.choices[0].message.content,
          sender: 'bot',
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error fetching bot response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: '**Sorry, something went wrong. Please try again**.', sender: 'bot' },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="chatbot-container">
      <button className={`chatbot-toggle ${isOpen ? 'hidden' : 'bounce'}`} onClick={toggleChatbot}>
        <img src={botIcon} alt="Chatbot" className="bot-icon" />
      </button>
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div>
            <h3>GeoCybermind</h3>
            <button className="new-chat-button" onClick={startNewChat}>
              <img src={newChatIcon} alt="New Chat" />
            </button>
          </div>
          <button className="chatbot-close" onClick={toggleChatbot}>
            ×
          </button>
        </div>
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.sender === 'bot' ? (
                <div className="message-content">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              ) : (
                <div className="message-content">{message.text}</div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content typing-indicator">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;