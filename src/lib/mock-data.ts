// Mock data for frontend development
export interface MockArticle {
  id: string;
  title: string;
  abstract: string;
  url: string;
  byline: string;
  published_date: string;
  section: string;
  subsection?: string;
  multimedia?: Array<{
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
  }>;
  des_facet?: string[];
  org_facet?: string[];
  per_facet?: string[];
  geo_facet?: string[];
}

export interface MockRankingData {
  articles: Array<{
    article: MockArticle;
    original_rank: number;
    diversity_score: number;
    novelty_score: number;
    freshness_score: number;
    final_score: number;
  }>;
  explanation: string;
  scores: {
    diversity: number;
    novelty: number;
    freshness: number;
  };
  userPreferences: {
    diversity: number;
    novelty: number;
    freshness: number;
  };
}

export const mockArticles: MockArticle[] = [
  {
    id: "1",
    title: "Global Climate Summit Reaches Historic Agreement on Carbon Reduction",
    abstract: "World leaders have reached an unprecedented agreement to reduce carbon emissions by 50% by 2030, marking a turning point in international climate policy.",
    url: "https://nytimes.com/climate-summit-agreement",
    byline: "By Sarah Chen and Michael Rodriguez",
    published_date: "2024-01-15T10:30:00Z",
    section: "world",
    subsection: "climate",
    multimedia: [{
      url: "images/2024/01/15/world/climate-summit.jpg",
      format: "superJumbo",
      height: 1365,
      width: 2048,
      type: "image",
      subtype: "photo",
      caption: "World leaders at the climate summit in Geneva",
      copyright: "Reuters"
    }],
    des_facet: ["Climate Change", "International Relations", "Environmental Policy"],
    org_facet: ["United Nations", "European Union"],
    geo_facet: ["Geneva", "Switzerland"]
  },
  {
    id: "2",
    title: "Breakthrough in Quantum Computing Achieves 1000-Qubit Milestone",
    abstract: "Scientists at MIT have successfully created a quantum computer with over 1000 qubits, potentially revolutionizing fields from cryptography to drug discovery.",
    url: "https://nytimes.com/quantum-computing-breakthrough",
    byline: "By Dr. Elena Vasquez",
    published_date: "2024-01-15T08:15:00Z",
    section: "technology",
    subsection: "science",
    multimedia: [{
      url: "images/2024/01/15/technology/quantum-computer.jpg",
      format: "large",
      height: 683,
      width: 1024,
      type: "image",
      subtype: "photo",
      caption: "The new quantum computer at MIT's research facility",
      copyright: "MIT News"
    }],
    des_facet: ["Quantum Computing", "Technology", "Research"],
    org_facet: ["MIT", "IBM", "Google"],
    geo_facet: ["Cambridge", "Massachusetts"]
  },
  {
    id: "3",
    title: "New Study Reveals Surprising Benefits of Mediterranean Diet",
    abstract: "A comprehensive 10-year study shows that following a Mediterranean diet can reduce the risk of heart disease by up to 30% and improve cognitive function.",
    url: "https://nytimes.com/mediterranean-diet-study",
    byline: "By Dr. James Thompson",
    published_date: "2024-01-15T06:45:00Z",
    section: "health",
    subsection: "nutrition",
    multimedia: [{
      url: "images/2024/01/15/health/mediterranean-food.jpg",
      format: "mediumThreeByTwo210",
      height: 140,
      width: 210,
      type: "image",
      subtype: "photo",
      caption: "Traditional Mediterranean cuisine",
      copyright: "Getty Images"
    }],
    des_facet: ["Nutrition", "Health", "Research", "Diet"],
    org_facet: ["Harvard Medical School", "Mayo Clinic"],
    geo_facet: ["Boston", "Massachusetts"]
  },
  {
    id: "4",
    title: "Federal Reserve Signals Potential Interest Rate Cuts Ahead",
    abstract: "The Federal Reserve's latest meeting minutes suggest policymakers are considering interest rate reductions to support economic growth amid global uncertainties.",
    url: "https://nytimes.com/fed-interest-rates",
    byline: "By Jennifer Walsh",
    published_date: "2024-01-15T14:20:00Z",
    section: "business",
    subsection: "economy",
    multimedia: [{
      url: "images/2024/01/15/business/federal-reserve.jpg",
      format: "large",
      height: 683,
      width: 1024,
      type: "image",
      subtype: "photo",
      caption: "Federal Reserve building in Washington",
      copyright: "Associated Press"
    }],
    des_facet: ["Federal Reserve", "Interest Rates", "Economy", "Monetary Policy"],
    org_facet: ["Federal Reserve", "Treasury Department"],
    geo_facet: ["Washington", "D.C."]
  },
  {
    id: "5",
    title: "SpaceX Successfully Launches Mission to Mars with Revolutionary Propulsion",
    abstract: "SpaceX's latest mission to Mars features a new ion propulsion system that could reduce travel time to the red planet by 40%.",
    url: "https://nytimes.com/spacex-mars-mission",
    byline: "By Alex Chen",
    published_date: "2024-01-15T12:00:00Z",
    section: "science",
    subsection: "space",
    multimedia: [{
      url: "images/2024/01/15/science/spacex-launch.jpg",
      format: "superJumbo",
      height: 1365,
      width: 2048,
      type: "image",
      subtype: "photo",
      caption: "SpaceX rocket launching from Cape Canaveral",
      copyright: "SpaceX"
    }],
    des_facet: ["Space Exploration", "Mars", "Technology", "SpaceX"],
    org_facet: ["SpaceX", "NASA"],
    geo_facet: ["Cape Canaveral", "Florida"]
  },
  {
    id: "6",
    title: "Major Art Museum Discovers Previously Unknown Van Gogh Painting",
    abstract: "The Metropolitan Museum of Art has authenticated a previously unknown painting by Vincent van Gogh, discovered in a private collection in Amsterdam.",
    url: "https://nytimes.com/van-gogh-discovery",
    byline: "By Maria Santos",
    published_date: "2024-01-15T16:30:00Z",
    section: "arts",
    subsection: "art",
    multimedia: [{
      url: "images/2024/01/15/arts/van-gogh-painting.jpg",
      format: "large",
      height: 683,
      width: 1024,
      type: "image",
      subtype: "photo",
      caption: "The newly discovered Van Gogh painting",
      copyright: "Metropolitan Museum of Art"
    }],
    des_facet: ["Art", "Vincent van Gogh", "Museums", "Art History"],
    org_facet: ["Metropolitan Museum of Art", "Van Gogh Museum"],
    geo_facet: ["New York", "Amsterdam"]
  },
  {
    id: "7",
    title: "Revolutionary AI System Can Predict Weather Patterns 30 Days in Advance",
    abstract: "A new artificial intelligence system developed by researchers can accurately predict weather patterns up to 30 days in advance, potentially saving lives and resources.",
    url: "https://nytimes.com/ai-weather-prediction",
    byline: "By Dr. Rachel Kim",
    published_date: "2024-01-15T09:15:00Z",
    section: "technology",
    subsection: "artificial-intelligence",
    multimedia: [{
      url: "images/2024/01/15/technology/ai-weather.jpg",
      format: "mediumThreeByTwo210",
      height: 140,
      width: 210,
      type: "image",
      subtype: "photo",
      caption: "AI system analyzing weather data",
      copyright: "Stanford University"
    }],
    des_facet: ["Artificial Intelligence", "Weather", "Technology", "Climate"],
    org_facet: ["Stanford University", "NOAA"],
    geo_facet: ["Stanford", "California"]
  },
  {
    id: "8",
    title: "Supreme Court to Hear Landmark Case on Digital Privacy Rights",
    abstract: "The Supreme Court will hear arguments in a case that could redefine digital privacy rights and the scope of government surveillance in the digital age.",
    url: "https://nytimes.com/supreme-court-digital-privacy",
    byline: "By Robert Johnson",
    published_date: "2024-01-15T11:45:00Z",
    section: "us",
    subsection: "politics",
    multimedia: [{
      url: "images/2024/01/15/us/supreme-court.jpg",
      format: "large",
      height: 683,
      width: 1024,
      type: "image",
      subtype: "photo",
      caption: "The Supreme Court building in Washington",
      copyright: "Reuters"
    }],
    des_facet: ["Supreme Court", "Digital Privacy", "Civil Rights", "Technology"],
    org_facet: ["Supreme Court", "ACLU"],
    geo_facet: ["Washington", "D.C."]
  }
];

