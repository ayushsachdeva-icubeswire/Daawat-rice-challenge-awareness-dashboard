import { Interaction, Challenge, Post, ChatMessage, DashboardStats, ExtendedCardsType } from '@/types/dashboard'
import { PostData } from '@/services/campaignContentsService'

// Mock Rice Challenge Influencers Data
export const mockUsers = [
  { id: '1', name: 'Priya Sharma', mobile: '+91-9876543210', avatar: '/src/assets/images/users/avatar-1.jpg', followers: '156K', specialty: 'Biryani Expert' },
  { id: '2', name: 'Rahul Khanna', mobile: '+91-9876543211', avatar: '/src/assets/images/users/avatar-2.jpg', followers: '89K', specialty: 'Street Food Rice' },
  { id: '3', name: 'Meera Patel', mobile: '+91-9876543212', avatar: '/src/assets/images/users/avatar-3.jpg', followers: '203K', specialty: 'South Indian Rice' },
  { id: '4', name: 'Arjun Singh', mobile: '+91-9876543213', avatar: '/src/assets/images/users/avatar-4.jpg', followers: '127K', specialty: 'Fusion Rice Bowls' },
  { id: '5', name: 'Kavya Reddy', mobile: '+91-9876543214', avatar: '/src/assets/images/users/avatar-5.jpg', followers: '184K', specialty: 'Healthy Rice Recipes' },
  { id: '6', name: 'Rohit Gupta', mobile: '+91-9876543215', avatar: '/src/assets/images/users/avatar-6.jpg', followers: '95K', specialty: 'Regional Rice Dishes' },
  { id: '7', name: 'Sneha Joshi', mobile: '+91-9876543216', avatar: '/src/assets/images/users/avatar-7.jpg', followers: '142K', specialty: 'Rice Desserts' },
  { id: '8', name: 'Vikram Menon', mobile: '+91-9876543217', avatar: '/src/assets/images/users/avatar-8.jpg', followers: '73K', specialty: 'Quick Rice Meals' },
]

// Mock Rice Challenge Interactions Data
export const mockInteractions: Interaction[] = [
  {
    id: '1',
    type: 'like',
    userId: '1',
    userName: 'Priya Sharma',
    userAvatar: '/src/assets/images/users/avatar-1.jpg',
    contentId: 'post-1',
    contentTitle: 'Day 15: Hyderabadi Biryani Journey 🍚',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  },
  {
    id: '2',
    type: 'comment',
    userId: '2',
    userName: 'Rahul Khanna',
    userAvatar: '/src/assets/images/users/avatar-2.jpg',
    contentId: 'post-2',
    contentTitle: 'Day 22: Street Style Veg Fried Rice Challenge',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    message: 'This looks absolutely delicious! Can you share the recipe? 🤤',
  },
  {
    id: '3',
    type: 'share',
    userId: '3',
    userName: 'Meera Patel',
    userAvatar: '/src/assets/images/users/avatar-3.jpg',
    contentId: 'challenge-1',
    contentTitle: '30-Day Rice Challenge: South Indian Special',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: '4',
    type: 'view',
    userId: '4',
    userName: 'Arjun Singh',
    userAvatar: '/src/assets/images/users/avatar-4.jpg',
    contentId: 'post-3',
    contentTitle: 'Day 8: Fusion Rice Bowl Creation',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  },
  {
    id: '5',
    type: 'like',
    userId: '5',
    userName: 'Kavya Reddy',
    userAvatar: '/src/assets/images/users/avatar-5.jpg',
    contentId: 'challenge-2',
    contentTitle: 'Healthy Brown Rice Transformation Challenge',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: '6',
    type: 'comment',
    userId: '6',
    userName: 'Rohit Gupta',
    userAvatar: '/src/assets/images/users/avatar-6.jpg',
    contentId: 'post-4',
    contentTitle: 'Day 18: Regional Rice Delicacies Tour',
    timestamp: new Date(Date.now() - 75 * 60 * 1000), // 1 hour 15 min ago
    message: 'Amazing variety! The Kashmiri rice looks incredible 😍',
  },
  {
    id: '7',
    type: 'share',
    userId: '7',
    userName: 'Sneha Joshi',
    userAvatar: '/src/assets/images/users/avatar-7.jpg',
    contentId: 'post-5',
    contentTitle: 'Day 25: Rice Kheer & Dessert Challenge',
    timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
  },
  {
    id: '8',
    type: 'like',
    userId: '8',
    userName: 'Vikram Menon',
    userAvatar: '/src/assets/images/users/avatar-8.jpg',
    contentId: 'post-6',
    contentTitle: 'Day 12: 15-Minute Rice Meal Challenge',
    timestamp: new Date(Date.now() - 105 * 60 * 1000), // 1 hour 45 min ago
  },
]

