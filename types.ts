
export interface PricingPlan {
  name: string;
  price: string | number;
  billing?: string;
  features?: string[];
}

export interface Tool {
  id: string;
  name: string;
  url: string;
  category: string;
  rating: number;
  reviews?: number;
  saves?: number;
  isPaid: boolean; // Kept for backward compatibility
  pricingModel?: 'Free' | 'Freemium' | 'Paid' | 'Contact for Pricing';
  isActive: boolean;
  isDraft?: boolean;
  logo: string;
  description?: string;
  shortDescription?: string;
  features?: string[];
  pricing?: string[]; // Legacy simple list
  plans?: PricingPlan[]; // New structured pricing
  screenshots?: string[];
  verified?: boolean;
  // Live Data Fields
  trendScore?: number;
  publishedDate?: string;
  lastVerified?: string; // ISO Date string for pricing verification
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  model: string; // e.g. GPT-4, NanoBanana
  tool?: string; // e.g. Midjourney, ChatGPT
  images?: string[]; // Preview images
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'Published' | 'Pending' | 'Draft';
  date: string;
}

export interface Video {
  id: string;
  videoId: string; // YouTube ID or empty if search based
  title: string;
  thumbnail: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  duration: string;
  publishedAt: string;
  category: string;
  searchQuery?: string; // For playing via search embed
  sourceType?: 'youtube' | 'upload'; // New field to distinguish source
  videoUrl?: string; // Blob URL for uploaded videos
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Moderator' | 'User';
  status: 'Active' | 'Banned' | 'Pending';
  joinedDate: string;
  avatar: string;
  lastActive?: string;
}

export interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: string;
  colorClass: string;
}
