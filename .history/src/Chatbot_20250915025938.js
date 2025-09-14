import React, { useState } from 'react';
import api from './api';  // Import the api.js instance
import { CircularProgress } from '@mui/material'; // You can use Material UI for better loading experience

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // State to handle loading spinner

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Add user message to the chat before sending to backend
    const newMessage = { role: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setLoading(true); // Start loading

    try {
      const response = await api.post('/chat/chat', { // Send message to the backend
        messages: [...messages, { role: 'user', content: input }], // Make sure messages are sent correctly
      });

      // Check the response and add the bot's message
      const chatbotMessage = response.data.message;
      setMessages((prevMessages) => [
        ...prevMessages,
        newMessage,  // User message
        { role: 'bot', text: chatbotMessage }, // Bot's response
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput('');
    setLoading(false); // Stop loading after response
  };

  return (
    <div style={styles.chatContainer}>
      <h1 style={styles.header}>Chat with Bot 🤖</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={msg.role === 'user' ? styles.userMessage : styles.botMessage}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={styles.loadingContainer}>
            <CircularProgress size={24} />
          </div>
        )}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    fontSize: '24px',
  },
  chatBox: {
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '10px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: 'inset 0px 0px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  userMessage: {
    textAlign: 'right',
    backgroundColor: '#e0f7fa',
    padding: '10px',
    borderRadius: '12px',
    marginBottom: '10px',
    maxWidth: '80%',
    alignSelf: 'flex-end',
    transition: 'all 0.3s ease',
  },
  botMessage: {
    textAlign: 'left',
    backgroundColor: '#f1f1f1',
    padding: '10px',
    borderRadius: '12px',
    marginBottom: '10px',
    maxWidth: '80%',
    alignSelf: 'flex-start',
    transition: 'all 0.3s ease',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    width: '85%',
    padding: '10px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  sendButton: {
    width: '10%',
    padding: '10px 15px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  sendButtonHover: {
    backgroundColor: '#0056b3',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
  }
};

export default Chatbot;
