
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
  isPaid: boolean;
  pricingModel?: 'Free' | 'Freemium' | 'Paid' | 'Contact for Pricing';
  isActive: boolean;
  isDraft?: boolean;
  logo: string;
  description?: string;
  shortDescription?: string;
  features?: string[];
  pricing?: string[];
  plans?: PricingPlan[];
  screenshots?: string[];
  verified?: boolean;
  trendScore?: number;
  publishedDate?: string;
  lastVerified?: string;
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
  model: string;
  tool?: string;
  images?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'Published' | 'Pending' | 'Draft';
  date: string;
}

export interface Video {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  duration: string;
  publishedAt: string;
  category: string;
  searchQuery?: string;
  sourceType?: 'youtube' | 'upload';
  videoUrl?: string;
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
  savedTools?: string[];
  savedPrompts?: string[];
}

export interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: string;
  colorClass: string;
}
