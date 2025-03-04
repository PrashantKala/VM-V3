import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import botIcon from '../images/chatBotIcon.png';
import newChatIcon from '../images/newChat.jpg';

// Chatbot Component
const Chatbot = ({ assets }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const [socket, setSocket] = useState(null);

  // Function to check asset status and add messages if status is not "ready"
  const checkAssetStatus = (assets) => {
    const initialMessages = [{ text: "Hi! I'm GeoCybermind. How can I assist you today?", sender: 'bot' }];
    Object.keys(assets).forEach((asset) => {
      console.log("asset",asset)
      assets[asset].forEach((category) => {
        category.items.forEach((item)=>{

          console.log("item",item)
          if (item.status !== 'ready') {
            initialMessages.push({ text: `${item.name}: ${item.status}`, sender: 'bot' });
          }
        })
      });
    });
    return initialMessages;
  };

  // Set initial messages when component mounts
  useEffect(() => {
    if (assets) {
      const initialMessages = checkAssetStatus(assets);
      setMessages(initialMessages);
    }
  }, [assets]);

  // Establish socket connection
  useEffect(() => {
    const newSocket = io('https://geocybermind.com', { path: '/bot/socket.io/', transports: ['websocket', 'polling'] });
    setSocket(newSocket);

    // Listen for bot messages
    newSocket.on('chat_message', (data) => {
      const botMessage = data.choices[0].message.content;
      setMessages((prevMessages) => [...prevMessages, { text: botMessage, sender: 'bot' }]);
      setIsLoading(false);

      if (!isOpen) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });

    // Listen for alert messages
    const handleAlert = (data) => {
      console.log("Alert received:", data.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${data.message}`, sender: 'bot' }
      ]);

      if (!isOpen) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    };

    newSocket.on('alert_message', handleAlert);

    return () => {
      newSocket.off('chat_message');
      newSocket.off('alert_message', handleAlert);
      newSocket.disconnect();
    };
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Toggle chatbot window
  const toggleChatbot = () => {
    setIsOpen((prevIsOpen) => {
      if (!prevIsOpen) {
        setUnreadCount(0); // Reset unread count only when opening
      }
      return !prevIsOpen;
    });
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim() && socket) {
      const userMessage = { text: inputValue, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue('');
      setIsLoading(true);
      socket.emit('send_message', { message: inputValue });
    }
  };

  return (
    <div className="chatbot-container">
      <button className={`chatbot-toggle ${isOpen ? 'hidden' : 'bounce'}`} onClick={toggleChatbot}>
        <img src={botIcon} alt="Chatbot" className="bot-icon" />
        {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
      </button>

      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div>
            <h3>GeoCybermind</h3>
            <button className="new-chat-button" onClick={() => setMessages(checkAssetStatus(assets))}>
              <img src={newChatIcon} alt="New Chat" />
            </button>
          </div>
          <button className="chatbot-close" onClick={toggleChatbot}>×</button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.sender === 'bot' ? (
                <div className="message-content">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message.text}</ReactMarkdown>
                </div>
              ) : (
                <div className="message-content">{message.text}</div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content typing-indicator">
                <span>.</span><span>.</span><span>.</span>
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