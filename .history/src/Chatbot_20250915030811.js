import React, { useState } from 'react';
import api from './api'; // Import the api.js instance
import { CircularProgress, TextField, Button, Box, Typography } from '@mui/material'; // Material UI Components
import ReactMarkdown from 'react-markdown';  // Import React Markdown to render Markdown

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Add user message to the chat before sending to backend
    const newMessage = { role: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setLoading(true); // Start loading

    try {
      const response = await api.post('/chat/chat', {
        messages: [...messages, { role: 'user', content: input }],
      });

      // Bot's message response handling
      const chatbotMessage = response.data.message;
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', text: input }, // User message
        { role: 'bot', text: chatbotMessage }, // Bot's response
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput('');
    setLoading(false); // Stop loading
  };

  return (
    <Box sx={styles.chatContainer}>
      <Typography variant="h4" sx={styles.header}>Chat with Bot 🤖</Typography>
      <Box sx={styles.chatBox}>
        {messages.map((msg, index) => (
          <Box key={index} sx={msg.role === 'user' ? styles.userMessage : styles.botMessage}>
            {msg.role === 'bot' ? (
              <ReactMarkdown children={msg.text} />  // Render markdown as HTML
            ) : (
              msg.text
            )}
          </Box>
        ))}
        {loading && (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
      <Box sx={styles.inputContainer}>
        <TextField
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          sx={styles.inputField}
        />
        <Button onClick={handleSendMessage} sx={styles.sendButton} variant="contained">
          Send
        </Button>
      </Box>
    </Box>
  );
};

const styles = {
  chatContainer: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f4f4f4',
    borderRadius: '16px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  chatBox: {
    flexGrow: 1,
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
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputField: {
    flexGrow: 1,
    marginRight: '10px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
    },
  },
  sendButton: {
    width: '15%',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
};

export default Chatbot;
