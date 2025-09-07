from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import redis
import json
import os
from datetime import datetime, timedelta
import hashlib
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="News Ranking Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis_client = redis.Redis.from_url(
    os.getenv("REDIS_URL", "redis://localhost:6379"),
    decode_responses=True
)

class Article(BaseModel):
    id: str
    title: str
    abstract: str
    url: str
    byline: str
    published_date: str
    section: str
    subsection: Optional[str] = None
    multimedia: Optional[List[Dict]] = None
    des_facet: Optional[List[str]] = None
    org_facet: Optional[List[str]] = None
    per_facet: Optional[List[str]] = None
    geo_facet: Optional[List[str]] = None

class UserPreferences(BaseModel):
    diversity: float = 0.5
    novelty: float = 0.5
    freshness: float = 0.5

class RankingRequest(BaseModel):
    articles: List[Article]
    user_id: str
    preferences: UserPreferences
    reading_history: List[str] = []

class RankingResponse(BaseModel):
    ranked_articles: List[Dict[str, Any]]
    ranking_explanation: str
    diversity_score: float
    novelty_score: float
    freshness_score: float

class LinUCB:
    """LinUCB bandit algorithm for contextual recommendations"""
    
    def __init__(self, alpha: float = 1.0):
        self.alpha = alpha
        self.d = 10  # Feature dimension
        self.A = np.eye(self.d)  # Regularization matrix
        self.b = np.zeros(self.d)  # Reward vector
        self.theta = np.zeros(self.d)  # Parameter vector
        
    def update(self, context: np.ndarray, reward: float):
        """Update the bandit with new observation"""
        context = context.reshape(-1, 1)
        self.A += np.outer(context, context)
        self.b += reward * context.flatten()
        self.theta = np.linalg.solve(self.A, self.b)
        
    def predict(self, context: np.ndarray) -> float:
        """Predict upper confidence bound"""
        context = context.reshape(-1, 1)
        mean = np.dot(self.theta, context.flatten())
        confidence = self.alpha * np.sqrt(np.dot(context.T, np.linalg.solve(self.A, context)))
        return mean + confidence

