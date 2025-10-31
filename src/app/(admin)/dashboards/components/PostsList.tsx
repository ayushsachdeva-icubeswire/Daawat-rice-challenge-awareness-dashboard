import { Card, CardBody, CardHeader, ListGroup, Badge, Row, Col } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { PostData } from '@/services/campaignContentsService'
import { formatNumber } from '@/utils/numberFormat'



interface PostsListProps {
  posts: PostData[]
  title?: string
  showHeader?: boolean
  maxHeight?: string
  isLoading?: boolean
  error?: string | null
  onTitleClick?: () => void
}

const PostsList = ({ 
  posts, 
  title = "Recent Posts", 
  showHeader = true,
  maxHeight = "400px",
  isLoading = false,
  error = null,
  onTitleClick
}: PostsListProps) => {


    const formatTimestamp = (timestamp: number | string | any): string => {
    if (!timestamp) return '';
    
    // Convert to number if it's a string
    const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp) : Number(timestamp);
    
    // Validate timestamp
    if (isNaN(timestampNum) || timestampNum <= 0) return '';
    
    const date = new Date(timestampNum * 1000)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? 'day' : 'days'} ago`
    }
  }



  const handleInstagramRedirect = (username: string) => {
    const instagramUrl = `https://www.instagram.com/${username}/#`
    window.open(instagramUrl, '_blank')
  }

  return (
    <Card className="h-100">
      {showHeader && (
        <CardHeader 
          className={`d-flex align-items-center justify-content-between ${onTitleClick ? 'user-select-none' : ''}`}
          style={{ 
            cursor: onTitleClick ? 'pointer' : 'default',
            transition: onTitleClick ? 'background-color 0.2s' : 'none'
          }}
          onClick={onTitleClick}
          title={onTitleClick ? "Click to open hashtag performance in new tab" : ""}
          onMouseEnter={(e) => {
            if (onTitleClick) {
              e.currentTarget.style.backgroundColor = '#f8f9fa'
            }
          }}
          onMouseLeave={(e) => {
            if (onTitleClick) {
              e.currentTarget.style.backgroundColor = ''
            }
          }}
        >
          <div className="d-flex align-items-center">
            <h5 className="card-title mb-0 me-2">{title}</h5>
            {onTitleClick && (
              <IconifyIcon 
                icon="solar:external-link-broken" 
                className="fs-12 text-muted"
              />
            )}
          </div>
          <Badge bg="primary" pill>{posts.length}</Badge>
        </CardHeader>
      )}
      <CardBody className="p-0">
        <div style={{ maxHeight, overflowY: 'auto' }}>
          <ListGroup variant="flush">
            {isLoading ? (
              <ListGroup.Item className="text-center py-4 text-muted">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading campaign posts...</p>
              </ListGroup.Item>
            ) : error ? (
              <ListGroup.Item className="text-center py-4 text-muted">
                <IconifyIcon icon="solar:danger-circle-broken" className="fs-48 mb-2 text-danger" />
                <p className="text-danger">{error}</p>
              </ListGroup.Item>
            ) : posts.length === 0 ? (
              <ListGroup.Item className="text-center py-4 text-muted">
                <IconifyIcon icon="solar:document-text-broken" className="fs-48 mb-2" />
                <p>No campaign posts available</p>
              </ListGroup.Item>
            ) : (
              posts.map((post) => (
                <ListGroup.Item key={post._id} className="px-3 py-3">
                  <Row className="align-items-start">
                    <Col xs="auto">
                      <div 
                        className="rounded-circle overflow-hidden position-relative"
                        style={{ 
                          width: '40px', 
                          height: '40px',
                          minWidth: '40px',
                          minHeight: '40px'
                        }}
                      >
                        <img 
                          src={post.influencer?.profile_pic_url || '/images/users/user-1.jpg'}
                          alt={post.influencer.full_name}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            display: 'block'
                          }}
                          onError={(e) => {
                            // Hide the broken image and show fallback
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'none', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            backgroundColor: '#f8f9fa',
                            position: 'absolute',
                            top: '0',
                            left: '0'
                          }}
                        >
                          <IconifyIcon icon="solar:user-broken" className="fs-18 text-muted" />
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-start justify-content-between mb-2">
                        <div className="flex-grow-1 me-2">
                          <h6 className="mb-1 text-truncate">
                            <span 
                              className="text-primary"
                              style={{ cursor: 'pointer', textDecoration: 'none' }}
                              onClick={() => handleInstagramRedirect(post.influencer?.handle || post.influencer?.username || '')}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.textDecoration = 'underline'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.textDecoration = 'none'
                              }}
                              title={`Open @${post.influencer?.handle || post.influencer?.username || ''} on Instagram`}
                            >
                              @{String(post.influencer?.handle || post.influencer?.username || 'Unknown')}
                            </span>
                          </h6>
                          <div className="d-flex align-items-center text-muted small mb-1">
                            <span className="me-2">{String(post.influencer?.full_name || '')}</span>
                            {/* <Badge bg="outline-primary" text="primary" className="me-2">
                              {post.is_video ? 'Video' : post.is_carousel ? 'Carousel' : 'Photo'}
                            </Badge> */}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className={`badge small ${post.is_paid_partnership ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'}`}>
                            {post.is_paid_partnership ? 'Collaborated' : 'Organic'}
                            {/* {String(formatNumber(Number(post.total_followers) || 0))} followers */}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted mb-2 small">
                        {(() => {
                          let captionText = '';
                          
                          // Handle caption structure: {0: {text: "content"}}
                          if (post.caption) {
                            const caption = post.caption as any;
                            
                            // The structure is {0: {text: "content"}}
                            if (typeof caption === 'object' && caption['0'] && caption['0'].text) {
                              captionText = String(caption['0'].text);
                            }
                            // Fallback: try direct string
                            else if (typeof caption === 'string') {
                              captionText = caption;
                            }
                          }
                          
                          // Truncate if too long
                          if (captionText && captionText.length > 150) {
                            captionText = captionText.substring(0, 150) + '...';
                          }
                          
                          return captionText || 'No caption available';
                        })()}
                      </p>
                      
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center">
                          {Array.isArray(post.hashtags) && post.hashtags.slice(0, 2).map((tag: any, index: number) => (
                            <Badge key={index} bg="light" text="dark" className="me-1 small">
                              {String(tag || '')}
                            </Badge>
                          ))}
                          {Array.isArray(post.hashtags) && post.hashtags.length > 2 && (
                            <span className="text-muted small">+{post.hashtags.length - 2} more</span>
                          )}
                        </div>
                        <small className="text-muted">
                          {String(formatTimestamp(post.created_timestamp) || '')}
                        </small>
                      </div>
                      
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center me-3">
                            <IconifyIcon icon="solar:heart-broken" className="fs-12 me-1 text-danger" />
                            <span className="small text-muted">{String(formatNumber(Number(post.total_likes) || 0))}</span>
                          </div>
                          <div className="d-flex align-items-center me-3">
                            <IconifyIcon icon="solar:chat-round-line-broken" className="fs-12 me-1 text-primary" />
                            <span className="small text-muted">{String(formatNumber(Number(post.total_comments) || 0))}</span>
                          </div>
                          <div className="d-flex align-items-center me-3">
                            <IconifyIcon icon="solar:share-broken" className="fs-12 me-1 text-success" />
                            <span className="small text-muted">{String(formatNumber(Number(post.reshare_count) || 0))}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <IconifyIcon icon="solar:eye-broken" className="fs-12 me-1 text-muted" />
                            <span className="small text-muted">{String(formatNumber(Number(post.reach) || 0))}</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </div>
      </CardBody>
    </Card>
  )
}

export default PostsList