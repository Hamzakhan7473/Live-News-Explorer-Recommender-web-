import axios from 'axios';

export interface NYTArticle {
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

export interface NYTResponse {
  status: string;
  copyright: string;
  section: string;
  last_updated: string;
  num_results: number;
  results: NYTArticle[];
}

export interface NYTMostPopularResponse {
  status: string;
  copyright: string;
  num_results: number;
  results: NYTArticle[];
}

class NYTAPIClient {
  private apiKey: string;
  private baseURL = 'https://api.nytimes.com/svc';

  constructor() {
    this.apiKey = process.env.NYT_API_KEY || '';
    if (!this.apiKey) {
      console.warn('NYT_API_KEY not found in environment variables');
    }
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.get<T>(`${this.baseURL}${endpoint}`, {
        params: {
          'api-key': this.apiKey,
        },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error(`NYT API Error for ${endpoint}:`, error);
      throw new Error(`Failed to fetch data from NYT API: ${endpoint}`);
    }
  }

  async getTopStories(section: string = 'home'): Promise<NYTArticle[]> {
    const response = await this.makeRequest<NYTResponse>(`/topstories/v2/${section}.json`);
    return response.results || [];
  }

  async getMostPopular(period: '1' | '7' | '30' = '1'): Promise<NYTArticle[]> {
    const response = await this.makeRequest<NYTMostPopularResponse>(`/mostpopular/v2/viewed/${period}.json`);
    return response.results || [];
  }

  async getTimesWire(): Promise<NYTArticle[]> {
    // Times Wire is part of the Top Stories API with different sections
    const sections = ['world', 'us', 'politics', 'business', 'technology', 'science', 'health'];
    const allArticles: NYTArticle[] = [];

    // Fetch from multiple sections to get diverse content
    const promises = sections.map(section => this.getTopStories(section));
    const results = await Promise.allSettled(promises);

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      }
    });

    return allArticles;
  }

  async getAllArticles(): Promise<{
    topStories: NYTArticle[];
    mostPopular: NYTArticle[];
    timesWire: NYTArticle[];
  }> {
    try {
      const [topStories, mostPopular, timesWire] = await Promise.allSettled([
        this.getTopStories(),
        this.getMostPopular(),
        this.getTimesWire(),
      ]);

      return {
        topStories: topStories.status === 'fulfilled' ? topStories.value : [],
        mostPopular: mostPopular.status === 'fulfilled' ? mostPopular.value : [],
        timesWire: timesWire.status === 'fulfilled' ? timesWire.value : [],
      };
    } catch (error) {
      console.error('Error fetching all articles:', error);
      return {
        topStories: [],
        mostPopular: [],
        timesWire: [],
      };
    }
  }
}

export const nytClient = new NYTAPIClient();
