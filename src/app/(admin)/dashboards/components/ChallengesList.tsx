import { Card, CardBody, CardHeader, ListGroup, Badge, Row, Col, ProgressBar } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Challenge } from '@/types/dashboard'

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

interface ChallengesListProps {
  challenges: Challenge[]
  title?: string
  showHeader?: boolean
  maxHeight?: string
}

const ChallengesList = ({ 
  challenges, 
  title = "Active Challenges", 
  showHeader = true,
  maxHeight = "400px"
}: ChallengesListProps) => {
  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return '#10b981'
      case 'medium':
        return '#f59e0b'
      case 'hard':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getDifficultyVariant = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'success'
      case 'medium':
        return 'warning'
      case 'hard':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getStatusVariant = (status: Challenge['status']) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in-progress':
        return 'primary'
      case 'failed':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getStatusIcon = (status: Challenge['status']) => {
    switch (status) {
      case 'completed':
        return 'solar:check-circle-broken'
      case 'in-progress':
        return 'solar:play-circle-broken'
      case 'failed':
        return 'solar:close-circle-broken'
      default:
        return 'solar:pause-circle-broken'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'programming':
        return 'solar:code-broken'
      case 'web design':
        return 'solar:palette-broken'
      case 'react':
        return 'solar:atom-broken'
      case 'backend':
        return 'solar:server-broken'
      case 'design':
        return 'solar:magic-stick-3-broken'
      default:
        return 'solar:bookmark-broken'
    }
  }

  return (
    <Card className="h-100">
      {showHeader && (
        <CardHeader className="d-flex align-items-center justify-content-between">
          <h5 className="card-title mb-0">{title}</h5>
          <Badge bg="primary" pill>{challenges.length}</Badge>
        </CardHeader>
      )}
      <CardBody className="p-0">
        <div style={{ maxHeight, overflowY: 'auto' }}>
          <ListGroup variant="flush">
            {challenges.length === 0 ? (
              <ListGroup.Item className="text-center py-4 text-muted">
                <IconifyIcon icon="solar:cup-star-broken" className="fs-48 mb-2" />
                <p>No challenges available</p>
              </ListGroup.Item>
            ) : (
              challenges.map((challenge) => (
                <ListGroup.Item key={challenge.id} className="px-3 py-3">
                  <Row className="align-items-start">
                    <Col xs="auto">
                      <div 
                        className="avatar-sm rounded-circle d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: `${getDifficultyColor(challenge.difficulty)}20` }}
                      >
                        <IconifyIcon 
                          icon={getCategoryIcon(challenge.category)} 
                          className="fs-18"
                          color={getDifficultyColor(challenge.difficulty)}
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="mb-0 text-truncate flex-grow-1 me-2">{challenge.title}</h6>
                        <Badge bg={getStatusVariant(challenge.status)} className="d-flex align-items-center">
                          <IconifyIcon icon={getStatusIcon(challenge.status)} className="fs-12 me-1" />
                          {challenge.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-muted mb-2 small">{challenge.description}</p>
                      
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center">
                          <Badge bg={getDifficultyVariant(challenge.difficulty)} className="me-2">
                            {challenge.difficulty}
                          </Badge>
                          <span className="text-muted small">{challenge.category}</span>
                        </div>
                        <div className="text-end">
                          <div className="text-primary fw-semibold small">{challenge.points} pts</div>
                          <div className="text-muted small">{challenge.participantCount} participants</div>
                        </div>
                      </div>
                      
                      {challenge.status === 'in-progress' && challenge.startDate && (
                        <div className="mb-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Progress</small>
                            <small className="text-muted">
                              Started {formatTimeAgo(challenge.startDate)}
                            </small>
                          </div>
                          <ProgressBar 
                            now={65} 
                            variant="primary" 
                            style={{ height: '4px' }}
                          />
                        </div>
                      )}
                      
                      {challenge.timeLimit && (
                        <div className="d-flex align-items-center text-muted small">
                          <IconifyIcon icon="solar:clock-circle-broken" className="fs-12 me-1" />
                          {challenge.timeLimit} minutes
                        </div>
                      )}
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

export default ChallengesList