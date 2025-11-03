import { Card, CardBody, CardHeader, ListGroup, Badge, Row, Col, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Challenger } from '@/types/challenger'

// Simple time formatter
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
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

interface ChallengerGraphData {
  date: string
  Completed: number
  InProgress: number
}

interface RecentChallengersProps {
  challengers: Challenger[]
  title?: string
  showHeader?: boolean
  maxHeight?: string
  isLoading?: boolean
  error?: string | null
  onTitleClick?: () => void
  challengrsGraphData?: ChallengerGraphData[]
}

const RecentChallengers = ({ 
  challengers, 
  title = "Recent Challengers", 
  showHeader = true,
  maxHeight = "400px",
  isLoading = false,
  error = null,
  onTitleClick,
  // challengrsGraphData
}: RecentChallengersProps) => {
  
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'weight loss':
        return '#ef4444'
      case 'muscle building':
        return '#10b981'
      case 'endurance':
        return '#f59e0b'
      case 'flexibility':
        return '#8b5cf6'
      default:
        return '#6b7280'
    }
  }

  const getTypeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'weight loss':
        return 'danger'
      case 'muscle building':
        return 'success'
      case 'endurance':
        return 'warning'
      case 'flexibility':
        return 'info'
      default:
        return 'secondary'
    }
  }

  // const getCategoryIcon = (category: string) => {
  //   switch (category.toLowerCase()) {
  //     case 'Vegetarian':
  //       return 'solar:leaf-broken'
  //     case 'Veg + Egg':
  //       return 'solar:fire-broken'
  //     case 'Veg + Meat':
  //       return 'solar:dumbbell-broken'
  //     case 'low carb':
  //       return 'solar:scale-broken'
  //     case 'mediterranean':
  //       return 'solar:planet-broken'
  //     default:
  //       return 'solar:nutrition-broken'
  //   }
  // }

  // const getStatusIcon = (isActive: boolean) => {
  //   return isActive ? 'solar:check-circle-broken' : 'solar:pause-circle-broken'
  // }

  // const getStatusVariant = (isActive: boolean) => {
  //   return isActive ? 'success' : 'secondary'
  // }

  // Calculate totals from graph data
  // const getTotalsFromGraphData = () => {
  //   if (!challengrsGraphData || challengrsGraphData.length === 0) {
  //     return { totalCompleted: 0, totalInProgress: 0 }
  //   }
    
  //   const latest = challengrsGraphData[challengrsGraphData.length - 1]
  //   return {
  //     totalCompleted: latest.Completed,
  //     totalInProgress: latest.InProgress
  //   }
  // }

  // const { totalCompleted, totalInProgress } = getTotalsFromGraphData()

  return (
    <Card className="h-100">
      {showHeader && (
        <CardHeader className="d-flex align-items-center justify-content-between">
          <h5 
            className={`card-title mb-0 ${onTitleClick ? 'text-primary cursor-pointer' : ''}`}
            onClick={onTitleClick}
            style={onTitleClick ? { cursor: 'pointer' } : {}}
          >
            {title}
          </h5>
          <Badge bg="primary" pill>{challengers.length}</Badge>
        </CardHeader>
      )}
      {/* {challengrsGraphData && challengrsGraphData.length > 0 && (
        <div className="px-3 py-2 bg-light border-bottom">
          <Row className="text-center">
            <Col>
              <div className="text-success fw-bold">{totalCompleted}</div>
              <small className="text-muted">Completed</small>
            </Col>
            <Col>
              <div className="text-primary fw-bold">{totalInProgress}</div>
              <small className="text-muted">In Progress</small>
            </Col>
          </Row>
        </div>
      )} */}
      <CardBody className="p-0">
        <div style={{ maxHeight, overflowY: 'auto' }}>
          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading challengers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-danger">
              <IconifyIcon icon="solar:danger-circle-broken" className="fs-48 mb-2" />
              <p>{error}</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {challengers.length === 0 ? (
                <ListGroup.Item className="text-center py-4 text-muted">
                  <IconifyIcon icon="solar:users-group-two-rounded-broken" className="fs-48 mb-2" />
                  <p>No challengers available</p>
                </ListGroup.Item>
              ) : (
                challengers.map((challenger) => (
                  <ListGroup.Item key={challenger._id} className="px-3 py-3">
                    <Row className="align-items-start">
                      <Col xs="auto">
                        <div 
                          className="avatar-sm rounded-circle d-flex align-items-center justify-content-center"
                          style={{ backgroundColor: `${getTypeColor(challenger.type)}20`, fontWeight: 600, fontSize: '1.1rem', color: getTypeColor(challenger.type) }}
                        >
                          {challenger.name?.charAt(0).toUpperCase()}
                        </div>
                      </Col>
                      <Col>
                        {/* <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="mb-0 text-truncate flex-grow-1 me-2">{challenger.name}</h6>
                          <Badge bg={getStatusVariant(challenger.isActive)} className="d-flex align-items-center">
                            <IconifyIcon icon={getStatusIcon(challenger.isActive)} className="fs-12 me-1" />
                            {challenger.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div> */}
                        
                        <p className="text-muted mb-2 small">
                          <IconifyIcon icon="solar:phone-broken" className="fs-12 me-1" />
                          {challenger.mobile}
                        </p>
                        
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center">
                            <Badge bg={getTypeVariant(challenger.type)} className="me-2">
                              {challenger.type}
                            </Badge>
                            <span className="text-muted small">{challenger.category}</span>
                          </div>
                          <div className="text-end">
                            <div className="text-primary fw-semibold small">
                              <IconifyIcon icon="solar:clock-circle-broken" className="fs-12 me-1" />
                              {challenger.duration}
                            </div>
                          </div>
                        </div>
                        
                        {challenger.subcategory && (
                          <div className="mb-2">
                            <Badge bg="light" text="dark" className="small">
                              {challenger.subcategory}
                            </Badge>
                          </div>
                        )}
                        
                        {challenger.createdAt && (
                          <div className="d-flex align-items-center text-muted small">
                            <IconifyIcon icon="solar:calendar-broken" className="fs-12 me-1" />
                            Created {formatTimeAgo(challenger.createdAt)}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default RecentChallengers