export const generateMockRankingData = (preferences: { diversity: number; novelty: number; freshness: number }): MockRankingData => {
  // Simulate ranking algorithm with mock scores
  const rankedArticles = mockArticles.map((article, index) => {
    const diversityScore = Math.random() * 0.4 + 0.3; // 0.3-0.7
    const noveltyScore = Math.random() * 0.5 + 0.2; // 0.2-0.7
    const freshnessScore = Math.random() * 0.6 + 0.4; // 0.4-1.0
    
    const finalScore = (
      preferences.diversity * diversityScore +
      preferences.novelty * noveltyScore +
      preferences.freshness * freshnessScore
    );

    return {
      article,
      original_rank: index,
      diversity_score: diversityScore,
      novelty_score: noveltyScore,
      freshness_score: freshnessScore,
      final_score: finalScore,
    };
  });

  // Sort by final score
  rankedArticles.sort((a, b) => b.final_score - a.final_score);

  // Generate explanation based on preferences
  const explanations = [];
  if (preferences.diversity > 0.7) {
    explanations.push("Prioritizing diverse topics and perspectives");
  } else if (preferences.diversity < 0.3) {
    explanations.push("Focusing on your preferred topics");
  }
  
  if (preferences.novelty > 0.7) {
    explanations.push("Emphasizing fresh, new content");
  } else if (preferences.novelty < 0.3) {
    explanations.push("Including familiar, trusted sources");
  }
  
  if (preferences.freshness > 0.7) {
    explanations.push("Highlighting the latest breaking news");
  } else if (preferences.freshness < 0.3) {
    explanations.push("Including both recent and background stories");
  }

  const explanation = explanations.length > 0 
    ? explanations.join(". ") + "." 
    : "Balanced news selection based on your preferences.";

  return {
    articles: rankedArticles,
    explanation,
    scores: {
      diversity: rankedArticles.reduce((sum, a) => sum + a.diversity_score, 0) / rankedArticles.length,
      novelty: rankedArticles.reduce((sum, a) => sum + a.novelty_score, 0) / rankedArticles.length,
      freshness: rankedArticles.reduce((sum, a) => sum + a.freshness_score, 0) / rankedArticles.length,
    },
    userPreferences: preferences,
  };
};
