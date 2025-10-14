import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState, useEffect } from 'react'

const OverallPerformancePage = () => {
  const [likes] = useState(15420)
  const [shares] = useState(8750)
  const [comments, setComments] = useState(12350)
  const [newCommentsNumber, setNewCommentsNumber] = useState('')
  const [totalInteractions, setTotalInteractions] = useState(0)

  // Calculate total interactions whenever individual metrics change
  useEffect(() => {
    setTotalInteractions(likes + shares + comments)
  }, [likes, shares, comments])

  // Mock engagement data for different time periods
  const engagementData = {
    today: { likes: 1250, shares: 680, comments: 890 },
    thisWeek: { likes: 8700, shares: 4200, comments: 5600 },
    thisMonth: { likes: 15420, shares: 8750, comments: 12350 },
    
    dailyData: [
      { day: 'Mon', likes: 2100, shares: 1200, comments: 1800, total: 5100 },
      { day: 'Tue', likes: 2400, shares: 1400, comments: 2100, total: 5900 },
      { day: 'Wed', likes: 1950, shares: 1100, comments: 1650, total: 4700 },
      { day: 'Thu', likes: 2800, shares: 1600, comments: 2400, total: 6800 },
      { day: 'Fri', likes: 3200, shares: 1800, comments: 2700, total: 7700 },
      { day: 'Sat', likes: 2850, shares: 1550, comments: 2200, total: 6600 },
      { day: 'Sun', likes: 2120, shares: 1100, comments: 1500, total: 4720 },
    ],
    
    topPosts: [
      { id: 1, title: 'Rice Challenge Week 1 Results', likes: 3200, shares: 1800, comments: 2400 },
      { id: 2, title: 'Community Nutrition Tips', likes: 2850, shares: 1600, comments: 2100 },
      { id: 3, title: 'Success Stories from Users', likes: 2650, shares: 1400, comments: 1950 },
      { id: 4, title: 'Weekly Meal Planning Guide', likes: 2400, shares: 1200, comments: 1800 },
      { id: 5, title: 'Health Benefits Awareness', likes: 2200, shares: 1100, comments: 1650 },
    ]
  }

  const handleAddComment = () => {
    const numberToAdd = parseInt(newCommentsNumber)
    if (newCommentsNumber.trim() && !isNaN(numberToAdd) && numberToAdd > 0) {
      setComments(prev => prev + numberToAdd)
      setNewCommentsNumber('')
    }
  }

  return (
    <>
      <PageTitle title="Social Media Performance" subName="Track your social media engagement and interactions" />
      
      <div className="container-fluid">
        {/* Main Interaction Metrics Cards */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{likes.toLocaleString()}</h4>
                    <p className="mb-0">Total Likes</p>
                  </div>
                  <i className="fas fa-heart fa-2x opacity-75"></i>
                </div>
                <div className="mt-2">
                  <span className="text-success">
                    <i className="fas fa-arrow-up me-1"></i>+15.2%
                  </span>
                  <small className="text-white-50"> vs last month</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{shares.toLocaleString()}</h4>
                    <p className="mb-0">Total Shares</p>
                  </div>
                  <i className="fas fa-share-alt fa-2x opacity-75"></i>
                </div>
                <div className="mt-2">
                  <span className="text-white">
                    <i className="fas fa-arrow-up me-1"></i>+8.7%
                  </span>
                  <small className="text-white-50"> vs last month</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{comments.toLocaleString()}</h4>
                    <p className="mb-0">Total Comments</p>
                  </div>
                  <i className="fas fa-comments fa-2x opacity-75"></i>
                </div>
                <div className="mt-2">
                  <span className="text-white">
                    <i className="fas fa-arrow-up me-1"></i>+12.1%
                  </span>
                  <small className="text-white-50"> vs last month</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{totalInteractions.toLocaleString()}</h4>
                    <p className="mb-0">Total Interactions</p>
                  </div>
                  <i className="fas fa-chart-line fa-2x opacity-75"></i>
                </div>
                <div className="mt-2">
                  <span className="text-white">
                    <i className="fas fa-arrow-up me-1"></i>+11.3%
                  </span>
                  <small className="text-white-50"> vs last month</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Input Section */}
        <div className="row mb-4">
          <div className="col-12">
            <ComponentContainerCard
              id="comment-input"
              title="Add New Comment"
              description="Engage with your community by adding comments"
            >
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="newComment" className="form-label">Add Comments Count</label>
                    <input
                      id="newComment"
                      type="number"
                      className="form-control"
                      placeholder="Enter number of comments to add (e.g., 5, 10, 25)"
                      value={newCommentsNumber}
                      onChange={(e) => setNewCommentsNumber(e.target.value)}
                      min="1"
                      step="1"
                    />
                    <small className="text-muted">Enter a positive number to add to your total comments count</small>
                  </div>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <div className="mb-3 w-100">
                    <button 
                      className="btn btn-primary w-100"
                      onClick={handleAddComment}
                      disabled={!newCommentsNumber.trim() || isNaN(parseInt(newCommentsNumber)) || parseInt(newCommentsNumber) <= 0}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Add Comments
                    </button>
                  </div>
                </div>
              </div>
            </ComponentContainerCard>
          </div>
        </div>

        {/* Engagement Analytics */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="text-primary">{engagementData.today.likes + engagementData.today.shares + engagementData.today.comments}</h5>
                <p className="mb-0 text-muted">Today's Interactions</p>
                <small className="text-success">
                  <i className="fas fa-arrow-up me-1"></i>+5.2% from yesterday
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="text-success">{engagementData.thisWeek.likes + engagementData.thisWeek.shares + engagementData.thisWeek.comments}</h5>
                <p className="mb-0 text-muted">This Week's Interactions</p>
                <small className="text-success">
                  <i className="fas fa-arrow-up me-1"></i>+8.7% from last week
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="text-warning">{Math.round((totalInteractions / 30))}</h5>
                <p className="mb-0 text-muted">Avg Daily Interactions</p>
                <small className="text-info">Based on monthly data</small>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Daily Engagement Trends */}
          <div className="col-lg-8">
            <ComponentContainerCard
              id="daily-engagement"
              title="Daily Engagement Breakdown"
              description="Track your daily social media performance"
            >
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Day</th>
                      <th>Likes</th>
                      <th>Shares</th>
                      <th>Comments</th>
                      <th>Total Interactions</th>
                      <th>Engagement Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagementData.dailyData.map((day, index) => (
                      <tr key={index}>
                        <td className="fw-semibold">{day.day}</td>
                        <td>
                          <span className="text-primary">
                            <i className="fas fa-heart me-1"></i>
                            {day.likes.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span className="text-success">
                            <i className="fas fa-share-alt me-1"></i>
                            {day.shares.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span className="text-warning">
                            <i className="fas fa-comments me-1"></i>
                            {day.comments.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info">{day.total.toLocaleString()}</span>
                        </td>
                        <td>
                          <span className="text-success">
                            <i className="fas fa-arrow-up me-1"></i>
                            {((day.total / 10000) * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ComponentContainerCard>
          </div>

          {/* Top Performing Posts */}
          <div className="col-lg-4">
            <ComponentContainerCard
              id="top-posts"
              title="Top Performing Posts"
              description="Most engaging content this month"
            >
              <div className="list-group list-group-flush">
                {engagementData.topPosts.map((post, index) => (
                  <div key={post.id} className="list-group-item border-0 px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1 text-primary">{post.title}</h6>
                        <div className="row text-sm">
                          <div className="col-4">
                            <small className="text-muted">
                              <i className="fas fa-heart text-primary me-1"></i>
                              {post.likes}
                            </small>
                          </div>
                          <div className="col-4">
                            <small className="text-muted">
                              <i className="fas fa-share-alt text-success me-1"></i>
                              {post.shares}
                            </small>
                          </div>
                          <div className="col-4">
                            <small className="text-muted">
                              <i className="fas fa-comments text-warning me-1"></i>
                              {post.comments}
                            </small>
                          </div>
                        </div>
                        <small className="text-muted">
                          Total: {(post.likes + post.shares + post.comments).toLocaleString()} interactions
                        </small>
                      </div>
                      <span className={`badge ${index < 2 ? 'bg-success' : index < 4 ? 'bg-warning' : 'bg-secondary'}`}>
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ComponentContainerCard>
          </div>
        </div>
      </div>
    </>
  )
}

export default OverallPerformancePage