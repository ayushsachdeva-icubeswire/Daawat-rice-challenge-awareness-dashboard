import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { PostInteraction } from '@/types/post-interactions'
import './InstagramCommentsModal.scss'

interface InstagramCommentsModalProps {
  show: boolean
  onHide: () => void
  interactions: PostInteraction[]
  loading?: boolean
}

const InstagramCommentsModal: React.FC<InstagramCommentsModalProps> = ({
  show,
  onHide,
  interactions,
  loading = false
}) => {
  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now() / 1000
    const diffInSeconds = Math.floor(now - timestamp)
    
    if (diffInSeconds < 60) {
      return 'now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}d`
    } else {
      const weeks = Math.floor(diffInSeconds / 604800)
      return `${weeks}w`
    }
  }

  // const getLocationString = (location?: PostInteractionLocation): string => {
  //   if (!location) {
  //     return ''
  //   }
    
  //   if (location.display_name) {
  //     return location.display_name
  //   }
    
  //   const parts = [location.city, location.state, location.country].filter(Boolean)
  //   return parts.length > 0 ? parts.join(', ') : ''
  // }

  const getProfileImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(target.alt || 'User')}&background=e3f2fd&color=1976d2&size=40`
  }

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      className="instagram-comments-modal"
    >
      <Modal.Header closeButton className="border-0 pb-2">
        <Modal.Title className="fs-5 fw-semibold">
          Comments ({interactions.length})
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2">Loading comments...</p>
          </div>
        ) : interactions.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-comment-alt text-muted mb-3" style={{ fontSize: '3rem' }}></i>
            <p className="text-muted mb-0">No comments yet</p>
            {/* <small className="text-muted">Be the first to comment</small> */}
          </div>
        ) : (
          <div className="comments-container">
            {interactions.map((interaction) => (
              <div key={interaction._id} className="comment-item">
                <div className="comment-avatar">
                  <img
                    src={interaction.owner.profile_pic_url}
                    alt={interaction.owner.username}
                    className="avatar-img"
                    onError={getProfileImageError}
                  />
                  {interaction.owner.is_verified && (
                    <div className="verified-badge">
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                </div>
                
                <div className="comment-content">
                  <div className="comment-header">
                    <div className="comment-user-info">
                      <span className="username">
                        {interaction.owner.username}
                      </span>
                      {interaction.owner.is_verified && (
                        <i className="fas fa-check-circle verified-icon"></i>
                      )}
                      <span className="comment-time">
                        {formatTimeAgo(interaction.created_timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="comment-text">
                    {interaction.comment_text}
                  </div>
                  
                  <div className="comment-meta">
                    <div className="comment-actions">
                      <button className="action-btn">
                        {/* <i className="far fa-heart"></i> */}
                      </button>
                      <button className="action-btn">
                        {/* Reply */}
                      </button>
                    </div>
                    
                    <div className="comment-details">
                      {/* {interaction.sentiment && (
                        <span className={`sentiment-badge sentiment-${interaction.sentiment.toLowerCase()}`}>
                          {interaction.sentiment}
                        </span>
                      )} */}
                      
                      {/* {getLocationString(interaction.location) && (
                        <span className="location-info">
                          <i className="fas fa-map-marker-alt"></i>
                          {getLocationString(interaction.location)}
                        </span>
                      )} */}
                      
                      {/* {interaction.owner.gender && interaction.owner.gender.trim() !== '' && (
                        <span className="gender-info">
                          {interaction.owner.gender}
                        </span>
                      )} */}
                      
                      {/* {interaction.owner.calculated_age_range && interaction.owner.calculated_age_range.trim() !== '' && (
                        <span className="age-info">
                          Age: {interaction.owner.calculated_age_range}
                        </span>
                      )} */}
{/*                       
                      {interaction.language && interaction.language.trim() !== '' && interaction.language !== 'null' && (
                        <span className="language-info">
                          {interaction.language}
                        </span>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer className="border-0 pt-0">
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default InstagramCommentsModal