**Intention & Goal:** Gain experience working with AI and combining it with economics, my minor.

# StockBot

StockBot is a proof-of-concept chat application that pairs OpenAI's Assistants API with a finance-focused prompt. The project explores how AI-generated analysis can assist with market questions, stock ideas, and general economic guidance in an accessible web interface.

## Live Demo
- Try the hosted build: https://jonahrothman.com/StockBot/

## What It Does
- Presents a simple chat UI where users can ask market and economics questions.
- Relays each message to an OpenAI Assistant tuned for stock-market and economics conversations.
- Streams the assistant's response back into the conversation view.
- Provides a "New Chat" reset that prompts the assistant to greet the user in a fresh conversation.

## Project Structure
- `server.js` – Express server that connects to the OpenAI Assistants API and exposes `/get-response`.
- `script.js` – Frontend logic for handling chat input and rendering messages.
- `index.html` & `style.css` – Static UI for the chat experience.
- `fonts/` – Custom typefaces used by the interface.
- `Procfile` – Render/Heroku-style process declaration for deployment.

## Getting Started Locally

### Prerequisites
- Node.js 18+ and npm.
- An OpenAI API key with access to the Assistants API.

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env` file in the project root:
```bash
OPENAI_API_KEY=your_openai_api_key_here
# Optional: PORT=3000
```

### 3. Start the backend server
```bash
npm start
```
The server runs on `http://localhost:3000` by default.

### 4. Open the frontend
The static files can be served in any way you prefer:
- Quick option: open `index.html` in your browser using a local web server such as the VS Code Live Server extension or `npx serve`.
- For local development, update the fetch URL in `script.js` to point at your local server:
  ```js
  const response = await fetch('http://localhost:3000/get-response', {
  ```
  The repo currently targets the hosted API at `https://stockbot-crbd.onrender.com/get-response`.

Once both pieces are running, type into the chat input and press Enter or click **Send** to converse with StockBot.

## Configuring OpenAI
- This project uses the official `openai` npm package.
- All API credentials are sourced from the `.env` file; never commit your key to the repo.
- The backend initializes an assistant thread at startup and reuses it for all messages. If you need per-session privacy, instantiate threads within each request instead.

## Deployment Notes
- The provided `Procfile` (`web: node server.js`) allows easy deployment to Render, Heroku, or any platform that supports Procfiles.
- Ensure the `OPENAI_API_KEY` environment variable is set in your hosting provider.
- Serve `index.html` and related assets via a static host or CDN; update `script.js` so the fetch URL matches your deployed API domain.

## Troubleshooting
- **401 / 403 errors** – Verify the API key is valid and has access to the Assistants API. Check `.env` syntax (no quotes, no trailing spaces).
- **CORS issues** – Confirm the frontend is making requests to the correct domain and that the backend is reachable. The Express server ships with `cors()` enabled.
- **Stale conversation history** – The single global thread keeps context between requests. Restart the server or create per-user threads if you need isolation.

Happy building, and enjoy experimenting with the intersection of AI and economics!
