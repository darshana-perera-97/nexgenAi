# Nova AI Chatbot Backend

A Node.js backend API for the Nova AI Solutions chatbot, powered by OpenAI's GPT models.

## Features

- 🤖 AI-powered chatbot responses using OpenAI GPT-3.5-turbo
- 🔒 Security middleware with Helmet
- 🚦 Rate limiting to prevent abuse
- 🌐 CORS support for frontend integration
- 📊 Health check endpoint
- ⚡ Error handling and fallback responses

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

## Getting OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5001` (or the port specified in your `.env` file).

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Chat
```
POST /api/chat
```
Send a message to the chatbot.

**Request Body:**
```json
{
  "message": "What AI solutions do you offer?"
}
```

**Response:**
```json
{
  "response": "We offer comprehensive AI solutions including..."
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required |
| `PORT` | Server port | 5001 |
| `NODE_ENV` | Environment mode | development |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

### Rate Limiting

The API includes rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address
- Configurable via environment variables

## Error Handling

The API includes comprehensive error handling:
- Missing API key: Returns fallback responses
- OpenAI API errors: Handles quota, authentication, and service errors
- Invalid requests: Returns appropriate HTTP status codes
- Rate limiting: Returns 429 status for exceeded limits

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Validates request data
- **Error Sanitization**: Prevents sensitive information leakage

## Development

### Project Structure
```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── env.example        # Environment variables template
└── README.md          # This file
```

### Adding New Features

1. Add new routes in `server.js`
2. Update error handling as needed
3. Test with the frontend chatbot
4. Update documentation

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Ensure your `.env` file exists and contains `OPENAI_API_KEY`
   - Verify the API key is valid and has sufficient credits

2. **CORS errors**
   - Check that `CORS_ORIGIN` matches your frontend URL
   - Ensure the frontend is making requests to the correct backend URL

3. **Rate limit exceeded**
   - Wait for the rate limit window to reset
   - Adjust `RATE_LIMIT_MAX_REQUESTS` if needed

4. **Port already in use**
   - Change the `PORT` in your `.env` file
   - Kill any processes using the port

## Support

For issues or questions:
- Check the console logs for error details
- Verify your environment configuration
- Contact the development team

## License

MIT License - see LICENSE file for details.


