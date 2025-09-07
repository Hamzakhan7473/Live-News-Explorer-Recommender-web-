# Live News Explorer + Recommender

A minimalist news site that pulls sections from the NYT Top Stories/Times Wire APIs, then personalizes the homepage with transparent, human-in-the-loop ranking (diversity, novelty, freshness sliders).

## Features

- **NYT API Integration**: Fetches from Top Stories, Most Popular, and Times Wire APIs
- **Personalized Ranking**: LinUCB bandit algorithm with topic diversity
- **Transparent Controls**: Adjust diversity, novelty, and freshness preferences
- **"Why you're seeing this" Panel**: Full transparency into ranking decisions
- **Downloadable Logs**: Export ranking logs in JSON or CSV format
- **Real-time Feedback**: Learn from user interactions to improve recommendations

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Python FastAPI service with LinUCB bandit algorithm
- **Database**: Redis for user vectors and session management
- **APIs**: New York Times Top Stories, Most Popular, and Times Wire APIs

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Redis server
- NYT API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hamzakhan7473/Live-News-Explorer-Recommender-web-.git
   cd Live-News-Explorer-Recommender-web-
   ```

2. **Install Next.js dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   cd python-ranking-service
   pip install -r requirements.txt
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your NYT API key:
   ```
   NYT_API_KEY=your_nyt_api_key_here
   REDIS_URL=redis://localhost:6379
   ```

5. **Start Redis server**
   ```bash
   redis-server
   ```

6. **Start the Python ranking service**
   ```bash
   cd python-ranking-service
   python main.py
   ```

7. **Start the Next.js development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Next.js API Routes

- `GET /api/articles` - Fetch personalized articles
- `POST /api/preferences` - Update user preferences
- `GET /api/preferences` - Get user preferences
- `POST /api/feedback` - Record user feedback
- `GET /api/logs` - Download ranking logs

### Python Ranking Service

- `POST /rank` - Rank articles using LinUCB algorithm
- `POST /feedback` - Record feedback for bandit learning
- `GET /health` - Health check endpoint

## Algorithm Details

### LinUCB Bandit Algorithm

The system uses a contextual bandit algorithm (LinUCB) that:

1. **Learns from interactions**: Updates recommendations based on user clicks and engagement
2. **Balances exploration vs exploitation**: Tries new content while favoring known preferences
3. **Considers context**: Uses article features (section, topics, recency) for better recommendations

### Ranking Factors

- **Diversity**: Ensures balanced topic coverage across different subjects
- **Novelty**: Identifies content the user hasn't seen recently
- **Freshness**: Prioritizes recent news based on user preference
- **User Preferences**: Customizable weights for each factor

### Transparency Features

- **Real-time explanations**: Shows why articles are ranked in a particular order
- **Score breakdowns**: Displays diversity, novelty, and freshness scores
- **Downloadable logs**: Export complete ranking history for analysis
- **Preference controls**: Adjust algorithm weights in real-time

## Deployment

### Vercel (Recommended)

1. **Deploy Next.js app**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Deploy Python service**
   - Use Railway, Render, or similar service
   - Update `REDIS_URL` to use Redis Cloud or Upstash

3. **Set environment variables**
   - Add `NYT_API_KEY` in Vercel dashboard
   - Update Python service URL in API routes

### Docker

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- New York Times for providing the API access
- The research community for LinUCB bandit algorithms
- Nieman Lab for insights on news recommendation systems

## Roadmap

- [ ] Voice AI integration for news reading
- [ ] Advanced topic modeling
- [ ] Social sharing features
- [ ] Mobile app development
- [ ] A/B testing framework
- [ ] Advanced analytics dashboard