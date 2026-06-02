# AI Chatbot – Personal Portfolio Assistant

A fullstack AI chatbot built with Vue 3, PHP 8, and the Groq API (LLaMA 3.3 70B).  
Designed as a personal portfolio assistant that answers questions about Dejan Jankovic — his stack, projects, and services.

## Tech Stack

**Frontend**
- Vue 3 + TypeScript
- Tailwind CSS
- Marked.js (Markdown rendering)

**Backend**
- PHP 8.5
- Groq API (LLaMA 3.3 70B)
- vlucas/phpdotenv

**DevOps**
- Docker + Docker Compose

## Features

- Real-time chat UI with message bubbles and AI avatar
- Conversation history — the bot remembers the full chat context
- Markdown rendering for formatted responses
- System prompt configured as a personal portfolio assistant
- Secure API key management via .env
- One-command startup with Docker Compose

## Getting Started

### Prerequisites

- Docker + Docker Compose
- Groq API Key → [console.groq.com](https://console.groq.com)

### Installation

```bash
git clone https://github.com/deki84/ai-chatbot.git
cd ai-chatbot
```

Create `.env` file in the `backend` folder:

GROQ_API_KEY=your_groq_api_key_here

Start the project:

```bash
docker compose up
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

ai-chatbot/
├── backend/          # PHP 8 API
│   ├── index.php     # Main endpoint
│   ├── .env          # API keys (not committed)
│   └── composer.json
├── frontend/         # Vue 3 App
│   ├── src/
│   │   ├── App.vue   # Chat UI
│   │   └── main.ts
│   └── package.json
└── docker-compose.yml

