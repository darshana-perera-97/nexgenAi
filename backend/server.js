const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Nova AI Chatbot API'
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
    }

    // Import OpenAI dynamically to handle missing API key gracefully
    let OpenAI;
    try {
      OpenAI = require('openai');
    } catch (error) {
      console.error('OpenAI package not installed:', error.message);
      return res.json({
        response: "I'm currently unavailable. Please contact our support team directly for assistance with AI, IoT, or Solar solutions."
      });
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured');
      return res.json({
        response: "I'm currently in maintenance mode. Please contact our support team directly for assistance with AI, IoT, or Solar solutions."
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // System prompt for Nova AI Solutions
    const systemPrompt = `You are Nova AI Assistant, a helpful AI assistant for Nova AI Solutions, a company specializing in enterprise AI solutions, IoT integration, and solar technology. 

Your role is to:
1. Help users understand our AI, IoT, and Solar solutions
2. Provide information about our services and capabilities
3. Answer questions about artificial intelligence, machine learning, IoT devices, and renewable energy
4. Guide users to contact our team for detailed consultations
5. Be professional, knowledgeable, and helpful

Key information about Nova AI Solutions:
- We provide custom AI solutions for enterprise businesses
- We offer IoT integration services and smart device management
- We develop solar technology and sustainable energy solutions
- We help businesses automate operations and improve efficiency
- We offer consultation and implementation services

Always be helpful and direct users to our contact page (contact-us.html) for detailed consultations or project discussions.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    res.json({ response });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle different types of errors
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        error: 'Service temporarily unavailable. Please try again later.'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(500).json({
        error: 'Service configuration error. Please contact support.'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'An error occurred while processing your request. Please try again.'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found' 
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Nova AI Chatbot API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OpenAI API key not configured. Chatbot will respond with fallback messages.');
    console.log('📝 To enable full functionality, set OPENAI_API_KEY in your .env file');
  }
});

module.exports = app;
