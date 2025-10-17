import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import InstagramCommentsModal from '@/components/InstagramCommentsModal'
import { useState, useEffect } from 'react'
import { CampaignContentsService, CampaignContent, processPostsIntoAnalytics, CampaignAnalysisData } from '@/services/campaignContentsService'
import { CampaignAnalyticsService } from '@/services/campaignAnalyticsService'
import { formatNumber } from '@/utils/numberFormat'
import { PostInteraction } from '@/types/post-interactions'

const HashtagPerformancePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [campaignData, setCampaignData] = useState<CampaignContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentHashtag] = useState('daawatbiryani')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [expandedCaptions, setExpandedCaptions] = useState<Set<string>>(new Set())
  const [expandedHashtags, setExpandedHashtags] = useState<Set<string>>(new Set())
  const [analysisData, setAnalysisData] = useState<CampaignAnalysisData | null>(null)
  
  // Modal state for Instagram-style comments
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [modalInteractions, setModalInteractions] = useState<PostInteraction[]>([])
  const [modalLoading, setModalLoading] = useState(false)

  // Mock hashtag performance data
  const hashtagData = [
    {
      hashtag: '#foodie',
      posts: 1245,
      reach: 150000,
      engagement: 12500,
      impressions: 200000,
      platform: 'Instagram',
      trending: true
    },
    {
      hashtag: '#healthyeating',
      posts: 892,
      reach: 98000,
      engagement: 8900,
      impressions: 145000,
      platform: 'Instagram',
      trending: false
    },
    {
      hashtag: '#recipe',
      posts: 2156,
      reach: 180000,
      engagement: 15600,
      impressions: 250000,
      platform: 'Facebook',
      trending: true
    },
    {
      hashtag: '#cooking',
      posts: 756,
      reach: 85000,
      engagement: 7200,
      impressions: 120000,
      platform: 'Twitter',
      trending: false
    },
    {
      hashtag: '#nutrition',
      posts: 623,
      reach: 72000,
      engagement: 6100,
      impressions: 95000,
      platform: 'LinkedIn',
      trending: true
    },
  ]

  // Fetch campaign contents and analysis from API
  useEffect(() => {
    const loadCampaignData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // For now, let's use mock data that matches your API response structure
        // You can replace this with actual API calls later
        const mockApiResponse = {
          "success": true,
          "data": {
            "posts": [], // This will be populated with your actual data
            "total_count": 677,
            "total_pages": 85
          },
          "message": "Success"
        }
        
        // Call both APIs with individual error handling
        let contentsResponse, analysisResponse
        
        try {
          contentsResponse = await CampaignContentsService.getCampaignContents(currentHashtag, 1, itemsPerPage)
          // If API fails, you can use mock data structure
          if (!contentsResponse?.success) {
            contentsResponse = mockApiResponse
          }
        } catch (contentsError) {
          console.error('Contents API Error:', contentsError)
          contentsResponse = mockApiResponse
        }
        
        try {
          analysisResponse = await CampaignContentsService.getCampaignAnalysis(currentHashtag)
        } catch (analysisError) {
          console.error('Analysis API Error:', analysisError)
        }
        
        // Handle contents response
        if (contentsResponse?.success && contentsResponse.data.posts) {
          // Store pagination metadata
          setTotalCount(contentsResponse.data.total_count || 0)
          setTotalPages(contentsResponse.data.total_pages || 0)
          setAllPosts(contentsResponse.data.posts)
          
          // Reset expanded states
          setExpandedCaptions(new Set())
          setExpandedHashtags(new Set())
          
          // Process the posts data into analytics format if there are posts
          if (contentsResponse.data.posts.length > 0) {
            const analyticsData = processPostsIntoAnalytics(contentsResponse.data.posts, currentHashtag)
            setCampaignData([analyticsData])
          } else {
            setCampaignData([])
          }
          setCurrentPage(1)
        } else {
          setCampaignData([])
          setAllPosts([])
          setTotalCount(0)
          setTotalPages(0)
          setCurrentPage(1)
        }
        
        // Handle analysis response
        if (analysisResponse?.success) {
          setAnalysisData(analysisResponse.data)
        } else {
          setAnalysisData(null)
        }
        
      } catch (err) {
        setError('Failed to fetch some campaign data. Please try again.')
        console.error('General API Error:', err)
        setCampaignData([])
        setAllPosts([])
        setAnalysisData(null)
      } finally {
        setLoading(false)
      }
    }

    loadCampaignData()
  }, [currentHashtag, itemsPerPage])

  // Function to load more pages
  const loadMoreData = async () => {
    if (currentPage >= totalPages || loading) return
    
    try {
      setLoading(true)
      const nextPage = currentPage + 1
      const response = await CampaignContentsService.getCampaignContents(currentHashtag, nextPage, itemsPerPage)
      
      if (response.success && response.data.posts.length > 0) {
        // Append new posts to existing data
        const combinedPosts = [...allPosts, ...response.data.posts]
        setAllPosts(combinedPosts)
        
        // Update analytics with combined data
        const analyticsData = processPostsIntoAnalytics(combinedPosts, currentHashtag)
        setCampaignData([analyticsData])
        setCurrentPage(nextPage)
      }
    } catch (err) {
      console.error('Error loading more data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Helper functions for expanding content
  const toggleCaptionExpansion = (postId: string) => {
    setExpandedCaptions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const toggleHashtagExpansion = (postId: string) => {
    setExpandedHashtags(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  // Handler for viewing post interactions
  const handleViewInteractions = async (postId: string) => {
    if (!postId) {
      alert('Post ID is not available')
      return
    }

    setModalLoading(true)
    setShowCommentsModal(true)
    setModalInteractions([])

    try {
      const response = await CampaignAnalyticsService.getPostInteractions(postId)
      
      if (response.success) {
        // Set the interactions data for the modal
        setModalInteractions(response.data.intractions || [])
      } else {
        console.error('Failed to fetch interactions:', response.message || 'Unknown error')
        setModalInteractions([])
      }
    } catch (error) {
      console.error('Error fetching post interactions:', error)
      setModalInteractions([])
    } finally {
      setModalLoading(false)
    }
  }

  // Helper function to safely get caption text
  const getCaptionText = (caption: any): string => {
    if (!caption) return '';
    
    // Handle caption structure: {0: {text: "content"}}
    const captionAny = caption as any;
    
    if (typeof captionAny === 'object' && captionAny['0'] && captionAny['0'].text) {
      return String(captionAny['0'].text);
    }
    // Fallback: try direct string
    else if (typeof captionAny === 'string') {
      return captionAny;
    }
    
    return '';
  }



  // Helper function to safely format numbers
  const safeFormatNumber = (value: any): string => {
    if (value === null || value === undefined) return '0';
    
    // Handle numeric values
    if (typeof value === 'number') {
      return formatNumber(value);
    }
    
    // Handle string numbers
    if (typeof value === 'string') {
      const num = parseInt(value);
      return isNaN(num) ? '0' : formatNumber(num);
    }
    
    // Handle objects (convert to number)
    if (typeof value === 'object') {
      return '0';
    }
    
    return formatNumber(Number(value) || 0);
  }

  // Use API data if available, otherwise use mock data
  const dataToUse = campaignData.length > 0 ? campaignData : hashtagData

  const totalReach = dataToUse.reduce((sum, hashtag) => sum + hashtag.reach, 0)
  const totalEngagement = dataToUse.reduce((sum, hashtag) => sum + hashtag.engagement, 0)
  const totalPosts = dataToUse.reduce((sum, hashtag) => sum + hashtag.posts, 0)
  const trendingCount = dataToUse.filter(hashtag => hashtag.trending).length

  return (
    <>
      <PageTitle title="Hashtag Performance" subName="Track hashtag effectiveness across platforms" />
      
      
      <div className="container-fluid">
        {/* Loading State */}
        {loading && (
          <div className="row">
            <div className="col-12">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading campaign data...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="row">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
                <button 
                  className="btn btn-sm btn-outline-danger ms-3"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hashtag Selection */}
        {!loading && (
          <div className="row mb-4">
            <div className="col-md-6">
              {/* <div className="card">
                <div className="card-body">
                  <label htmlFor="hashtagInput" className="form-label">Track Hashtag Performance</label>
                  <div className="input-group">
                    <span className="input-group-text">#</span>
                    <input
                      id="hashtagInput"
                      type="text"
                      className="form-control"
                      placeholder="Enter hashtag (e.g., daawatbiryani)"
                      value={currentHashtag}
                      onChange={(e) => setCurrentHashtag(e.target.value)}
                    />
                    <button 
                      className="btn btn-primary" 
                      type="button"
                      onClick={() => {
                        // Force re-fetch by updating state
                        const trimmedHashtag = currentHashtag.trim()
                        if (trimmedHashtag) {
                          setCurrentHashtag(trimmedHashtag)
                          // Clear previous data to show loading
                          setCampaignData([])
                        }
                      }}
                      disabled={loading || !currentHashtag.trim()}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-search me-2"></i>
                          Analyze
                        </>
                      )}
                    </button>
                  </div>
                  <small className="form-text text-muted">
                    Currently analyzing: <strong>#{currentHashtag}</strong>
                    {campaignData.length > 0 && (
                      <span className="badge bg-success ms-2">
                        <i className="fas fa-check me-1"></i>
                        API Data Loaded
                      </span>
                    )}
                    {campaignData.length === 0 && !loading && (
                      <span className="badge bg-warning ms-2">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Using Mock Data
                      </span>
                    )}
                  </small>
                </div>
              </div> */}
            </div>
          </div>
        )}

        {/* Main Content - Only show when not loading */}
        {!loading && (
          <>
            {/* Campaign Analytics Dashboard */}
            {analysisData ? (
              <>
           

                {/* Secondary Metrics Row */}
                <div className="row mb-4">
                  <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                    <div className="card bg-success text-white border-0 shadow-sm">
                      <div className="card-body">
                        <div className="text-center">
                          <i className="fas fa-user-friends fa-2x mb-2 opacity-75"></i>
                          <h4 className="mb-1 fw-bold">{analysisData.influencer_count}</h4>
                          <p className="mb-0 small">Influencers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                    <div className="card bg-primary text-white border-0 shadow-sm">
                      <div className="card-body">
                        <div className="text-center">
                          <i className="fas fa-file-alt fa-2x mb-2 opacity-75"></i>
                          <h4 className="mb-1 fw-bold">{analysisData.post_count}</h4>
                          <p className="mb-0 small">Total Posts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                    <div className="card bg-info text-white border-0 shadow-sm">
                      <div className="card-body">
                        <div className="text-center">
                          <i className="fas fa-thumbs-up fa-2x mb-2 opacity-75"></i>
                          <h4 className="mb-1 fw-bold">{formatNumber(analysisData.avg_likes)}</h4>
                          <p className="mb-0 small">Avg Likes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                    <div className="card bg-warning text-white border-0 shadow-sm">
                      <div className="card-body">
                        <div className="text-center">
                          <i className="fas fa-venus fa-2x mb-2 opacity-75"></i>
                          <h4 className="mb-1 fw-bold">{analysisData.gender_distribution.find(g => g.name === 'female')?.percentage || 0}%</h4>
                          <p className="mb-0 small">Female</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
                    <div className="card bg-secondary text-white border-0 shadow-sm">
                      <div className="card-body">
                        <div className="text-center">
                          <i className="fas fa-mars fa-2x mb-2 opacity-75"></i>
                          <h4 className="mb-1 fw-bold">{analysisData.gender_distribution.find(g => g.name === 'male')?.percentage || 0}%</h4>
                          <p className="mb-0 small">Male</p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  
                  <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                    <div className="card bg-dark text-white border-0 shadow-sm">
                      <div className="card-body">
                        <div className="text-center">
                          <i className="fas fa-fire fa-2x mb-2 opacity-75"></i>
                          <h4 className="mb-1 fw-bold">{analysisData.er_distribution.find(er => er.name === 'Above 10')?.count || 0}</h4>
                          <p className="mb-0 small">High ER (&gt;10%)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                     {/* Primary Metrics Row */}
                <div className="row mb-4">
                  {/* <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <div className="card-body text-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h3 className="mb-1 fw-bold">{formatNumber(analysisData.total_followers)}</h3>
                            <p className="mb-0 opacity-75">Total Followers</p>
                            <small className="opacity-75">Cumulative reach</small>
                          </div>
                          <div className="text-end">
                            <i className="fas fa-users fa-2x opacity-75"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  
                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                      <div className="card-body text-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h3 className="mb-1 fw-bold">{formatNumber(analysisData.total_engagements)}</h3>
                            <p className="mb-0 opacity-75">Total Engagements</p>
                            <small className="opacity-75">Likes + Comments + Shares</small>
                          </div>
                          <div className="text-end">
                            <i className="fas fa-heart fa-2x opacity-75"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                      <div className="card-body text-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h3 className="mb-1 fw-bold">{formatNumber(analysisData.total_plays)}</h3>
                            <p className="mb-0 opacity-75">Total Video Plays</p>
                            <small className="opacity-75">Video content views</small>
                          </div>
                          <div className="text-end">
                            <i className="fas fa-play-circle fa-2x opacity-75"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                      <div className="card-body text-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h3 className="mb-1 fw-bold">{(analysisData.avg_er * 100).toFixed(1)}%</h3>
                            <p className="mb-0 opacity-75">Avg Engagement Rate</p>
                            <small className="opacity-75">Performance metric</small>
                          </div>
                          <div className="text-end">
                            <i className="fas fa-chart-line fa-2x opacity-75"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </>
            ) : (
              /* Fallback cards when no analysis data */
              <div className="row mb-4">
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="mb-0">{formatNumber(totalReach)}</h4>
                          <p className="mb-0">Total Reach</p>
                        </div>
                        <i className="fas fa-hashtag fa-2x opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="mb-0">{formatNumber(totalEngagement)}</h4>
                          <p className="mb-0">Total Engagement</p>
                        </div>
                        <i className="fas fa-heart fa-2x opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="mb-0">{formatNumber(totalPosts)}</h4>
                          <p className="mb-0">Total Posts</p>
                        </div>
                        <i className="fas fa-file-alt fa-2x opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-info text-white">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="mb-0">{trendingCount}</h4>
                          <p className="mb-0">Trending Hashtags</p>
                        </div>
                        <i className="fas fa-fire fa-2x opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

        {/* Distribution Analytics */}
        {/* {analysisData && (
          <div className="row mb-4">
            <div className="col-md-4">
              <ComponentContainerCard
                id="gender-distribution"
                title="Gender Distribution"
                description="Breakdown by gender"
              >
                <div className="d-flex flex-column gap-2">
                  {analysisData.gender_distribution.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center">
                      <span className="text-capitalize">{item.name}</span>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary">{item.count}</span>
                        <span className="text-muted small">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ComponentContainerCard>
            </div>
            <div className="col-md-4">
              <ComponentContainerCard
                id="er-distribution"
                title="Engagement Rate Distribution"
                description="ER ranges breakdown"
              >
                <div className="d-flex flex-column gap-2">
                  {analysisData.er_distribution.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center">
                      <span>{item.name}%</span>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-success">{item.count}</span>
                        <span className="text-muted small">{item.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ComponentContainerCard>
            </div>
            <div className="col-md-4">
              <ComponentContainerCard
                id="category-distribution"
                title="Category Distribution"
                description="Content creator categories"
              >
                <div className="d-flex flex-column gap-2">
                  {analysisData.category_distribution.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center">
                      <span>{item.name}</span>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-info">{item.count}</span>
                        <span className="text-muted small">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ComponentContainerCard>
            </div>
          </div>
        )} */}

        {/* Top Influencers and Recent Posts sections */}
        {campaignData.length > 0 && (campaignData[0] as any).topInfluencers && (
          <div className="row mb-4">
            {/* <div className="col-md-6">
              <ComponentContainerCard
                id="top-influencers"
                title="Top Influencers"
                description="Most active influencers for this hashtag"
              >
                <div className="list-group list-group-flush">
                  {((campaignData[0] as any).topInfluencers || []).slice(0, 5).map((influencer: any, index: number) => (
                    <div key={influencer.id} className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-center">
                        <img 
                          src={influencer.profile_pic_url} 
                          alt={influencer.full_name}
                          className="rounded-circle me-3"
                          style={{ width: '40px', height: '40px' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFOUVDRUYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjNkI3MjgwIi8+CjxwYXRoIGQ9Ik0xMiAxNEM4LjEzNDAxIDE0IDUgMTcuMTM0IDUgMjFIMTlDMTkgMTcuMTM0IDE1Ljg2NiAxNCAxMiAxNFoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+Cjwvc3ZnPgo='
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-0">{influencer.full_name}</h6>
                              <small className="text-muted">@{influencer.username}</small>
                            </div>
                            <div className="text-end">
                              {influencer.is_verified && (
                                <i className="fas fa-check-circle text-primary me-2" title="Verified"></i>
                              )}
                              <span className="badge bg-light text-dark">#{index + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ComponentContainerCard>
            </div>
            
            <div className="col-md-6">
              <ComponentContainerCard
                id="recent-posts"
                title="Recent Posts"
                description="Latest posts using this hashtag"
              >
                <div className="list-group list-group-flush">
                  {((campaignData[0] as any).recentPosts || []).slice(0, 3).map((post: any) => (
                    <div key={post._id} className="list-group-item border-0 px-0">
                      <div className="d-flex">
                        <img 
                          src={post.display_url || post.thumbnail_url || post.media_url || post.video_url || '/images/placeholder.jpg'} 
                          alt="Post"
                          className="rounded me-3"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAyMEMyNC40NzcgMjAgMjAgMjQuNDc3IDIwIDMwVjMwQzIwIDM1LjUyMyAyNC40NzcgNDAgMzAgNDBDMzUuNTIzIDQwIDQwIDM1LjUyMyA0MCAzMFYzMEM0MCAyNC40NzcgMzUuNTIzIDIwIDMwIDIwWiIgZmlsbD0iI0NCRDBEMyIvPgo8cGF0aCBkPSJNMjUgMjdIMjhWMzNIMjVWMjdaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0zMiAyN0gzNVYzM0gzMlYyN1oiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+'
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">@{post.influencer.username}</h6>
                              <p className="mb-1 text-muted small">
                                {(() => {
                                  const captionText = getCaptionText(post.caption);
                                  return captionText.length > 100 ? `${captionText.substring(0, 100)}...` : captionText;
                                })()}
                              </p>
                              <small className="text-muted">{post.created_timestamp_formatted}</small>
                            </div>
                            <div className="text-end">
                              <div className="d-flex flex-column small">
                                <span><i className="fas fa-heart text-danger me-1"></i>{safeFormatNumber(post.total_likes)}</span>
                                <span><i className="fas fa-comment text-info me-1"></i>{safeFormatNumber(post.total_comments)}</span>
                                {post.is_video && (
                                  <span><i className="fas fa-play text-success me-1"></i>{safeFormatNumber(post.total_play)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ComponentContainerCard>
            </div> */}
          </div>
        )}

        {/* Hashtag Posts Table */}
        <ComponentContainerCard
          id="hashtag-posts"
          title="Hashtag Posts"
          description="Detailed view of all posts using this hashtag"
        >
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6 text-end">
              <div className="dropdown">
                <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <i className="fas fa-filter me-2"></i>Filters
                </button>
                <div className="dropdown-menu p-3" style={{ minWidth: '250px' }}>
                  <h6 className="dropdown-header">Filter Options</h6>
                  <div className="mb-2">
                    <label className="form-label small">Sort By (Highest)</label>
                    <select className="form-select form-select-sm">
                      <option>Latest First</option>
                      <option>Oldest First</option>
                      <option>Highest Liked</option>
                      <option>Highest Shared</option>
                      <option>Highest Played</option>
                    </select>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="verifiedOnly" />
                    <label className="form-check-label small" htmlFor="verifiedOnly">
                      Verified accounts only
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="videoOnly" />
                    <label className="form-check-label small" htmlFor="videoOnly">
                      Video posts only
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Posts Table */}
          {allPosts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-borderless" style={{ fontSize: '15px' }}>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '60px', padding: '1.25rem', fontSize: '16px' }} className="fw-semibold">#</th>
                    <th style={{ width: '280px', padding: '1.25rem', fontSize: '16px' }} className="fw-semibold">Influencer</th>
                    <th style={{ width: '130px', padding: '1.25rem', fontSize: '16px' }} className="fw-semibold">Post</th>
                    {/* <th style={{ width: '130px', padding: '1.25rem', fontSize: '16px' }} className="fw-semibold">Post Type</th> */}
                    <th style={{ width: '150px', padding: '1.25rem', fontSize: '16px' }} className="fw-semibold">Interactions</th>
                    <th style={{ width: '280px', padding: '1.25rem', fontSize: '16px' }} className="fw-semibold">Engagement</th>
                    <th style={{ padding: '1.25rem', fontSize: '16px' }} className="fw-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {allPosts.map((post: any, index: number) => (
                    <tr key={post._id?.$oid || post._id || index} style={{ borderBottom: '1px solid #f8f9fa' }}>
                      <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <span className="fw-semibold text-muted">{index + 1}</span>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <div className="d-flex align-items-center">
                          <img 
                            src={post.influencer?.instagram?.profile_pic_url || '/images/default-avatar.jpg'} 
                            alt={post.influencer?.fullname || 'User Profile'}
                            className="rounded-circle me-3"
                            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFOUVDRUYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA4IDEyIDRDOS43OTA4NiA4IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjNkI3MjgwIi8+CjxwYXRoIGQ9Ek0xMiAxNEM4LjEzNDAxIDE0IDUgMTcuMTM0IDUgMjFIMTlDMTkgMTcuMTM0IDE1Ljg2NiAxNCAxMiAxNFoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+Cjwvc3ZnPgo='
                            }}
                          />
                          <div>
                            <div className="fw-semibold" style={{ fontSize: '16px' }}>{post.influencer?.handle || post.influencer?.instagram?.handle || 'Unknown'}</div>
                            <div className="text-muted" style={{ fontSize: '14px' }}>{post.influencer?.fullname || 'No name available'}</div>
                            <div className="mt-2">
                              {(post.influencer?.is_verified || post.influencer?.instagram?.is_verified) && (
                                <span className="badge bg-primary" style={{ fontSize: '12px' }}>
                                  <i className="fas fa-check me-1"></i>Verified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>  
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <div className="position-relative">
                          <img 
                            src={post.display_url || post.thumbnail_url || post.media_url || post.video_url || '/images/placeholder.jpg'} 
                            alt="Post"
                            className="rounded cursor-pointer"
                            style={{ width: '90px', height: '90px', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => {
                              // Open Instagram post in new tab
                              const instagramUrl = `https://www.instagram.com/p/${post.post_shortcode}/`
                              window.open(instagramUrl, '_blank', 'noopener,noreferrer')
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjkwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00NSAzMEMzNy4yNjggMzAgMzEgMzYuMjY4IDMxIDQ0VjQ2QzMxIDUzLjczMiAzNy4yNjggNjAgNDUgNjBDNTIuNzMyIDYwIDU5IDUzLjczMiA1OSA0NlY0NEM1OSAzNi4yNjggNTIuNzMyIDMwIDQ1IDMwWiIgZmlsbD0iI0NCRDBEMyIvPgo8cGF0aCBkPSJNMzUgNDBIMzlWNTBIMzVWNDBaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik01MSA0MEg1NVY1MEg1MVY0MFoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+'
                            }}
                            title="Click to view on Instagram"
                          />
                          {post.is_video && (
                            <div 
                              className="position-absolute top-50 start-50 translate-middle"
                              style={{ pointerEvents: 'none' }}
                            >
                              <i className="fas fa-play-circle text-white" style={{ fontSize: '1.8rem' }}></i>
                            </div>
                          )}
                          {/* Instagram overlay indicator */}
                          <div 
                            className="position-absolute top-0 end-0 m-1"
                            style={{ pointerEvents: 'none' }}
                          >
                            <i className="fab fa-instagram text-white" style={{ fontSize: '1rem', textShadow: '0 0 3px rgba(0,0,0,0.5)' }}></i>
                          </div>
                        </div>
                      </td>
                      {/* <td style={{ padding: '1.5rem' }}>
                        <span className={`badge ${post.is_video ? 'bg-success' : post.is_carousel ? 'bg-info' : 'bg-secondary'}`} style={{ fontSize: '13px' }}>
                          {post.is_video ? 'Video' : post.is_carousel ? 'Carousel' : 'Image'}
                        </span>
                        <div className="text-muted mt-2" style={{ fontSize: '13px' }}>Organic</div>
                      </td> */}
                      <td style={{ padding: '1.5rem' }}>
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleViewInteractions(post._id?.$oid || post._id)}
                          style={{ fontSize: '12px' }}
                          title="Click to view post interactions"
                        >
                          <i className="fas fa-chart-line me-1"></i>
                          View Interactions
                        </button>
                      </td>  
                      <td style={{ padding: '1.5rem' }}>
                        <div className="d-flex align-items-center justify-content-start gap-4">
                                                  <div className="d-flex flex-column gap-3">
                          <div className="d-flex align-items-center">
                            <i className="far fa-eye text-primary me-2" style={{ fontSize: '16px', width: '20px' }}></i>
                            <span className="fw-semibold" style={{ fontSize: '15px' }}>{formatNumber(post.total_play || post.reach || 0)}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <i className="fas fa-heart text-danger me-2" style={{ fontSize: '16px', width: '20px' }}></i>
                            <span className="fw-semibold" style={{ fontSize: '15px' }}>{safeFormatNumber(post.total_likes)}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <i className="fas fa-share text-success me-2" style={{ fontSize: '16px', width: '20px' }}></i>
                            <span className="fw-semibold" style={{ fontSize: '15px' }}>{safeFormatNumber(post.reshare_count)}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <i className="fas fa-comment text-info me-2" style={{ fontSize: '16px', width: '20px' }}></i>
                            <span className="fw-semibold" style={{ fontSize: '15px' }}>{safeFormatNumber(post.total_comments)}</span>
                          </div>
                        </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem', minWidth: '350px' }}>
                        <div>
                          <div className="d-flex align-items-center mb-3">
                            <i className="far fa-calendar text-muted me-2" style={{ fontSize: '14px' }}></i>
                            <span style={{ fontSize: '15px' }}>{post.created_timestamp_formatted}</span>
                          </div>
                          <div className="d-flex align-items-center mb-3">
                            <i className="fas fa-users text-muted me-2" style={{ fontSize: '14px' }}></i>
                            <span style={{ fontSize: '15px' }}>{formatNumber(post.total_play || 0)}</span>
                          </div>
                          {post.location && post.location.name && (
                            <div className="d-flex align-items-center mb-3">
                              <i className="fas fa-map-marker-alt text-danger me-2" style={{ fontSize: '14px' }}></i>
                              <span className="text-truncate" style={{ maxWidth: '250px', fontSize: '15px' }}>
                                {post.location.name}
                              </span>
                            </div>
                          )}
                          <div className="mb-3">
                            <div 
                              style={{ 
                                maxWidth: '300px', 
                                fontSize: '15px', 
                                lineHeight: '1.4',
                                overflow: expandedCaptions.has(post._id?.$oid || post._id) ? 'visible' : 'hidden',
                                display: expandedCaptions.has(post._id?.$oid || post._id) ? 'block' : '-webkit-box',
                                WebkitLineClamp: expandedCaptions.has(post._id?.$oid || post._id) ? 'none' : 3,
                                WebkitBoxOrient: 'vertical' as const,
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {(() => {
                                const captionText = getCaptionText(post.caption);
                                return expandedCaptions.has(post._id?.$oid || post._id) 
                                  ? captionText 
                                  : captionText.length > 80 
                                    ? `${captionText.substring(0, 80)}...` 
                                    : captionText;
                              })()}
                            </div>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mb-3">
                            {(expandedHashtags.has(post._id?.$oid || post._id) ? post.hashtags : post.hashtags.slice(0, 4)).map((tag: string, tagIndex: number) => (
                              <span key={tagIndex} className="badge bg-light text-primary" style={{ fontSize: '12px' }}>
                                {tag}
                              </span>
                            ))}
                            {post.hashtags.length > 4 && !expandedHashtags.has(post._id?.$oid || post._id) && (
                              <span 
                                className="badge bg-light text-muted" 
                                style={{ 
                                  fontSize: '12px', 
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  border: '1px solid transparent'
                                }}
                                onClick={() => toggleHashtagExpansion(post._id?.$oid || post._id)}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#e9ecef'
                                  e.currentTarget.style.borderColor = '#dee2e6'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#f8f9fa'
                                  e.currentTarget.style.borderColor = 'transparent'
                                }}
                                role="button"
                                title="Click to show all hashtags"
                              >
                                <i className="fas fa-hashtag me-1"></i>
                                +{post.hashtags.length - 4}
                              </span>
                            )}
                            {expandedHashtags.has(post._id?.$oid || post._id) && post.hashtags.length > 4 && (
                              <span 
                                className="badge bg-light text-muted" 
                                style={{ 
                                  fontSize: '12px', 
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  border: '1px solid transparent'
                                }}
                                onClick={() => toggleHashtagExpansion(post._id?.$oid || post._id)}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#e9ecef'
                                  e.currentTarget.style.borderColor = '#dee2e6'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#f8f9fa'
                                  e.currentTarget.style.borderColor = 'transparent'
                                }}
                                role="button"
                                title="Click to show less hashtags"
                              >
                                <i className="fas fa-minus me-1"></i>
                                Show Less
                              </span>
                            )}
                          </div>
                          {getCaptionText(post.caption).length > 80 && (
                            <div>
                              <button 
                                className="btn btn-link btn-sm p-0 text-primary" 
                                style={{ fontSize: '15px', cursor: 'pointer' }}
                                onClick={() => toggleCaptionExpansion(post._id?.$oid || post._id)}
                              >
                                {expandedCaptions.has(post._id?.$oid || post._id) ? (
                                  <>
                                    <i className="fas fa-chevron-up me-1"></i>
                                    View Less
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-chevron-down me-1"></i>
                                    View More
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Load More Button */}
              {!loading && totalPages > 0 && currentPage < totalPages && (
                <div className="text-center mt-4">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={loadMoreData}
                    disabled={loading}
                  >
                    <i className="fas fa-chevron-down me-2"></i>
                    Load {itemsPerPage} More
                  </button>
                </div>
              )}

              {/* Page Navigation */}
              {!loading && totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage(1)
                        // Reset to first page
                        const loadFirstPage = async () => {
                          try {
                            setLoading(true)
                            const response = await CampaignContentsService.getCampaignContents(currentHashtag, 1, itemsPerPage)
                            if (response.success) {
                              setAllPosts(response.data.posts)
                              const analyticsData = processPostsIntoAnalytics(response.data.posts, currentHashtag)
                              setCampaignData([analyticsData])
                              setCurrentPage(1)
                            }
                          } catch (err) {
                            console.error('Error loading first page:', err)
                          } finally {
                            setLoading(false)
                          }
                        }
                        loadFirstPage()
                      }
                    }}
                    disabled={currentPage === 1 || loading}
                  >
                    <i className="fas fa-chevron-left me-1"></i>
                    First
                  </button>
                  
                  <span className="badge bg-primary fs-6 px-3 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={loadMoreData}
                    disabled={currentPage >= totalPages || loading}
                  >
                    Next
                    <i className="fas fa-chevron-right ms-1"></i>
                  </button>
                </div>
              )}

              {/* Pagination Info */}
              {!loading && totalCount > 0 && (
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Showing {allPosts.length} of {totalCount} posts
                  </small>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-hashtag fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No posts found</h5>
              <p className="text-muted">Try searching for a different hashtag or check your API connection.</p>
            </div>
          )}
        </ComponentContainerCard>
          </>
        )}
      </div>

      {/* Instagram-style Comments Modal */}
      <InstagramCommentsModal
        show={showCommentsModal}
        onHide={() => setShowCommentsModal(false)}
        interactions={modalInteractions}
        loading={modalLoading}
      />
    </>
  )
}

export default HashtagPerformancePage