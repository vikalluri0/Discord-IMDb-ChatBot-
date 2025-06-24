import { config } from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

let movies = [];

// Parsing function (from previous message)
function parseMovieMarkdown(markdown) {
  const titleYearMatch = markdown.match(/^# (.+) \((\d{4})\)/m);
  const ratingMatch = markdown.match(/\*\*IMDb Rating:\*\* ([\d.]+)/);
  const genreMatch = markdown.match(/\*\*Genre:\*\* ([^\n]+)/);
  const directorMatch = markdown.match(/\*\*Director:\*\* ([^\n]+)/);
  const actorsMatch = markdown.match(/\*\*Actors:\*\* ([^\n]+)/);
  const plotMatch = markdown.match(/\*\*Plot:\*\* ([\s\S]+?)\n\*\*/);
  const languageMatch = markdown.match(/\*\*Language:\*\* ([^\n]+)/);
  const runtimeMatch = markdown.match(/\*\*Runtime:\*\* ([^\n]+)/);
  const releasedMatch = markdown.match(/\*\*Released:\*\* ([^\n]+)/);
  const imdbLinkMatch = markdown.match(/\*\*IMDb Link:\*\* \[.+\]\((.+)\)/);

  return {
    title: titleYearMatch ? titleYearMatch[1].trim() : 'Unknown',
    year: titleYearMatch ? titleYearMatch[2] : 'Unknown',
    imdbRating: ratingMatch ? ratingMatch[1] : 'N/A',
    genre: genreMatch ? genreMatch[1].trim() : 'N/A',
    director: directorMatch ? directorMatch[1].trim() : 'N/A',
    actors: actorsMatch ? actorsMatch[1].trim() : 'N/A',
    plot: plotMatch ? plotMatch[1].trim() : 'N/A',
    language: languageMatch ? languageMatch[1].trim() : 'N/A',
    runtime: runtimeMatch ? runtimeMatch[1].trim() : 'N/A',
    released: releasedMatch ? releasedMatch[1].trim() : 'N/A',
    imdbLink: imdbLinkMatch ? imdbLinkMatch[1] : 'N/A',
  };
}

// Load and parse all movies at startup
function loadMovies() {
  const movieDir = path.join(process.cwd(), 'movies');
  const files = fs.readdirSync(movieDir);
  movies = files.map((filename) => {
    const content = fs.readFileSync(path.join(movieDir, filename), 'utf-8');
    return parseMovieMarkdown(content);
  });
  console.log(`Loaded ${movies.length} movies.`);
}

loadMovies();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;

  const content = msg.content.trim();

  if (content.startsWith('!recommend')) {
    const userQuery = content.replace('!recommend', '').trim();

    if (!userQuery) {
      msg.reply('Please provide a query after !recommend');
      return;
    }

    // Simple search: match user query words in title, genre, or director
    const queryWords = userQuery.toLowerCase().split(/\s+/);
    const relevantMovies = movies.filter(movie => {
      const haystack = (movie.title + ' ' + movie.genre + ' ' + movie.director).toLowerCase();
      return queryWords.some(word => haystack.includes(word));
    }).slice(0, 5); // limit results

    if (relevantMovies.length === 0) {
      msg.reply('No matching movies found in the database.');
      return;
    }

    // Build prompt with movie info + user query
    let prompt = 'You are a helpful movie assistant. Here are some movies:\n\n';

    relevantMovies.forEach((m, i) => {
      prompt += `${i + 1}. ${m.title} (${m.year}) - ${m.genre}\n`;
      prompt += `   Director: ${m.director}\n`;
      prompt += `   Plot: ${m.plot}\n\n`;
    });

    prompt += `Based on this info, answer the user query:\nUser: ${userQuery}\n`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that answers based on provided movie info.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const responseText = completion.choices[0].message.content;
      msg.reply(responseText);
    } catch (err) {
      console.error('OpenAI error:', err);
      msg.reply('Sorry, something went wrong while getting recommendations.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
