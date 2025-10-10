import { Card, CardBody, CardHeader, ListGroup, Badge, Row, Col } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Post } from '@/types/dashboard'

// Simple time formatter
const formatTimeAgo = (date: Date): string => {
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

interface PostsListProps {
  posts: Post[]
  title?: string
  showHeader?: boolean
  maxHeight?: string
}

const PostsList = ({ 
  posts, 
  title = "Recent Posts", 
  showHeader = true,
  maxHeight = "400px"
}: PostsListProps) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'react':
        return '#61dafb'
      case 'typescript':
        return '#3178c6'
      case 'ui/ux':
        return '#ff6b6b'
      case 'css':
        return '#1572b6'
      case 'javascript':
        return '#f7df1e'
      default:
        return '#8b5cf6'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'react':
        return 'solar:atom-broken'
      case 'typescript':
        return 'solar:code-broken'
      case 'ui/ux':
        return 'solar:palette-broken'
      case 'css':
        return 'solar:magic-stick-3-broken'
      case 'javascript':
        return 'solar:programming-broken'
      default:
        return 'solar:document-text-broken'
    }
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content
  }

  return (
    <Card className="h-100">
      {showHeader && (
        <CardHeader className="d-flex align-items-center justify-content-between">
          <h5 className="card-title mb-0">{title}</h5>
          <Badge bg="primary" pill>{posts.length}</Badge>
        </CardHeader>
      )}
      <CardBody className="p-0">
        <div style={{ maxHeight, overflowY: 'auto' }}>
          <ListGroup variant="flush">
            {posts.length === 0 ? (
              <ListGroup.Item className="text-center py-4 text-muted">
                <IconifyIcon icon="solar:document-text-broken" className="fs-48 mb-2" />
                <p>No posts available</p>
              </ListGroup.Item>
            ) : (
              posts.map((post) => (
                <ListGroup.Item key={post.id} className="px-3 py-3">
                  <Row className="align-items-start">
                    <Col xs="auto">
                      <div 
                        className="avatar-sm rounded-circle d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: `${getCategoryColor(post.category)}20` }}
                      >
                        <IconifyIcon 
                          icon={getCategoryIcon(post.category)} 
                          className="fs-18"
                          color={getCategoryColor(post.category)}
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-start justify-content-between mb-2">
                        <div className="flex-grow-1 me-2">
                          <h6 className="mb-1 text-truncate">{post.title}</h6>
                          <div className="d-flex align-items-center text-muted small mb-1">
                            <span className="me-2">by {post.author.name}</span>
                            <Badge bg="outline-primary" text="primary" className="me-2">
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className={`badge ${post.isPublished ? 'bg-success' : 'bg-warning'}`}>
                            {post.isPublished ? 'Published' : 'Draft'}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted mb-2 small">
                        {truncateContent(post.content)}
                      </p>
                      
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center">
                          {post.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} bg="light" text="dark" className="me-1 small">
                              #{tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-muted small">+{post.tags.length - 2} more</span>
                          )}
                        </div>
                        <small className="text-muted">
                          {formatTimeAgo(post.createdAt)}
                        </small>
                      </div>
                      
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center me-3">
                            <IconifyIcon icon="solar:heart-broken" className="fs-12 me-1 text-danger" />
                            <span className="small text-muted">{post.likes}</span>
                          </div>
                          <div className="d-flex align-items-center me-3">
                            <IconifyIcon icon="solar:chat-round-line-broken" className="fs-12 me-1 text-primary" />
                            <span className="small text-muted">{post.comments}</span>
                          </div>
                          <div className="d-flex align-items-center me-3">
                            <IconifyIcon icon="solar:share-broken" className="fs-12 me-1 text-success" />
                            <span className="small text-muted">{post.shares}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <IconifyIcon icon="solar:eye-broken" className="fs-12 me-1 text-muted" />
                            <span className="small text-muted">{post.views}</span>
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