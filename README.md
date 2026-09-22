# Discord IMDb ChatBot

A Discord chatbot that uses Retrieval-Augmented Generation (RAG) to answer natural language questions about movies and provide personalized recommendations from a curated movie database.

## What It Does

- Answers natural language movie questions directly in Discord (e.g. "What movies has Christopher Nolan directed?" or "Give me a thriller from the 90s")
- Retrieves relevant movie data from a local database using semantic search
- Generates grounded, conversational responses using OpenAI — only from what was retrieved, not from general training knowledge
- Provides personalized recommendations based on genre, director, year, or mood

## How It Works

The bot uses a RAG pipeline:

1. **User sends a message** in Discord
2. **Semantic search** finds the most relevant movies from the local database using vector similarity
3. **OpenAI** generates a natural language response grounded in the retrieved movie data
4. **Bot replies** in the Discord channel with a cited, accurate answer

## Tech Stack

- **Discord.js** — bot framework and Discord API integration
- **OpenAI API** — language model for response generation
- **Python** — vector search and retrieval pipeline
- **JavaScript / Node.js** — Discord bot logic and message handling
- **RAG (Retrieval-Augmented Generation)** — grounds answers in real movie data

## Project Structure

```
├── index.js          — Discord bot entry point and message handling
├── main.py           — RAG retrieval pipeline and vector search
├── movies/           — Local movie database
├── package.json      — Node.js dependencies
└── README.md
```

## Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- Discord bot token
- OpenAI API key

### Installation

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install openai
```

### Configuration

Create a `.env` file in the root directory:

```
DISCORD_TOKEN=your-discord-bot-token
OPENAI_API_KEY=your-openai-api-key
```

### Run the Bot

```bash
node index.js
```

## Example Queries

- "Recommend me a sci-fi movie from the 2010s"
- "What are the highest rated Christopher Nolan films?"
- "I want something similar to Inception"
- "What won Best Picture in 2019?"

## Author

Vishrutha Kalluri — [github.com/vikalluri0](https://github.com/vikalluri0)
