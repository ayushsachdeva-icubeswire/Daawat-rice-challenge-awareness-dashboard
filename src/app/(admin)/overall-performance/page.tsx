import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState } from 'react'

const OverallPerformancePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30')

  // Mock overall performance data
  const performanceData = {
    totalUsers: 125340,
    totalRevenue: 45780,
    conversionRate: 3.45,
    avgSessionDuration: 245, // in seconds
    bounceRate: 32.5,
    pageViews: 456789,
    uniqueVisitors: 89456,
    returningUsers: 67.8,
    
    weeklyData: [
      { week: 'Week 1', users: 12500, revenue: 4500, conversions: 145 },
      { week: 'Week 2', users: 13200, revenue: 4890, conversions: 156 },
      { week: 'Week 3', users: 11800, revenue: 4320, conversions: 134 },
      { week: 'Week 4', users: 14600, revenue: 5280, conversions: 178 },
    ],
    
    topPages: [
      { page: '/dashboard', views: 45678, bounce: 25.4, duration: 320 },
      { page: '/challenges', views: 38942, bounce: 28.7, duration: 285 },
      { page: '/diet-plan', views: 32154, bounce: 31.2, duration: 245 },
      { page: '/social/analytics', views: 28976, bounce: 29.8, duration: 298 },
      { page: '/interactions', views: 25643, bounce: 33.1, duration: 225 },
    ]
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  return (
    <>
      <PageTitle title="Overall Performance" subName="Comprehensive performance analytics dashboard" />
      
      <div className="container-fluid">
        {/* Top Metrics Cards */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">{performanceData.totalUsers.toLocaleString()}</h4>
                    <p className="mb-0">Total Users</p>
                  </div>
                  <i className="fas fa-users fa-2x opacity-75"></i>
                </div>
                <div className="mt-2">
                  <span className="text-success">
                    <i className="fas fa-arrow-up me-1"></i>+12.5%
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
                    <h4 className="mb-0">${performanceData.totalRevenue.toLocaleString()}</h4>
                    <p className="mb-0">Total Revenue</p>
                  </div>
                  <i className="fas fa-dollar-sign fa-2x opacity-75"></i>
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
                    <h4 className="mb-0">{performanceData.conversionRate}%</h4>
                    <p className="mb-0">Conversion Rate</p>
                  </div>
                  <i className="fas fa-chart-line fa-2x opacity-75"></i>
                </div>
                <div className="mt-2">
                  <span className="text-white">
                    <i className="fas fa-arrow-up me-1"></i>+2.1%
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
                    <h4 className="mb-0">{formatDuration(performanceData.avgSessionDuration)}</h4>
                    <p className="mb-0">Avg Session</p>
                  </div>
                  <i className="fas fa-clock fa-2x opacity-75"></i>
                </div>
                <div className="mt-2">
                  <span className="text-white">
                    <i className="fas fa-arrow-up me-1"></i>+5.3%
                  </span>
                  <small className="text-white-50"> vs last month</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics Row */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="text-primary">{performanceData.pageViews.toLocaleString()}</h5>
                <p className="mb-0 text-muted">Page Views</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="text-success">{performanceData.uniqueVisitors.toLocaleString()}</h5>
                <p className="mb-0 text-muted">Unique Visitors</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="text-warning">{performanceData.returningUsers}%</h5>
                <p className="mb-0 text-muted">Returning Users</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="text-danger">{performanceData.bounceRate}%</h5>
                <p className="mb-0 text-muted">Bounce Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Weekly Performance */}
          <div className="col-lg-8">
            <ComponentContainerCard
              id="weekly-performance"
              title="Weekly Performance Trends"
              description="Track your performance metrics over time"
            >
              <div className="row mb-3">
                <div className="col-md-6">
                  <select 
                    className="form-select"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                  </select>
                </div>
                <div className="col-md-6 text-end">
                  <button className="btn btn-outline-primary me-2">
                    <i className="fas fa-download me-2"></i>Export
                  </button>
                  <button className="btn btn-primary">
                    <i className="fas fa-sync me-2"></i>Refresh
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Period</th>
                      <th>Users</th>
                      <th>Revenue</th>
                      <th>Conversions</th>
                      <th>Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.weeklyData.map((week, index) => (
                      <tr key={index}>
                        <td className="fw-semibold">{week.week}</td>
                        <td>{week.users.toLocaleString()}</td>
                        <td>${week.revenue.toLocaleString()}</td>
                        <td>
                          <span className="badge bg-success">{week.conversions}</span>
                        </td>
                        <td>
                          <span className="text-success">
                            <i className="fas fa-arrow-up me-1"></i>+5.2%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ComponentContainerCard>
          </div>

          {/* Top Pages */}
          <div className="col-lg-4">
            <ComponentContainerCard
              id="top-pages"
              title="Top Performing Pages"
              description="Most visited pages and their metrics"
            >
              <div className="list-group list-group-flush">
                {performanceData.topPages.map((page, index) => (
                  <div key={index} className="list-group-item border-0 px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1 text-primary">{page.page}</h6>
                        <div className="row">
                          <div className="col-6">
                            <small className="text-muted">Views: </small>
                            <span className="fw-semibold">{page.views.toLocaleString()}</span>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Bounce: </small>
                            <span className="fw-semibold">{page.bounce}%</span>
                          </div>
                        </div>
                        <small className="text-muted">
                          Avg Duration: {formatDuration(page.duration)}
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