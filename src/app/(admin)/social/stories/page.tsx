import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState } from 'react'

const StoriesPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Mock stories data
  const storiesData = [
    {
      id: 1,
      title: 'Today\'s Recipe Special',
      platform: 'Instagram',
      views: 15420,
      likes: 892,
      shares: 45,
      comments: 23,
      posted: '2024-10-10T08:00:00Z',
      status: 'Active',
      duration: 24,
      type: 'Photo'
    },
    {
      id: 2,
      title: 'Cooking Tips & Tricks',
      platform: 'Facebook',
      views: 8950,
      likes: 543,
      shares: 67,
      comments: 89,
      posted: '2024-10-10T10:30:00Z',
      status: 'Active',
      duration: 24,
      type: 'Video'
    },
    {
      id: 3,
      title: 'Behind the Scenes',
      platform: 'Instagram',
      views: 12300,
      likes: 721,
      shares: 34,
      comments: 56,
      posted: '2024-10-09T15:45:00Z',
      status: 'Expired',
      duration: 24,
      type: 'Video'
    },
    {
      id: 4,
      title: 'Quick Snack Ideas',
      platform: 'Facebook',
      views: 6780,
      likes: 412,
      shares: 28,
      comments: 34,
      posted: '2024-10-09T12:20:00Z',
      status: 'Expired',
      duration: 24,
      type: 'Photo'
    },
  ]

  const filteredStories = storiesData.filter(story => {
    const matchesPlatform = selectedPlatform === 'all' || story.platform.toLowerCase() === selectedPlatform
    const matchesStatus = selectedStatus === 'all' || story.status.toLowerCase() === selectedStatus
    return matchesPlatform && matchesStatus
  })

  const totalViews = storiesData.reduce((sum, story) => sum + story.views, 0)
  const totalLikes = storiesData.reduce((sum, story) => sum + story.likes, 0)
  const totalShares = storiesData.reduce((sum, story) => sum + story.shares, 0)
  const activeStories = storiesData.filter(story => story.status === 'Active').length

  const getTimeRemaining = (postedTime: string, duration: number) => {
    const posted = new Date(postedTime)
    const expires = new Date(posted.getTime() + duration * 60 * 60 * 1000)
    const now = new Date()
    const remaining = expires.getTime() - now.getTime()
    
    if (remaining <= 0) return 'Expired'
    
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m`
  }

  return (
    <>
      <PageTitle title="Stories" subName="Manage and track your social media stories" />
      
      <div className="container-fluid">
        {/* Overview Cards */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{totalViews.toLocaleString()}</h4>
                    <p className="mb-0">Total Views</p>
                  </div>
                  <i className="fas fa-eye fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{totalLikes.toLocaleString()}</h4>
                    <p className="mb-0">Total Likes</p>
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
                    <h4 className="mb-0">{totalShares.toLocaleString()}</h4>
                    <p className="mb-0">Total Shares</p>
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
                    <h4 className="mb-0">{activeStories}</h4>
                    <p className="mb-0">Active Stories</p>
                  </div>
                  <i className="fas fa-clock fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Management */}
        <ComponentContainerCard
          id="stories-management"
          title="Stories Management"
          description="Track and manage your social media stories performance"
        >
          <div className="row mb-3">
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
              </select>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="col-md-4 text-end">
              <button className="btn btn-primary me-2">
                <i className="fas fa-plus me-2"></i>Create Story
              </button>
              <button className="btn btn-outline-primary">
                <i className="fas fa-sync me-2"></i>Refresh
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Story</th>
                  <th>Platform</th>
                  <th>Type</th>
                  <th>Views</th>
                  <th>Engagement</th>
                  <th>Posted</th>
                  <th>Time Remaining</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStories.map((story) => (
                  <tr key={story.id}>
                    <td className="fw-semibold">{story.title}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className={`fab fa-${story.platform.toLowerCase()} me-2 text-primary`}></i>
                        {story.platform}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${story.type === 'Video' ? 'bg-info' : 'bg-secondary'}`}>
                        <i className={`fas fa-${story.type === 'Video' ? 'video' : 'image'} me-1`}></i>
                        {story.type}
                      </span>
                    </td>
                    <td>{story.views.toLocaleString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <span className="badge bg-success">{story.likes}</span>
                        <span className="badge bg-info">{story.shares}</span>
                        <span className="badge bg-warning">{story.comments}</span>
                      </div>
                    </td>
                    <td>{new Date(story.posted).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${story.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                        {getTimeRemaining(story.posted, story.duration)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${story.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                        {story.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          <i className="fas fa-chart-line"></i>
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

          {filteredStories.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No stories found matching your criteria.</p>
            </div>
          )}
        </ComponentContainerCard>
      </div>
    </>
  )
}

export default StoriesPage