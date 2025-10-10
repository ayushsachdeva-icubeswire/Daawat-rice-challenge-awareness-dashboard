import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState } from 'react'

const SocialAnalyticsPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  // Mock analytics data
  const analyticsData = {
    totalFollowers: 125340,
    totalEngagement: 89456,
    totalReach: 456780,
    totalImpressions: 987654,
    platforms: [
      { name: 'Instagram', followers: 45000, engagement: 8.5, posts: 124 },
      { name: 'Facebook', followers: 32000, engagement: 6.2, posts: 89 },
      { name: 'Twitter', followers: 28340, engagement: 4.8, posts: 256 },
      { name: 'LinkedIn', followers: 20000, engagement: 7.1, posts: 45 },
    ]
  }

  return (
    <>
      <PageTitle title="Social Analytics" subName="Track your social media performance" />
      
      <div className="container-fluid">
        {/* Overview Cards */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{analyticsData.totalFollowers.toLocaleString()}</h4>
                    <p className="mb-0">Total Followers</p>
                  </div>
                  <i className="fas fa-users fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{analyticsData.totalEngagement.toLocaleString()}</h4>
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
                    <h4 className="mb-0">{analyticsData.totalReach.toLocaleString()}</h4>
                    <p className="mb-0">Total Reach</p>
                  </div>
                  <i className="fas fa-eye fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{analyticsData.totalImpressions.toLocaleString()}</h4>
                    <p className="mb-0">Total Impressions</p>
                  </div>
                  <i className="fas fa-chart-bar fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Analytics */}
        <ComponentContainerCard
          id="platform-analytics"
          title="Platform Performance"
          description="Detailed analytics by social media platform"
        >
          <div className="row mb-3">
            <div className="col-md-6">
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
            <div className="col-md-6 text-end">
              <button className="btn btn-primary me-2">
                <i className="fas fa-download me-2"></i>Export Report
              </button>
              <button className="btn btn-outline-primary">
                <i className="fas fa-sync me-2"></i>Refresh Data
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Platform</th>
                  <th>Followers</th>
                  <th>Engagement Rate</th>
                  <th>Posts</th>
                  <th>Growth</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.platforms.map((platform, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className={`fab fa-${platform.name.toLowerCase()} me-2 text-primary`}></i>
                        <span className="fw-semibold">{platform.name}</span>
                      </div>
                    </td>
                    <td>{platform.followers.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        platform.engagement >= 7 ? 'bg-success' :
                        platform.engagement >= 5 ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {platform.engagement}%
                      </span>
                    </td>
                    <td>{platform.posts}</td>
                    <td>
                      <span className="text-success">
                        <i className="fas fa-arrow-up me-1"></i>+5.2%
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-chart-line"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ComponentContainerCard>
      </div>
    </>
  )
}

export default SocialAnalyticsPage