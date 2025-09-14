import React, { useState, useRef, useEffect } from 'react';
import api from './api';
import {
  CircularProgress,
  TextField,
  Button,
  Box,
  Typography,
  Paper
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Clear input immediately & lock UI
    setInput('');
    setLoading(true);

    // Add user message once
    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await api.post('/chat/chat', {
        messages: [...messages, { role: 'user', content: text }],
      });

      const botText = response.data.message || "⚠️ No response received.";
      const botMsg = { role: 'bot', text: botText };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: "⚠️ Something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'linear-gradient(180deg,#e9f0ff 0%,#ffffff 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        py: 4,
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 'min(700px,100%)',
          bgcolor: '#ffffff',
          borderRadius: 4,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          height: '85vh',
        }}
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
          Chatbot 🤖
        </Typography>

        {/* Chat Window */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            bgcolor: '#f9f9fc',
            borderRadius: 3,
            mb: 2,
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                sx={{
                  bgcolor: msg.role === 'user' ? '#e0f0ff' : '#f1f1f1',
                  color: '#111',
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  mb: 1,
                  maxWidth: '75%',
                }}
              >
                {msg.role === 'bot' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </Box>
            </Box>
          ))}

          {/* Typing indicator */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Box
                sx={{
                  bgcolor: '#f1f1f1',
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <CircularProgress size={16} thickness={6} />
                <Typography variant="body2" color="text.secondary">
                  Bot is typing…
                </Typography>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#fff',
              },
            }}
          />
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={loading || !input.trim()}
            sx={{
              borderRadius: 3,
              px: 3,
              fontWeight: 'bold',
            }}
          >
            {loading ? '...' : 'Send'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chatbot;
