import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from './api';
import {
  CircularProgress,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Memoize the handleSendMessage function to avoid unnecessary re-creations
  const handleSendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);

    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Sending only the current message instead of the entire history
      const response = await api.post('/chat/chat', {
        messages: [{ role: 'user', content: text }],
      });

      const botText = response.data.message || '⚠️ No response received.';
      const botMsg = { role: 'bot', text: botText };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: '⚠️ Something went wrong. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

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
        background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 40%, #26c6da 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: { xs: 1, sm: 2, md: 4 },
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: '100%',
          maxWidth: '750px',
          bgcolor: '#fff',
          borderRadius: { xs: 2, sm: 4 },
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          height: isMobile ? '90vh' : '75vh',
        }}
      >
        <Typography
          variant={isMobile ? 'h6' : 'h4'}
          align="center"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          Chatbot 🤖
        </Typography>

        {/* Chat Window */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: { xs: 1, sm: 2 },
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
                <Avatar sx={{ bgcolor: '#1976d2', mr: 1, width: 32, height: 32, fontSize: 16 }}>
                  🤖
                </Avatar>
              )}
              <Box
                sx={{
                  bgcolor: msg.role === 'user' ? '#e3f2fd' : '#f1f1f1',
                  color: '#111',
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  maxWidth: '75%',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                }}
              >
                {msg.role === 'bot' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </Box>
              {msg.role === 'user' && (
                <Avatar sx={{ bgcolor: '#4caf50', ml: 1, width: 32, height: 32, fontSize: 16 }}>
                  👤
                </Avatar>
              )}
            </Box>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: '#1976d2', mr: 1, width: 32, height: 32, fontSize: 16 }}>
                🤖
              </Avatar>
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
        <Box sx={{ display: 'flex', gap: 1, flexDirection: isMobile ? 'column' : 'row' }}>
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
              px: isMobile ? 2 : 3,
              py: isMobile ? 1.2 : 0,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1976d2, #0d47a1)',
              width: isMobile ? '100%' : 'auto',
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
