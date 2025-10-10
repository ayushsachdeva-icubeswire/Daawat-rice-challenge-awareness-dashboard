import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState } from 'react'

const HashtagPerformancePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

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

  const filteredHashtags = hashtagData.filter(hashtag => {
    const matchesSearch = hashtag.hashtag.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === 'all' || hashtag.platform.toLowerCase() === selectedPlatform
    return matchesSearch && matchesPlatform
  })

  const totalReach = hashtagData.reduce((sum, hashtag) => sum + hashtag.reach, 0)
  const totalEngagement = hashtagData.reduce((sum, hashtag) => sum + hashtag.engagement, 0)
  const totalPosts = hashtagData.reduce((sum, hashtag) => sum + hashtag.posts, 0)
  const trendingCount = hashtagData.filter(hashtag => hashtag.trending).length

  return (
    <>
      <PageTitle title="Hashtag Performance" subName="Track hashtag effectiveness across platforms" />
      
      <div className="container-fluid">
        {/* Overview Cards */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{totalReach.toLocaleString()}</h4>
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
                    <h4 className="mb-0">{totalEngagement.toLocaleString()}</h4>
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
                    <h4 className="mb-0">{totalPosts.toLocaleString()}</h4>
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

        {/* Hashtag Performance Table */}
        <ComponentContainerCard
          id="hashtag-performance"
          title="Hashtag Analytics"
          description="Detailed performance metrics for your hashtags"
        >
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search hashtags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select 
                className="form-select"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="all">All Platforms</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
            <div className="col-md-4 text-end">
              <button className="btn btn-primary me-2">
                <i className="fas fa-plus me-2"></i>Track New Hashtag
              </button>
              <button className="btn btn-outline-primary">
                <i className="fas fa-download me-2"></i>Export
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Hashtag</th>
                  <th>Platform</th>
                  <th>Posts</th>
                  <th>Reach</th>
                  <th>Engagement</th>
                  <th>Impressions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHashtags.map((hashtag, index) => (
                  <tr key={index}>
                    <td>
                      <span className="fw-semibold text-primary">{hashtag.hashtag}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className={`fab fa-${hashtag.platform.toLowerCase()} me-2`}></i>
                        {hashtag.platform}
                      </div>
                    </td>
                    <td>{hashtag.posts.toLocaleString()}</td>
                    <td>{hashtag.reach.toLocaleString()}</td>
                    <td>
                      <span className="badge bg-success">
                        {hashtag.engagement.toLocaleString()}
                      </span>
                    </td>
                    <td>{hashtag.impressions.toLocaleString()}</td>
                    <td>
                      {hashtag.trending ? (
                        <span className="badge bg-danger">
                          <i className="fas fa-fire me-1"></i>Trending
                        </span>
                      ) : (
                        <span className="badge bg-secondary">Normal</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-chart-line"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          <i className="fas fa-share"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredHashtags.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No hashtags found matching your criteria.</p>
            </div>
          )}
        </ComponentContainerCard>
      </div>
    </>
  )
}

export default HashtagPerformancePage