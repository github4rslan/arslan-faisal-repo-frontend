import React, { useState } from 'react';
import api from './api';  // Import the api.js instance

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Add user message to the chat
    setMessages([...messages, { role: 'user', text: input }]);

    try {
      const response = await api.post('/chat', { // Send message to the backend
        messages: [...messages, { role: 'user', content: input }],
      });

      const chatbotMessage = response.data.message; // Get chatbot response
      setMessages([...messages, { role: 'user', text: input }, { role: 'bot', text: chatbotMessage }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput('');
  };

  return (
    <div style={styles.chatContainer}>
      <h1 style={styles.header}>Chat with Bot 🤖</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.role === 'user' ? styles.userMessage : styles.botMessage}>
            {msg.text}
          </div>
        ))}
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
  },
  chatBox: {
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '10px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: 'inset 0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  userMessage: {
    textAlign: 'right',
    backgroundColor: '#e0f7fa',
    padding: '10px',
    borderRadius: '12px',
    marginBottom: '10px',
  },
  botMessage: {
    textAlign: 'left',
    backgroundColor: '#f1f1f1',
    padding: '10px',
    borderRadius: '12px',
    marginBottom: '10px',
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
  }
};

export default Chatbot;
