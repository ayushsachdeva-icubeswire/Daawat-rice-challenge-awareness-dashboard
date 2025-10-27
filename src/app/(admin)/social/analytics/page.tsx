import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState, useEffect } from 'react'
import { CampaignAnalyticsService, CampaignAnalyticsData, InfluencerListResponse, InfluencerData } from '@/services/campaignAnalyticsService'
import { formatNumber } from '@/utils/numberFormat'

const SocialAnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<CampaignAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Influencer data state
  const [influencerData, setInfluencerData] = useState<InfluencerListResponse | null>(null)
  const [influencerLoading, setInfluencerLoading] = useState(true)
  const [influencerError, setInfluencerError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerData | null>(null)

  // Default/fallback analytics data
  const defaultAnalyticsData = {
    totalPosts: '0',
    totalViews: '0',
    totalLikes: '0',
    totalComments: '0',
    totalReshare: '0',
    avgER: 0,
    avgReach: '0',
    influencerCount: 0,
    platforms: [
      { name: 'Instagram', followers: 0, engagement: 0, posts: 0 },
      { name: 'Facebook', followers: 0, engagement: 0, posts: 0 },
      { name: 'Twitter', followers: 0, engagement: 0, posts: 0 },
      { name: 'LinkedIn', followers: 0, engagement: 0, posts: 0 },
    ]
  }

  // Fetch campaign analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await CampaignAnalyticsService.getCampaignAnalysis('1069')
        setAnalyticsData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
        console.error('Error fetching analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  // Fetch initial influencer data
  useEffect(() => {
    const fetchInitialInfluencerData = async () => {
      try {
        setInfluencerLoading(true)
        setInfluencerError(null)
        const data = await CampaignAnalyticsService.getInfluencerList('1069', 1, itemsPerPage)
        setInfluencerData(data)
        
        // Set pagination metadata
        if (data?.data) {
          setTotalPages(data.data.totalPages || 0)
          setTotalCount(data.data.totalCount || 0)
        }
      } catch (err) {
        setInfluencerError(err instanceof Error ? err.message : 'Failed to fetch influencer data')
        console.error('Error fetching influencers:', err)
      } finally {
        setInfluencerLoading(false)
      }
    }

    // Only fetch on initial load
    fetchInitialInfluencerData()
  }, [itemsPerPage])

  // Function to load more pages
  const loadMoreData = async () => {
    if (currentPage >= totalPages || influencerLoading) return
    
    try {
      setInfluencerLoading(true)
      const nextPage = currentPage + 1
      const data = await CampaignAnalyticsService.getInfluencerList('1069', nextPage, itemsPerPage)
      
      if (data?.data?.result && data.data.result.length > 0) {
        // Append new influencers to existing data
        const combinedData = {
          ...data,
          data: {
            ...data.data,
            result: [...(influencerData?.data?.result || []), ...data.data.result]
          }
        }
        setInfluencerData(combinedData)
        setCurrentPage(nextPage)
      }
    } catch (err) {
      console.error('Error loading more data:', err)
    } finally {
      setInfluencerLoading(false)
    }
  }

  // Use API data if available, otherwise use default data
  const displayData = analyticsData?.data ? {
    totalPosts: analyticsData.data.total_posts || '0',
    totalViews: analyticsData.data.total_views || '0',
    totalLikes: analyticsData.data.total_likes || '0',
    totalComments: analyticsData.data.total_comments || '0',
    totalReshare: analyticsData.data.total_reshare || '0',
    avgER: analyticsData.data.avg_er || 0,
    avgReach: analyticsData.data.avg_reach || '0',
    influencerCount: analyticsData.data.influencer_count || 0,
    platforms: defaultAnalyticsData.platforms // Keep platforms static for now
  } : defaultAnalyticsData

  return (
    <>
      <PageTitle title="Social Analytics" subName="Track your social media performance" />
      
      <div className="container-fluid">
        {/* Loading State */}
        {loading && (
          <div className="row mb-4">
            <div className="col-12 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading analytics data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="row mb-4">
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

        {/* Overview Cards */}
        {!loading && (
          <div className="row mb-4">
               <div className="col-xl-3 col-md-6">
              <div className="card bg-dark text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-0">{formatNumber(displayData.influencerCount)}</h4>
                      <p className="mb-0">Influencers</p>
                    </div>
                    <i className="fas fa-user-friends fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justiftotal_viewsy-content-between align-items-center">
                    <div>
                      <h4 className="mb-0">{displayData.totalPosts}</h4>
                      <p className="mb-0">Total Posts</p>
                    </div>
                    <i className="fas fa-file-alt fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-0">{displayData.totalViews}</h4>
                      <p className="mb-0">Total Views</p>
                    </div>
                    <i className="fas fa-eye fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-0">{displayData.totalLikes}</h4>
                      <p className="mb-0">Total Likes</p>
                    </div>
                    <i className="fas fa-heart fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
           
          </div>
        )}

        {/* Additional Metrics Row */}
        {!loading && analyticsData?.data && (
          <div className="row mb-4">
            <div className="col-xl-3 col-md-6">
              <div className="card bg-secondary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-0">{displayData.totalReshare}</h4>
                      <p className="mb-0">Total Reshares</p>
                    </div>
                    <i className="fas fa-share fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
             <div className="col-xl-3 col-md-6">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-0">{displayData.totalComments}</h4>
                      <p className="mb-0">Total Comments</p>
                    </div>
                    <i className="fas fa-comments fa-2x opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
         
          </div>
        )}

        {/* Influencer Analytics */}
        <ComponentContainerCard
          id="influencer-analytics"
          title="Influencer Performance"
          description="Detailed analytics by influencers in the campaign"
        >


          {/* Loading State for Influencers */}
          {influencerLoading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading influencers...</span>
              </div>
              <p className="mt-2">Loading influencer data...</p>
            </div>
          )}

          {/* Error State for Influencers */}
          {influencerError && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {influencerError}
            </div>
          )}

          {/* Influencer Table */}
          {!influencerLoading && influencerData?.data?.result && (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Influencer</th>
                    <th>Views </th>
                    <th>Likes</th>
                    <th>Comments</th>
                    <th>Content ER</th>
                    <th>Reach</th>
                    <th>Shares</th>
                    <th>Post Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {influencerData.data.result.map((influencer: InfluencerData, index: number) => (
                    <tr key={influencer.influencer_id}>
                      <td className="fw-semibold">
                        {index + 1}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="position-relative me-3">
                            <img 
                              src={influencer.profile_pic_url} 
                              alt={influencer.fullname}
                              className="rounded-circle"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40/6c757d/ffffff?text=' + influencer.fullname.charAt(0);
                              }}
                            />
                            <i 
                              className="fab fa-instagram text-primary position-absolute"
                              style={{ 
                                fontSize: '12px',
                                bottom: '-2px',
                                right: '-2px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                padding: '2px',
                                border: '1px solid #dee2e6'
                              }}
                            ></i>
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">{influencer.fullname}</div>
                            <small className="text-muted">{influencer.handle}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="fw-semibold">{influencer.total_views}</span>
                      </td>
                      <td>
                        {influencer.total_likes === "0" ? (
                          <span className="text-warning">Hidden</span>
                        ) : (
                          <span className="fw-semibold">{influencer.total_likes}</span>
                        )}
                      </td>
                      <td>
                        <span className="fw-semibold">{influencer.total_comments}</span>
                      </td>
                      <td>
                        <span className="fw-semibold">{parseFloat(influencer.er).toFixed(2)}</span>
                      </td>
                      <td>
                        <span className="fw-semibold">{typeof influencer.reach === 'number' ? formatNumber(influencer.reach) : influencer.reach}</span>
                      </td>
                      <td>
                        <span className="fw-semibold">{influencer.total_reshare_count}</span>
                      </td>
                      <td>
                        <img 
                          src={influencer.posts[0]?.display_url || 'https://via.placeholder.com/30x30/6c757d/ffffff'} 
                          alt="Post"
                          className="rounded"
                          style={{ width: '30px', height: '30px', objectFit: 'cover', cursor: 'pointer' }}
                          title="View Post Details"
                          onClick={() => {
                            setSelectedInfluencer(influencer)
                            setShowModal(true)
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Load More Button */}
          {!influencerLoading && totalPages > 0 && currentPage < totalPages && (
            <div className="text-center mt-4">
              <button 
                className="btn btn-outline-primary"
                onClick={loadMoreData}
                disabled={influencerLoading}
              >
                <i className="fas fa-chevron-down me-2"></i>
                Load {itemsPerPage} More
              </button>
            </div>
          )}

          {/* Page Navigation */}
          {!influencerLoading && totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  if (currentPage > 1) {
                    // Reset to first page
                    const loadFirstPage = async () => {
                      try {
                        setInfluencerLoading(true)
                        const data = await CampaignAnalyticsService.getInfluencerList('1069', 1, itemsPerPage)
                        if (data?.data) {
                          setInfluencerData(data)
                          setCurrentPage(1)
                        }
                      } catch (err) {
                        console.error('Error loading first page:', err)
                      } finally {
                        setInfluencerLoading(false)
                      }
                    }
                    loadFirstPage()
                  }
                }}
                disabled={currentPage === 1 || influencerLoading}
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
                disabled={currentPage >= totalPages || influencerLoading}
              >
                Next
                <i className="fas fa-chevron-right ms-1"></i>
              </button>
            </div>
          )}

          {/* Pagination Info */}
          {!influencerLoading && totalCount > 0 && (
            <div className="text-center mt-3">
              <small className="text-muted">
                Showing {influencerData?.data?.result?.length || 0} of {totalCount} influencers
              </small>
            </div>
          )}
        </ComponentContainerCard>
      </div>

      {/* Post Details Modal */}
      {showModal && selectedInfluencer && (
        <div 
          className="modal fade show d-block" 
          tabIndex={-1} 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body pt-0">
                <div className="row">
                  <div className="col-md-6">
                    <img 
                      src={selectedInfluencer.posts[0]?.display_url || 'https://via.placeholder.com/400x400/6c757d/ffffff'} 
                      alt="Post"
                      className="img-fluid rounded"
                      style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                    />

                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <div className="position-relative me-3">
                        <img 
                          src={selectedInfluencer.profile_pic_url} 
                          alt={selectedInfluencer.fullname}
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                          <i 
                              className="fab fa-instagram text-primary position-absolute"
                              style={{ 
                                fontSize: '12px',
                                bottom: '-2px',
                                right: '-2px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                padding: '2px',
                                border: '1px solid #dee2e6'
                              }}
                            ></i>
                      </div>
                      <div>
                        <div className="fw-semibold">{selectedInfluencer.fullname}</div>
                        <small className="text-muted">{selectedInfluencer.handle}</small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">{selectedInfluencer.posts[0]?.post_date || 'Oct 10, 2025'}</small>
                      <div className="d-flex align-items-center justify-content-end">
                        {/* <button className="btn btn-link p-0 me-2" title="Refresh">
                          <i className="fas fa-sync text-primary"></i>
                        </button>
                        <button className="btn btn-link p-0" title="Delete">
                          <i className="fas fa-trash text-danger"></i>
                        </button> */}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-muted small" style={{ fontSize: '12px', lineHeight: '1.4', maxHeight: '120px', overflowY: 'auto' }}>
                        {selectedInfluencer.posts[0]?.caption || '#Collaboration\n\n📢 Introducing the all-new\n*#GalaxyM17 5G* - the Monster In Motion\nat a *Special Launch Price* ~₹16499~ *₹12499* 🌟\n\n🤳🏻 50MP No Shake Cam for blur-free videos\n\n💪🏻 Durable Corning Gorilla Glass Victus and IP54 protection 🌟 7.5mm slim design\n\n✨ Circle to Search | Google Gemini\n\n6️⃣ Gen OS and Security updates\n\n📲 sAMOLED Display | 1100 nits\n\n*Sale starts: 13th October*\n▶️Head over to Amazon to know more. @samsungindia\n#GalaxyM17 5G #MonsterInMotion #LoveForMonster #Samsung #trendup\n#ExploreGalaxy #trending #viral #viralreels'}
                      </p>
                    </div>

                    <div className="row g-2 mb-4">
                      <div className="col-4">
                        <div className="card border-0 text-center py-3" style={{ background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)', borderRadius: '12px' }}>
                          <div className="d-flex flex-column align-items-center">
                            <div className="rounded-circle d-flex align-items-center justify-content-center mb-2" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                              <i className="fas fa-heart text-white"></i>
                            </div>
                            <span className="fw-bold text-white small">{selectedInfluencer.total_likes === "0" ? "Hidden" : selectedInfluencer.total_likes}</span>
                            <small className="text-white-50">Likes</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="card border-0 text-center py-3" style={{ background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)', borderRadius: '12px' }}>
                          <div className="d-flex flex-column align-items-center">
                            <div className="rounded-circle d-flex align-items-center justify-content-center mb-2" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                              <i className="fas fa-comment text-white"></i>
                            </div>
                            <span className="fw-bold text-white small">{selectedInfluencer.total_comments}</span>
                            <small className="text-white-50">Comments</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="card border-0 text-center py-3" style={{ background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)', borderRadius: '12px' }}>
                          <div className="d-flex flex-column align-items-center">
                            <div className="rounded-circle d-flex align-items-center justify-content-center mb-2" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                              <i className="fas fa-share text-white"></i>
                            </div>
                            <span className="fw-bold text-white small">{selectedInfluencer.total_views}</span>
                            <small className="text-white-50">Views</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <span className="badge bg-dark me-2">{(parseFloat(selectedInfluencer.er)).toFixed(2)}%</span>
                        <small className="text-muted">ER</small>
                      </div>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          if (selectedInfluencer.posts[0]?.post_link) {
                            window.open(selectedInfluencer.posts[0].post_link, '_blank')
                          }
                        }}
                      >
                        View More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SocialAnalyticsPage