import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ReactMarkdown from 'react-markdown'; // For rendering markdown messages
import botIcon from '../images/chatBotIcon.png'; // Bot icon
import newChatIcon from '../images/newChat.jpg'; // New chat icon

// Connect to the Flask backend using Socket.IO
const socket = io('http://localhost:5000');

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false); // Chatbot window visibility
  const [messages, setMessages] = useState([]); // Chat messages
  const [inputValue, setInputValue] = useState(''); // Input field value
  const [isLoading, setIsLoading] = useState(false); // Loading state for bot response
  const [unreadCount, setUnreadCount] = useState(0); // Unread messages count
  const messagesEndRef = useRef(null); // Reference to scroll to the bottom of messages

  // Toggle chatbot window visibility
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Add initial welcome message when opening the chatbot
      setMessages([{ text: "Hi! I'm GeoCybermind. How can I assist you today?", sender: 'bot' }]);
    }
    // Reset unread count when opening the chat
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  // Start a new chat
  const startNewChat = () => {
    setMessages([{ text: "Hi! I'm GeoCybermind. How can I assist you today?", sender: 'bot' }]);
  };

  // Scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage = { text: inputValue, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue('');
      setIsLoading(true);

      // Send the message to the server via Socket.IO
      socket.emit('send_message', { message: inputValue });
    }
  };

  // Listen for incoming messages from the server
  useEffect(() => {
    socket.on('receive_message', (data) => {
      const botMessage = data.choices[0].message.content;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botMessage, sender: 'bot' },
      ]);
      setIsLoading(false);

      // Increment unread count if the chat window is closed
      if (!isOpen) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.off('receive_message');
    };
  }, [isOpen]);

  return (
    <div className="chatbot-container">
      {/* Toggle button to open/close the chatbot */}
      <button className={`chatbot-toggle ${isOpen ? 'hidden' : 'bounce'}`} onClick={toggleChatbot}>
        <img src={botIcon} alt="Chatbot" className="bot-icon" />
        {/* Show unread count badge if there are unread messages */}
        {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
      </button>

      {/* Chatbot window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        {/* Chatbot header */}
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

        {/* Chat messages */}
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
          {/* Loading indicator */}
          {isLoading && (
            <div className="message bot">
              <div className="message-content typing-indicator">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          )}
          {/* Empty div to scroll into view */}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input area */}
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