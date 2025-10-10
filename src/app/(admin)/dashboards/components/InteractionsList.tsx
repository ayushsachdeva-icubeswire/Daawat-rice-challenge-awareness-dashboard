import { Card, CardBody, CardHeader, ListGroup, Badge, Row, Col } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Interaction } from '@/types/dashboard'

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

interface InteractionsListProps {
  interactions: Interaction[]
  title?: string
  showHeader?: boolean
  maxHeight?: string
}

const InteractionsList = ({ 
  interactions, 
  title = "Recent Interactions", 
  showHeader = true,
  maxHeight = "400px"
}: InteractionsListProps) => {
  const getInteractionIcon = (type: Interaction['type']) => {
    switch (type) {
      case 'like':
        return 'solar:heart-broken'
      case 'comment':
        return 'solar:chat-round-line-broken'
      case 'share':
        return 'solar:share-broken'
      case 'view':
        return 'solar:eye-broken'
      default:
        return 'solar:star-broken'
    }
  }

  const getInteractionColor = (type: Interaction['type']) => {
    switch (type) {
      case 'like':
        return '#ef4444'
      case 'comment':
        return '#3b82f6'
      case 'share':
        return '#10b981'
      case 'view':
        return '#6b7280'
      default:
        return '#8b5cf6'
    }
  }

  const getBadgeVariant = (type: Interaction['type']) => {
    switch (type) {
      case 'like':
        return 'danger'
      case 'comment':
        return 'primary'
      case 'share':
        return 'success'
      case 'view':
        return 'secondary'
      default:
        return 'info'
    }
  }

  return (
    <Card className="h-100">
      {showHeader && (
        <CardHeader className="d-flex align-items-center justify-content-between">
          <h5 className="card-title mb-0">{title}</h5>
          <Badge bg="primary" pill>{interactions.length}</Badge>
        </CardHeader>
      )}
      <CardBody className="p-0">
        <div style={{ maxHeight, overflowY: 'auto' }}>
          <ListGroup variant="flush">
            {interactions.length === 0 ? (
              <ListGroup.Item className="text-center py-4 text-muted">
                <IconifyIcon icon="solar:inbox-broken" className="fs-48 mb-2" />
                <p>No recent interactions</p>
              </ListGroup.Item>
            ) : (
              interactions.map((interaction) => (
                <ListGroup.Item key={interaction.id} className="px-3 py-3">
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <div 
                        className="avatar-sm rounded-circle d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: `${getInteractionColor(interaction.type)}20` }}
                      >
                        <IconifyIcon 
                          icon={getInteractionIcon(interaction.type)} 
                          className="fs-18"
                          color={getInteractionColor(interaction.type)}
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <h6 className="mb-0 text-truncate">{interaction.userName}</h6>
                        <Badge bg={getBadgeVariant(interaction.type)} className="ms-2">
                          {interaction.type}
                        </Badge>
                      </div>
                      <p className="text-muted mb-1 small text-truncate">
                        {interaction.type === 'comment' && interaction.message 
                          ? interaction.message 
                          : `${interaction.type === 'like' ? 'Liked' : 
                               interaction.type === 'share' ? 'Shared' : 
                               interaction.type === 'view' ? 'Viewed' : 'Interacted with'} "${interaction.contentTitle}"`
                        }
                      </p>
                      <small className="text-muted">
                        {formatTimeAgo(interaction.timestamp)}
                      </small>
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

export default InteractionsList