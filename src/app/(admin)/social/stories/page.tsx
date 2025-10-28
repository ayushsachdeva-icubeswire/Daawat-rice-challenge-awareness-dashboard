import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import CreateStoryModal from '@/components/CreateStoryModal'
import { getStories, type Story } from '@/services/storyService'
import { useState, useEffect } from 'react'
import { formatNumber } from '@/utils/numberFormat'

const StoriesPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [storiesData, setStoriesData] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalStories, setTotalStories] = useState(0)
  // Modal state for viewing story image
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null)

  // Fetch stories from API
  const fetchStories = async (page = 1) => {
    try {
      setLoading(true)
      const response = await getStories({ page, limit: 10 })
      
      if (response.success) {
        setStoriesData(response.data.stories)
        setCurrentPage(response.data.pagination.currentPage)
        setTotalPages(response.data.pagination.totalPages)
        setTotalStories(response.data.pagination.total)
      } else {
        console.error('Failed to fetch stories:', response.message)
        setStoriesData([])
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
      setStoriesData([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch stories on component mountx
  useEffect(() => {
    fetchStories(1)
  }, [])

  // Helper function to extract platform from story link
  const getPlatformFromLink = (link: string): string => {
    if (link.includes('instagram.com')) return 'Instagram'
    if (link.includes('facebook.com')) return 'Facebook'
    if (link.includes('twitter.com') || link.includes('x.com')) return 'Twitter'
    if (link.includes('tiktok.com')) return 'TikTok'
    return 'Other'
  }

  // Helper function to determine story status (simplified logic)
  const getStoryStatus = (createdAt: string): 'Active' | 'Expired' => {
    const storyDate = new Date(createdAt)
    const now = new Date()
    const hoursDiff = (now.getTime() - storyDate.getTime()) / (1000 * 60 * 60)
    return hoursDiff < 24 ? 'Active' : 'Expired'
  }

  // Map API stories to include derived fields
  const mappedStories = storiesData.map(story => ({
    ...story,
    platform: getPlatformFromLink(story.storyLink),
    status: getStoryStatus(story.createdAt),
    type: (Math.random() > 0.7 ? 'Video' : 'Photo') as 'Photo' | 'Video', // Random type assignment for demo
    title: story.influencer.fullName, // Use influencer full name as title
    posted: story.createdAt,
    id: story._id,
    duration: 24, // Stories typically last 24 hours
    image: story.imageUrl // Map imageUrl to image for backward compatibility
  }))

  const filteredStories = mappedStories.filter(story => {
    const matchesStatus = selectedStatus === 'all' || story.status.toLowerCase() === selectedStatus.toLowerCase()
    return matchesStatus
  })

  const totalViews = storiesData.reduce((sum, story) => sum + story.views, 0)
  const totalLikes = storiesData.reduce((sum, story) => sum + story.likes, 0)
  const totalInfluencers = new Set(storiesData.map(story => story.influencer.id)).size // Count unique influencers
  const activeStories = mappedStories.filter(story => story.status === 'Active').length



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
                    <h4 className="mb-0">{formatNumber(totalViews)}</h4>
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
                    <h4 className="mb-0">{formatNumber(totalLikes)}</h4>
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
                    <h4 className="mb-0">{totalInfluencers}</h4>
                    <p className="mb-0">Total Influencers</p>
                  </div>
                  <i className="fas fa-users fa-2x opacity-75"></i>
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
            <div className="col-md-6">
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
            <div className="col-md-6 text-end">
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
                disabled={loading}
              >
                <i className="fas fa-plus me-2"></i>Create Story
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Influencer</th>
                  <th>Handle</th>
                  <th>Image</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Posted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStories.map((story) => (
                  <tr key={story.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="position-relative me-2">
                          <img 
                            src={story.influencer.profilePicUrl} 
                            alt={story.influencer.fullName}
                            className="rounded-circle"
                            width="32"
                            height="32"
                            style={{ objectFit: 'cover' }}
                          />
                          <i 
                            className={`fab fa-${story.platform.toLowerCase()} position-absolute text-primary`}
                            style={{ 
                              bottom: '-4px', 
                              right: '-4px', 
                              fontSize: '12px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              padding: '2px',
                              border: '1px solid #dee2e6'
                            }}
                          ></i>
                        </div>
                        <div>
                          <div className="fw-semibold">{story.influencer.fullName}</div>
                          <small className="text-muted">
                            {formatNumber(story.influencer.followerCount)} followers
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span 
                        className="fw-semibold text-primary cursor-pointer text-decoration-none"
                        style={{ 
                          cursor: 'pointer',
                          transition: 'color 0.2s ease-in-out'
                        }}
                        onClick={() => {
                          window.open(`https://www.instagram.com/${story.handle}/#`, '_blank', 'noopener,noreferrer')
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.textDecoration = 'underline'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.textDecoration = 'none'
                        }}
                        title="Click to open Instagram profile"
                      >
                        @{story.handle}
                      </span>
                    </td>
                    <td>
                      {story.imageUrl ? (
                        <img 
                          src={story.imageUrl} 
                          alt="Story"
                          className="rounded cursor-pointer"
                          width="60"
                          height="60"
                          style={{ 
                            objectFit: 'cover',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease-in-out'
                          }}
                          onClick={() => {
                            setModalImageUrl(story.imageUrl)
                            setShowImageModal(true)
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'
                          }}
                          title="Click to view story image"
                        />
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center bg-light rounded cursor-pointer"
                          style={{ 
                            width: '60px', 
                            height: '60px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease-in-out'
                          }}
                          onClick={() => {
                            setModalImageUrl(null)
                            setShowImageModal(true)
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#e9ecef'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa'
                          }}
                          title="Click to view story image"
                        >
                          <i className="fas fa-image text-muted"></i>
                        </div>
                      )}
                    </td>
                    <td>{formatNumber(story.views)}</td>
                    <td>
                      <span className="badge bg-success">{formatNumber(story.likes)}</span>
                    </td>
                    <td>{new Date(story.posted).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${story.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                        {story.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        title="Share Story"
                        onClick={() => {
                          // Copy story link to clipboard
                          navigator.clipboard.writeText(story.storyLink).then(() => {
                            alert('Story link copied to clipboard!')
                          })
                        }}
                      >
                        <i className="fas fa-share"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2">Loading stories...</p>
            </div>
          )}

          {!loading && filteredStories.length === 0 && (
            <div className="text-center py-4">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <p className="text-muted">
                {storiesData.length === 0 
                  ? 'No stories available. Create your first story!' 
                  : 'No stories found matching your criteria.'}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalStories)} of {totalStories} stories
              </div>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => fetchStories(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-chevron-left"></i> Previous
                    </button>
                  </li>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const pageNum = Math.max(1, currentPage - 2) + index
                    if (pageNum > totalPages) return null
                    
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => fetchStories(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    )
                  })}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => fetchStories(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next <i className="fas fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </ComponentContainerCard>

        {/* Create Story Modal */}
        <CreateStoryModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onStoryCreated={() => {
            // Refresh stories data after creating a new story
            fetchStories(1) // Go back to first page to see the new story
            setCurrentPage(1)
          }}
        />
      {/* Story Image Modal */}
      {showImageModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}
          tabIndex={-1}
          role="dialog"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Story Image</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowImageModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                {modalImageUrl ? (
                  <img src={modalImageUrl} alt="Story" style={{ minWidth: '50%', maxHeight: '60vh', borderRadius: '8px' }} />
                ) : (
                  <div className="text-muted">No image available for this story.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default StoriesPage