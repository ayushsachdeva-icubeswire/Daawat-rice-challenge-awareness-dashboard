import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState, useEffect } from 'react'
import { CampaignAnalyticsService, CampaignAnalyticsData, InfluencerListResponse, InfluencerData } from '@/services/campaignAnalyticsService'

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
        const data = await CampaignAnalyticsService.getCampaignAnalysis('837')
        console.log('API Response:', data) // Debug log to see the actual structure
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

  // Fetch influencer data
  useEffect(() => {
    const fetchInfluencerData = async () => {
      try {
        setInfluencerLoading(true)
        setInfluencerError(null)
        const data = await CampaignAnalyticsService.getInfluencerList('837', currentPage, itemsPerPage)
        console.log('Influencer API Response:', data) // Debug log
        setInfluencerData(data)
      } catch (err) {
        setInfluencerError(err instanceof Error ? err.message : 'Failed to fetch influencer data')
        console.error('Error fetching influencers:', err)
      } finally {
        setInfluencerLoading(false)
      }
    }

    fetchInfluencerData()
  }, [currentPage, itemsPerPage])

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
              <div className="card bg-dark text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-0">{displayData.influencerCount.toLocaleString()}</h4>
                      <p className="mb-0">Influencers</p>
                    </div>
                    <i className="fas fa-user-friends fa-2x opacity-75"></i>
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
                        {((currentPage - 1) * itemsPerPage) + index + 1}
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
                        <span className="fw-semibold">{influencer.reach}</span>
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
          {!influencerLoading && influencerData?.data && currentPage < influencerData.data.totalPages && (
            <div className="text-center mt-4">
              <button 
                className="btn btn-outline-primary"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={influencerLoading}
              >
                <i className="fas fa-chevron-down me-2"></i>
                Load 10 More
              </button>
            </div>
          )}

          {/* Pagination Info */}
          {!influencerLoading && influencerData?.data && (
            <div className="text-center mt-3">
              <small className="text-muted">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, influencerData.data.totalCount)} of{' '}
                {influencerData.data.totalCount} influencers
              </small>
            </div>
          )}
        </ComponentContainerCard>
      </div>

      {/* Post Details Modal */}
      {showModal && selectedInfluencer && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
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
                        <img 
                          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzIpIi8+CjxwYXRoIGQ9Ik0yMC4wMDUgMTIuNzAzQzE3LjI4MiAxMi43MDMgMTQuODk4IDEyLjcwMyAxNC44OTcgMTIuNzAzQzEzLjA2MSAxMi43MDMgMTEuNTY2IDE0LjE5OCAxMS1NjYgMTYuMDM0VjI0LjAzNEMxMS41NjYgMjUuODcgMTMuMDYxIDI3LjM2NSAxNC44OTcgMjcuMzY1SDI1LjExNEMyNi45NSAyNy4zNjUgMjguNDQ1IDI1Ljg3IDI4LjQ0NSAyNC4wMzRWMTYuMDM0QzI4LjQ0NSAxNC4xOTggMjYuOTUgMTIuNzAzIDI1LjExNCAxMi43MDNIMjAuMDA1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTIwLjAwNSAxNi4wMzVDMTcuODY4IDE2LjAzNSAxNi4xMzYgMTcuNzY3IDE2LjEzNiAxOS45MDRDMTYuMTM2IDIyLjA0MSAxNy44NjggMjMuNzczIDIwLjAwNSAyMy43NzNDMjIuMTQyIDIzLjc3MyAyMy44NzQgMjIuMDQxIDIzLjg3NCAxOS45MDRDMjMuODc0IDE3Ljc2NyAyMi4xNDIgMTYuMDM1IDIwLjAwNSAxNi4wMzVaTTIwLjAwNSAyMi4yM0MxOC43MjEgMjIuMjMgMTcuNjc4IDIxLjE4OCAxNy42NzggMTkuOTA0QzE3LjY3OCAxOC42MiAxOC43MjEgMTcuNTc4IDIwLjAwNSAxNy41NzhDMjEuMjg5IDE3LjU3OCAyMi4zMzEgMTguNjIgMjIuMzMxIDE5LjkwNEMyMi4zMzEgMjEuMTg4IDIxLjI4OSAyMi4yMyAyMC4wMDUgMjIuMjNaIiBmaWxsPSIjRTM0MDVGIi8+CjxwYXRoIGQ9Ik0yNC40NzYgMTYuOTI3QzI0Ljc5OSAxNi45MjcgMjUuMDYxIDE2LjY2NSAyNS4wNjEgMTYuMzQyQzI1LjA2MSAxNi4wMTkgMjQuNzk5IDE1Ljc1NyAyNC40NzYgMTUuNzU3QzI0LjE1MyAxNS43NTcgMjMuODkxIDE2LjAxOSAyMy44OTEgMTYuMzQyQzIzLjg5MSAxNi42NjUgMjQuMTUzIDE2LjkyNyAyNC40NzYgMTYuOTI3WiIgZmlsbD0iI0UzNDA1RiIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzFfMiIgeDE9IjgiIHkxPSI4IiB4Mj0iMzIiIHkyPSIzMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkY0NTY4Ii8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkY0NTY4Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGNDQ0NCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo="
                          alt="Instagram"
                          className="position-absolute bottom-0 end-0 rounded-circle"
                          style={{ 
                            border: '2px solid white',
                            width: '18px',
                            height: '18px',
                            objectFit: 'cover'
                          }}
                        />
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
                        <span className="badge bg-dark me-2">{(parseFloat(selectedInfluencer.er) * 100).toFixed(2)}%</span>
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