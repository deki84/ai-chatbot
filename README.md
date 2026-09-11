# AI Chatbot – Personal Portfolio Assistant

A fullstack AI chatbot built with Vue 3, next.js, and the Groq API (openai/gpt-oss-120b).  
Designed as a personal portfolio assistant that answers questions about Dejan Jankovic — his stack, projects, and services.

## Tech Stack

**Frontend**
- Vue 3 + TypeScript
- Tailwind CSS
- Marked.js (Markdown rendering)

**Backend**
- next.js
- Groq API (openai/gpt-oss-120b)


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

```
ai-chatbot/
├── backend/
│   ├── vendor/
│   ├── index.php
│   ├── composer.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml
```