// Mock Rice Challenges Data
export const mockChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: '30-Day Rice Challenge: Biryani Mastery',
    description: 'Master 30 different biryani recipes from across India in 30 days',
    difficulty: 'hard',
    category: 'Biryani',
    points: 500,
    status: 'in-progress',
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    participantCount: 156,
    timeLimit: 30 * 24 * 60, // 30 days in minutes
  },
  {
    id: 'challenge-2',
    title: 'South Indian Rice Festival Challenge',
    description: 'Explore traditional South Indian rice dishes - from dosa to idli to varieties of rice',
    difficulty: 'medium',
    category: 'South Indian',
    points: 300,
    status: 'completed',
    startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
    completionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    participantCount: 203,
    timeLimit: 30 * 24 * 60, // 30 days
  },
  {
    id: 'challenge-3',
    title: 'Healthy Rice Bowl Challenge',
    description: 'Create nutritious and Instagram-worthy rice bowls with superfoods',
    difficulty: 'medium',
    category: 'Healthy',
    points: 400,
    status: 'not-started',
    participantCount: 156,
    timeLimit: 180,
  },
  {
    id: 'challenge-4',
    title: 'Quick Rice Meals Challenge',
    description: 'Create delicious rice meals in under 15 minutes - perfect for busy influencers',
    difficulty: 'easy',
    category: 'Quick Meals',
    points: 200,
    status: 'in-progress',
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    participantCount: 98,
    timeLimit: 30 * 24 * 60, // 30 days
  },
  {
    id: 'challenge-5',
    title: 'Rice Dessert Innovation Challenge',
    description: 'Transform traditional rice into Instagram-worthy desserts and sweet treats',
    difficulty: 'hard',
    category: 'Desserts',
    points: 350,
    status: 'completed',
    startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
    completionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    participantCount: 89,
    timeLimit: 30 * 24 * 60, // 30 days
  },
  {
    id: 'challenge-6',
    title: 'Regional Rice Heritage Challenge',
    description: 'Showcase rice dishes from different Indian states and their cultural significance',
    difficulty: 'medium',
    category: 'Heritage',
    points: 450,
    status: 'not-started',
    participantCount: 67,
    timeLimit: 30 * 24 * 60, // 30 days
  },
]