class NewsRanker:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.bandits: Dict[str, LinUCB] = {}
        
    def extract_features(self, article: Article) -> np.ndarray:
        """Extract features from article for bandit algorithm"""
        # Combine title and abstract
        text = f"{article.title} {article.abstract}"
        
        # Basic features
        features = np.zeros(10)
        
        # Text length features
        features[0] = len(article.title) / 100.0  # Normalized title length
        features[1] = len(article.abstract) / 500.0  # Normalized abstract length
        
        # Section encoding
        section_map = {
            'world': 0.1, 'us': 0.2, 'politics': 0.3, 'business': 0.4,
            'technology': 0.5, 'science': 0.6, 'health': 0.7, 'sports': 0.8,
            'arts': 0.9, 'opinion': 1.0
        }
        features[2] = section_map.get(article.section, 0.0)
        
        # Time-based features
        try:
            pub_date = datetime.fromisoformat(article.published_date.replace('Z', '+00:00'))
            hours_old = (datetime.now() - pub_date.replace(tzinfo=None)).total_seconds() / 3600
            features[3] = min(hours_old / 24.0, 1.0)  # Normalized age
        except:
            features[3] = 0.5  # Default to middle age
            
        # Multimedia presence
        features[4] = 1.0 if article.multimedia else 0.0
        
        # Facet counts (topic diversity indicators)
        features[5] = len(article.des_facet or []) / 10.0
        features[6] = len(article.org_facet or []) / 5.0
        features[7] = len(article.per_facet or []) / 5.0
        features[8] = len(article.geo_facet or []) / 5.0
        
        # Byline presence
        features[9] = 1.0 if article.byline and article.byline.strip() else 0.0
        
        return features
    
    def calculate_diversity_score(self, articles: List[Article]) -> float:
        """Calculate topic diversity score"""
        if len(articles) < 2:
            return 1.0
            
        # Extract topics from facets
        all_topics = []
        for article in articles:
            topics = []
            if article.des_facet:
                topics.extend(article.des_facet)
            if article.org_facet:
                topics.extend(article.org_facet)
            if article.per_facet:
                topics.extend(article.per_facet)
            all_topics.append(' '.join(topics))
        
        if not any(all_topics):
            return 0.5  # Default diversity score
            
        # Calculate TF-IDF similarity
        try:
            tfidf_matrix = self.vectorizer.fit_transform(all_topics)
            similarity_matrix = cosine_similarity(tfidf_matrix)
            
            # Diversity is inverse of average similarity
            avg_similarity = np.mean(similarity_matrix[np.triu_indices_from(similarity_matrix, k=1)])
            return 1.0 - avg_similarity
        except:
            return 0.5
    
    def calculate_novelty_score(self, article: Article, reading_history: List[str]) -> float:
        """Calculate novelty score based on reading history"""
        if not reading_history:
            return 1.0
            
        # Simple novelty based on section diversity
        recent_sections = []
        for hist_id in reading_history[:10]:  # Last 10 articles
            # In a real implementation, you'd fetch the section from Redis
            # For now, we'll use a simple heuristic
            recent_sections.append(article.section)
        
        # Novelty is higher if this section hasn't been seen recently
        section_counts = {}
        for section in recent_sections:
            section_counts[section] = section_counts.get(section, 0) + 1
        
        current_section_count = section_counts.get(article.section, 0)
        return 1.0 / (1.0 + current_section_count)
    
    def calculate_freshness_score(self, article: Article) -> float:
        """Calculate freshness score based on publication time"""
        try:
            pub_date = datetime.fromisoformat(article.published_date.replace('Z', '+00:00'))
            hours_old = (datetime.now() - pub_date.replace(tzinfo=None)).total_seconds() / 3600
            
            # Exponential decay: fresher articles get higher scores
            return np.exp(-hours_old / 24.0)  # Half-life of 24 hours
        except:
            return 0.5
    
    def rank_articles(
        self, 
        articles: List[Article], 
        user_id: str, 
        preferences: UserPreferences,
        reading_history: List[str]
    ) -> RankingResponse:
        """Rank articles using LinUCB and diversity constraints"""
        
        # Initialize bandit for user if not exists
        if user_id not in self.bandits:
            self.bandits[user_id] = LinUCB()
        
        bandit = self.bandits[user_id]
        
        # Calculate scores for each article
        scored_articles = []
        for i, article in enumerate(articles):
            features = self.extract_features(article)
            
            # Calculate individual scores
            diversity_score = self.calculate_diversity_score([article])
            novelty_score = self.calculate_novelty_score(article, reading_history)
            freshness_score = self.calculate_freshness_score(article)
            
            # Get bandit prediction
            bandit_score = bandit.predict(features)
            
            # Combine scores with user preferences
            final_score = (
                preferences.diversity * diversity_score +
                preferences.novelty * novelty_score +
                preferences.freshness * freshness_score +
                0.1 * bandit_score  # Small weight for bandit
            )
            
            scored_articles.append({
                'article': article,
                'original_rank': i,
                'diversity_score': diversity_score,
                'novelty_score': novelty_score,
                'freshness_score': freshness_score,
                'bandit_score': bandit_score,
                'final_score': final_score,
                'features': features.tolist()
            })
        
        # Sort by final score
        scored_articles.sort(key=lambda x: x['final_score'], reverse=True)
        
        # Calculate overall diversity
        overall_diversity = self.calculate_diversity_score(articles)
        
        # Create explanation
        explanation = self.create_explanation(preferences, overall_diversity)
        
        return RankingResponse(
            ranked_articles=scored_articles,
            ranking_explanation=explanation,
            diversity_score=overall_diversity,
            novelty_score=np.mean([a['novelty_score'] for a in scored_articles]),
            freshness_score=np.mean([a['freshness_score'] for a in scored_articles])
        )
    
    def create_explanation(self, preferences: UserPreferences, diversity: float) -> str:
        """Create human-readable explanation of ranking"""
        explanations = []
        
        if preferences.diversity > 0.7:
            explanations.append("Prioritizing diverse topics and perspectives")
        elif preferences.diversity < 0.3:
            explanations.append("Focusing on your preferred topics")
        
        if preferences.novelty > 0.7:
            explanations.append("Emphasizing fresh, new content")
        elif preferences.novelty < 0.3:
            explanations.append("Including familiar, trusted sources")
        
        if preferences.freshness > 0.7:
            explanations.append("Highlighting the latest breaking news")
        elif preferences.freshness < 0.3:
            explanations.append("Including both recent and background stories")
        
        if diversity > 0.7:
            explanations.append("Ensuring balanced topic coverage")
        
        return ". ".join(explanations) + "." if explanations else "Balanced news selection based on your preferences."

# Initialize ranker
ranker = NewsRanker()

@app.post("/rank", response_model=RankingResponse)
async def rank_articles(request: RankingRequest):
    """Rank articles based on user preferences and bandit algorithm"""
    try:
        result = ranker.rank_articles(
            request.articles,
            request.user_id,
            request.preferences,
            request.reading_history
        )
        
        # Log the ranking for transparency
        await log_ranking(request.user_id, result)
        
        return result
    except Exception as e:
        logger.error(f"Error ranking articles: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/feedback")
async def record_feedback(user_id: str, article_id: str, feedback: float):
    """Record user feedback to improve bandit algorithm"""
    try:
        # Get user's bandit
        if user_id in ranker.bandits:
            # In a real implementation, you'd fetch the article features from Redis
            # For now, we'll use a simple update
            bandit = ranker.bandits[user_id]
            # This would need the original features to update properly
            logger.info(f"Feedback recorded for user {user_id}, article {article_id}: {feedback}")
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error recording feedback: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def log_ranking(user_id: str, result: RankingResponse):
    """Log ranking results for transparency"""
    try:
        log_entry = {
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "ranking": result.ranked_articles,
            "explanation": result.ranking_explanation,
            "scores": {
                "diversity": result.diversity_score,
                "novelty": result.novelty_score,
                "freshness": result.freshness_score
            }
        }
        
        # Store in Redis
        log_key = f"ranking_log:{user_id}:{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        redis_client.setex(log_key, 604800, json.dumps(log_entry))  # 7 days
        
    except Exception as e:
        logger.error(f"Error logging ranking: {e}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
