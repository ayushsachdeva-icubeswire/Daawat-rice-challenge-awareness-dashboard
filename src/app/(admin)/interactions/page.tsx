import { useState, useMemo } from 'react'
import { Card, CardBody, CardHeader, Row, Col, Button, Badge, Form, InputGroup } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import Footer from '@/components/layout/Footer'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { mockInteractions } from '@/app/(admin)/dashboards/mockData'
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

const InteractionsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<Interaction['type'] | 'all'>('all')
  const [sortField, setSortField] = useState<keyof Interaction>('timestamp')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Generate more mock data for demonstration
  const extendedMockInteractions = useMemo(() => {
    const baseInteractions = [...mockInteractions]
    const additionalInteractions = []
    
    for (let i = 0; i < 50; i++) {
      const types: Interaction['type'][] = ['like', 'comment', 'share', 'view']
      const users = ['Ravi Kumar', 'Anjali Verma', 'Sanjay Patel', 'Deepika Roy', 'Amit Gupta', 'Nisha Singh', 'Karan Sharma', 'Pooja Reddy']
      const posts = ['Day 10: Coconut Rice Special', 'Saffron Basmati Tutorial', 'Quick Jeera Rice Recipe', 'Biryani Layering Technique', 'Healthy Brown Rice Bowl', 'Traditional Pulao Method', 'Rice & Lentil Combinations']
      
      additionalInteractions.push({
        id: `interaction-${i + 6}`,
        type: types[Math.floor(Math.random() * types.length)],
        userId: `user-${i + 6}`,
        userName: users[Math.floor(Math.random() * users.length)],
        userAvatar: `/src/assets/images/users/avatar-${(i % 5) + 1}.jpg`,
        contentId: `post-${i + 6}`,
        contentTitle: posts[Math.floor(Math.random() * posts.length)],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        message: Math.random() > 0.7 ? 'Great content! Really helpful.' : undefined,
      })
    }
    
    return [...baseInteractions, ...additionalInteractions]
  }, [])

  // Filter and search logic
  const filteredInteractions = useMemo(() => {
    return extendedMockInteractions.filter(interaction => {
      const matchesSearch = 
        interaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (interaction.message && interaction.message.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesFilter = filterType === 'all' || interaction.type === filterType
      
      return matchesSearch && matchesFilter
    })
  }, [extendedMockInteractions, searchTerm, filterType])

  // Sort logic
  const sortedInteractions = useMemo(() => {
    return [...filteredInteractions].sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      if (sortField === 'timestamp') {
        aValue = new Date(aValue as Date).getTime()
        bValue = new Date(bValue as Date).getTime()
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (aValue == null) aValue = ''
      if (bValue == null) bValue = ''
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredInteractions, sortField, sortDirection])

  // Pagination logic
  const totalPages = Math.ceil(sortedInteractions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInteractions = sortedInteractions.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: keyof Interaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getInteractionIcon = (type: Interaction['type']) => {
    switch (type) {
      case 'like': return 'solar:heart-broken'
      case 'comment': return 'solar:chat-round-line-broken'
      case 'share': return 'solar:share-broken'
      case 'view': return 'solar:eye-broken'
      default: return 'solar:star-broken'
    }
  }



  const getBadgeVariant = (type: Interaction['type']) => {
    switch (type) {
      case 'like': return 'danger'
      case 'comment': return 'primary'
      case 'share': return 'success'
      case 'view': return 'secondary'
      default: return 'info'
    }
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Previous button
    pages.push(
      <Button
        key="prev"
        variant="outline-primary"
        size="sm"
        className="me-2"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <IconifyIcon icon="solar:alt-arrow-left-broken" />
      </Button>
    )

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? 'primary' : 'outline-primary'}
          size="sm"
          className="me-2"
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      )
    }

    // Next button
    pages.push(
      <Button
        key="next"
        variant="outline-primary"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <IconifyIcon icon="solar:alt-arrow-right-broken" />
      </Button>
    )

    return pages
  }

  return (
    <>
      <PageTitle subName="Daawat" title="Interactions" />
      
      <Card>
        <CardHeader>
          <Row className="align-items-center">
            <Col>
              <h5 className="card-title mb-0">All Interactions</h5>
              <small className="text-muted">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedInteractions.length)} of {sortedInteractions.length} interactions
              </small>
            </Col>
            <Col xs="auto">
              <Badge bg="primary" pill>{sortedInteractions.length}</Badge>
            </Col>
          </Row>
        </CardHeader>
        
        <CardBody>
          {/* Filters and Search */}
          <Row className="mb-4">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <IconifyIcon icon="solar:magnifer-broken" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search interactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as Interaction['type'] | 'all')}
              >
                <option value="all">All Types</option>
                <option value="like">Likes</option>
                <option value="comment">Comments</option>
                <option value="share">Shares</option>
                <option value="view">Views</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Data Table */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th 
                    scope="col" 
                    className="cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    Type {sortField === 'type' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                  <th 
                    scope="col"
                    className="cursor-pointer"
                    onClick={() => handleSort('userName')}
                  >
                    User {sortField === 'userName' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                  <th 
                    scope="col"
                    className="cursor-pointer"
                    onClick={() => handleSort('contentTitle')}
                  >
                    Content {sortField === 'contentTitle' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                  <th scope="col">Message</th>
                  <th 
                    scope="col"
                    className="cursor-pointer"
                    onClick={() => handleSort('timestamp')}
                  >
                    Time {sortField === 'timestamp' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedInteractions.map((interaction) => (
                  <tr key={interaction.id}>
                    <td>
                      <Badge bg={getBadgeVariant(interaction.type)} className="d-flex align-items-center w-fit">
                        <IconifyIcon 
                          icon={getInteractionIcon(interaction.type)} 
                          className="fs-12 me-1" 
                        />
                        {interaction.type}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="avatar-xs rounded-circle me-2"
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundImage: `url(${interaction.userAvatar})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        {interaction.userName}
                      </div>
                    </td>
                    <td className="text-truncate" style={{ maxWidth: '200px' }}>
                      {interaction.contentTitle}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                      {interaction.message || '-'}
                    </td>
                    <td className="text-muted small">
                      {formatTimeAgo(interaction.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Row className="mt-4">
              <Col className="d-flex justify-content-center">
                <div className="d-flex align-items-center">
                  {renderPagination()}
                </div>
              </Col>
            </Row>
          )}

          {paginatedInteractions.length === 0 && (
            <div className="text-center py-5">
              <IconifyIcon icon="solar:inbox-broken" className="fs-48 text-muted mb-3" />
              <h5 className="text-muted">No interactions found</h5>
              <p className="text-muted">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default InteractionsPage