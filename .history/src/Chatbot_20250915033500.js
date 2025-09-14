import React, { useState, useRef, useEffect } from 'react';
import api from './api';
import {
  CircularProgress,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Avatar
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);

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
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: "⚠️ Something went wrong. Try again." }
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
        bgcolor: '#7c5f94ff', // Blue page background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: 'min(750px, 100%)',
          bgcolor: '#fff', // Chat background stays white
          borderRadius: 4,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          height: '75vh', // Reduced to avoid page scroll
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
            bgcolor: '#fafafa',
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
                alignItems: 'flex-start',
                mb: 1.5,
              }}
            >
              {msg.role === 'bot' && (
                <Avatar sx={{ bgcolor: '#1976d2', mr: 1 }}>🤖</Avatar>
              )}
              <Box
                sx={{
                  bgcolor: msg.role === 'user' ? '#e3f2fd' : '#f1f1f1',
                  color: '#111',
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  maxWidth: '70%',
                }}
              >
                {msg.role === 'bot' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </Box>
              {msg.role === 'user' && (
                <Avatar sx={{ bgcolor: '#4caf50', ml: 1 }}>👤</Avatar>
              )}
            </Box>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: '#1976d2', mr: 1 }}>🤖</Avatar>
              <Box
                sx={{
                  bgcolor: '#f1f1f1',
                  px: 2,
                  py: 1,
                  borderRadius: 3,
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

        {/* Input */}
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