// Mock Rice Challenge Posts Data
export const mockPosts: Post[] = [
  {
    id: 'post-1',
    title: 'Day 15: Hyderabadi Biryani Masterclass 🍚✨',
    content: 'Today I attempted the famous Hyderabadi Dum Biryani! The aroma alone had my neighbors asking for the recipe. Swipe to see the layers of perfection... #30DayRiceChallenge #BiryaniLove',
    author: {
      id: '1',
      name: 'Priya Sharma',
      avatar: '/src/assets/images/users/avatar-1.jpg',
    },
    category: 'Biryani',
    tags: ['biryani', 'hyderabadi', 'riceChallenge', '30days', 'InstagramFood'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    likes: 2456,
    comments: 184,
    shares: 89,
    views: 15670,
    isPublished: true,
  },
  {
    id: 'post-2',
    title: 'Day 22: Street Style Veg Fried Rice Challenge 🥢',
    content: 'Who says street food cant be healthy? My take on Mumbai street-style fried rice with extra veggies and that perfect wok hei flavor! Recipe in comments 👇',
    author: {
      id: '2',
      name: 'Rahul Khanna',
      avatar: '/src/assets/images/users/avatar-2.jpg',
    },
    category: 'Street Food',
    tags: ['streetfood', 'friedrice', 'mumbai', 'healthy', 'riceChallenge'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    likes: 1876,
    comments: 156,
    shares: 67,
    views: 12890,
    isPublished: true,
  },
  {
    id: 'post-3',
    title: 'Day 8: Fusion Rice Bowl Creations 🌈',
    content: 'Mixing cultures in a bowl! Today I created Mexican-Indian fusion rice bowls with cilantro lime rice, rajma, and fresh salsa. Cross-cultural cooking at its finest! 🌮🍚',
    author: {
      id: '4',
      name: 'Arjun Singh',
      avatar: '/src/assets/images/users/avatar-4.jpg',
    },
    category: 'Fusion',
    tags: ['fusion', 'ricebowl', 'mexican', 'indian', 'creative'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    likes: 1342,
    comments: 98,
    shares: 45,
    views: 8965,
    isPublished: true,
  },
  {
    id: 'post-4',
    title: 'Day 18: Regional Rice Delicacies Tour 🗺️',
    content: 'From Kashmiri Yakhni Pulao to Tamil Nadu Curd Rice - exploring the incredible diversity of Indian rice dishes. Each state has its own rice story to tell! 📍',
    author: {
      id: '6',
      name: 'Rohit Gupta',
      avatar: '/src/assets/images/users/avatar-6.jpg',
    },
    category: 'Regional',
    tags: ['regional', 'heritage', 'diversity', 'pulao', 'curdrice'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    likes: 2145,
    comments: 267,
    shares: 134,
    views: 18456,
    isPublished: true,
  },
  {
    id: 'post-5',
    title: 'Day 25: Rice Kheer & Dessert Challenge 🍮',
    content: 'Sweet endings to the rice challenge! Made traditional kheer, rice pudding, and even rice ice cream. Who knew rice could be this versatile in desserts? 🍨',
    author: {
      id: '7',
      name: 'Sneha Joshi',
      avatar: '/src/assets/images/users/avatar-7.jpg',
    },
    category: 'Desserts',
    tags: ['kheer', 'dessert', 'ricepudding', 'sweet', 'traditional'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    likes: 3456,
    comments: 189,
    shares: 78,
    views: 21567,
    isPublished: true,
  },
  {
    id: 'post-6',
    title: 'Day 12: 15-Minute Rice Meal Challenge ⏰',
    content: 'Busy day? No problem! Quick lemon rice with curry leaves and peanuts - ready in just 15 minutes. Perfect for busy influencers on the go! 🏃‍♂️💨',
    author: {
      id: '8',
      name: 'Vikram Menon',
      avatar: '/src/assets/images/users/avatar-8.jpg',
    },
    category: 'Quick Meals',
    tags: ['quickmeals', 'lemonrice', 'busy', 'efficient', '15minutes'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    likes: 987,
    comments: 67,
    shares: 34,
    views: 6789,
    isPublished: true,
  },
]

// Mock Rice Challenge Chat Messages Data
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: '2',
    senderName: 'Rahul Khanna',
    senderAvatar: '/src/assets/images/users/avatar-2.jpg',
    message: 'Just completed Day 22 of the rice challenge! That street-style fried rice was incredible. My followers are going crazy for the recipe! 🍚🔥',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    type: 'challenge',
    relatedItemId: 'challenge-3',
    isRead: false,
  },
  {
    id: 'msg-2',
    senderId: '1',
    senderName: 'Priya Sharma',
    senderAvatar: '/src/assets/images/users/avatar-1.jpg',
    message: 'That Hyderabadi biryani post got 2.5K likes in just 3 hours! My followers are asking for a video tutorial 📹',
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    type: 'post',
    relatedItemId: 'post-1',
    isRead: true,
  },
  {
    id: 'msg-3',
    senderId: '3',
    senderName: 'Meera Patel',
    senderAvatar: '/src/assets/images/users/avatar-3.jpg',
    message: 'Anyone want to collaborate on the South Indian rice challenge? We could do a joint live session! 🤝',
    timestamp: new Date(Date.now() - 40 * 60 * 1000), // 40 minutes ago
    type: 'challenge',
    relatedItemId: 'challenge-2',
    isRead: true,
  },
  {
    id: 'msg-4',
    senderId: '4',
    senderName: 'Arjun Singh',
    senderAvatar: '/src/assets/images/users/avatar-4.jpg',
    message: 'My fusion rice bowl post is trending! 50+ DMs asking for the exact recipe. This challenge is boosting my engagement like crazy! 📈',
    timestamp: new Date(Date.now() - 55 * 60 * 1000), // 55 minutes ago
    type: 'interaction',
    relatedItemId: '4',
    isRead: true,
  },
  {
    id: 'msg-5',
    senderId: '5',
    senderName: 'Kavya Reddy',
    senderAvatar: '/src/assets/images/users/avatar-5.jpg',
    message: 'The healthy rice bowl challenge was amazing! Gained 2K new followers who love nutritious recipes 🌱',
    timestamp: new Date(Date.now() - 70 * 60 * 1000), // 70 minutes ago
    type: 'challenge',
    relatedItemId: 'challenge-3',
    isRead: true,
  },
]

// Calculate Dashboard Stats
export const getDashboardStats = (): DashboardStats => {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const recentInteractions = mockInteractions.filter(
    interaction => interaction.timestamp > oneDayAgo
  ).length

  const challengesTaken = mockChallenges.filter(
    challenge => challenge.status === 'in-progress' || challenge.status === 'completed'
  ).length

  const completedChallenges = mockChallenges.filter(
    challenge => challenge.status === 'completed'
  ).length

  const totalPosts = mockPosts.length
  const publishedPosts = mockPosts.filter(post => post.isPublished).length

  return {
    recentInteractions,
    challengesTaken,
    totalPosts,
    totalInteractions: mockInteractions.length,
    completedChallenges,
    publishedPosts,
  }
}

// Extended Cards Data for Dashboard
export const getExtendedCardsData = (): ExtendedCardsType[] => {
  const stats = getDashboardStats()

  return [
    // {
    //   title: 'Recent Interactions',
    //   count: stats.recentInteractions,
    //   icon: 'solar:chat-round-line-broken',
    //   series: [12, 15, 18, 22, 28, 35, 42, 38, 45, 52, 48],
    //   color: '#3b82f6',
    //   trend: 'up',
    //   trendValue: '+12%',
    // },
    {
      title: 'Challenges Taken',
      count: stats.challengesTaken,
      icon: 'solar:cup-star-broken',
      series: [8, 12, 16, 20, 18, 25, 30, 28, 32, 35, 40],
      color: '#10b981',
      trend: 'up',
      trendValue: '+8%',
    },
    {
      title: 'Total Posts',
      count: stats.totalPosts,
      icon: 'solar:document-text-broken',
      series: [5, 8, 12, 15, 18, 22, 25, 30, 28, 32, 35],
      color: '#f59e0b',
      trend: 'up',
      trendValue: '+15%',
    },
    {
      title: 'Completed Challenges',
      count: stats.completedChallenges,
      icon: 'solar:medal-star-broken',
      series: [2, 4, 6, 8, 10, 12, 15, 18, 16, 20, 22],
      color: '#8b5cf6',
      trend: 'up',
      trendValue: '+25%',
    },
  ]
}

// Helper functions
export const getRecentInteractions = (limit: number = 10) => 
  mockInteractions.slice(0, limit)

export const getActiveChallenges = (limit: number = 10) => 
  mockChallenges.filter(challenge => challenge.status === 'in-progress').slice(0, limit)

export const getRecentPosts = (limit: number = 10) => 
  mockPosts.slice(0, limit)

// Function to convert Post[] to PostData[] for ActivityTabs component
export const getRecentPostsData = (limit: number = 10): PostData[] => {
  return mockPosts.slice(0, limit).map((post, index) => ({
    _id: post.id,
    post_shortcode: `p${post.id.replace('post-', '')}`,
    influencer_id: post.author.id,
    influencer_id_object: post.author.id,
    influencer: {
      _id: { $oid: post.author.id },
      first_name: post.author.name.split(' ')[0] || '',
      last_name: post.author.name.split(' ')[1] || '',
  full_name: post.author.name,
      username: post.author.name.toLowerCase().replace(' ', '_'),
      handle: post.author.name.toLowerCase().replace(' ', '_'),
      platform: 'instagram',
      created_by: 1,
      role_id: 1,
      categories: [],
      instagram: {
  profile_pic_url: post.author.avatar,
        follower_count: (Math.floor(Math.random() * 100000) + 10000).toString(),
        following_count: (Math.floor(Math.random() * 1000) + 100).toString(),
        media_count: Math.floor(Math.random() * 500) + 50,
        is_verified: Math.random() > 0.5,
        is_private: false,
        handle: post.author.name.toLowerCase().replace(' ', '_'),
        influencer_type: { category: 'individual', type: 'creator' },
        follower_count_actual: Math.floor(Math.random() * 100000) + 10000,
        following_count_actual: Math.floor(Math.random() * 1000) + 100,
        biography: 'Mock bio',
        external_url: undefined,
        engagement_ratio: Math.random() * 10 + 1,
        average_likes: Math.floor(Math.random() * 1000) + 100,
        average_comments: Math.floor(Math.random() * 100) + 10,
        average_reach: Math.floor(Math.random() * 10000) + 1000
      },
      is_iq: false
    },
    thumbnail_url: `/src/assets/images/small/small-${(index % 4) + 1}.jpg`,
    display_url: `/src/assets/images/small/small-${(index % 4) + 1}.jpg`,
    is_video: Math.random() > 0.7,
    is_carousel: Math.random() > 0.8,
    caption: { 0: { text: post.content } },
    total_comments: post.comments,
    total_likes: post.likes,
    total_views: post.views,
    total_followers: Math.floor(Math.random() * 100000) + 10000,
    video_duration: Math.random() > 0.7 ? Math.floor(Math.random() * 60) + 15 : undefined,
    total_play: Math.random() > 0.7 ? Math.floor(Math.random() * 10000) + 1000 : undefined,
    reach: post.views,
    created_timestamp: post.createdAt.getTime(),
    created_timestamp_formatted: post.createdAt.toISOString(),
    created_date: { $date: { $numberLong: post.createdAt.getTime().toString() } },
    reshare_count: post.shares,
    ig_post_id: `ig_${post.id}`,
    location: [],
    usertags: [],
    hashtags: post.tags,
    offer_id: 1,
    content_id: index + 1,
    created_at: post.createdAt.toISOString(),
    like_and_view_counts_disabled: false,
    is_paid_partnership: Math.random() > 0.8,
    is_pinned: false,
    sponsor_tags: [],
    updated_at: post.createdAt.toISOString(),
    negative_content: false,
    er: Math.random() * 10 + 1  // engagement rate
  }))
}

export const getRecentChatMessages = (limit: number = 10) => 
  mockChatMessages.slice(0, limit)

export const getChatMessagesByType = (type: 'interaction' | 'challenge' | 'post', limit: number = 10) =>
  mockChatMessages.filter(msg => msg.type === type).slice(0, limit)