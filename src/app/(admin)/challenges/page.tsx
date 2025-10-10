import { useState, useMemo } from 'react'
import { Card, CardBody, CardHeader, Row, Col, Button, Badge, Form, InputGroup, ProgressBar } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import Footer from '@/components/layout/Footer'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { mockChallenges } from '@/app/(admin)/dashboards/mockData'
import { Challenge } from '@/types/dashboard'



const ChallengesPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<Challenge['status'] | 'all'>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<Challenge['difficulty'] | 'all'>('all')
  const [sortField, setSortField] = useState<keyof Challenge>('startDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Generate more mock data for demonstration
  const extendedMockChallenges = useMemo(() => {
    const baseChallenges = [...mockChallenges]
    const additionalChallenges = []
    
    const titles = [
      'Bengali Rice Fish Curry Challenge', 'Kashmiri Yakhni Pulao Mastery', 'Andhra Spicy Rice Challenge',
      'Gujarati Khichdi Variations', 'Punjabi Rajma Rice Challenge', 'Maharashtrian Bhel Puri Rice',
      'Kerala Coconut Rice Special', 'Tamil Nadu Sambar Rice', 'Goan Fish Curry Rice Bowl',
      'Rajasthani Dal Bati Rice', 'Assamese Sticky Rice Dessert', 'Odia Kheer Rice Challenge'
    ]
    
    const categories = ['Regional', 'Biryani', 'Healthy', 'Desserts', 'Quick Meals', 'Heritage']
    const difficulties: Challenge['difficulty'][] = ['easy', 'medium', 'hard']
    const statuses: Challenge['status'][] = ['not-started', 'in-progress', 'completed', 'failed']
    
    for (let i = 0; i < 40; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const startDate = status !== 'not-started' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined
      const completionDate = status === 'completed' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
      
      additionalChallenges.push({
        id: `challenge-${i + 6}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        description: `Master this authentic ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()} rice recipe and share your journey with your Instagram followers.`,
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        points: Math.floor(Math.random() * 500) + 100,
        status,
        startDate,
        completionDate,
        participantCount: Math.floor(Math.random() * 500) + 50,
        timeLimit: Math.floor(Math.random() * 240) + 60,
      })
    }
    
    return [...baseChallenges, ...additionalChallenges]
  }, [])

  // Filter and search logic
  const filteredChallenges = useMemo(() => {
    return extendedMockChallenges.filter(challenge => {
      const matchesSearch = 
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || challenge.status === filterStatus
      const matchesDifficulty = filterDifficulty === 'all' || challenge.difficulty === filterDifficulty
      
      return matchesSearch && matchesStatus && matchesDifficulty
    })
  }, [extendedMockChallenges, searchTerm, filterStatus, filterDifficulty])

  // Sort logic
  const sortedChallenges = useMemo(() => {
    return [...filteredChallenges].sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      if (sortField === 'startDate' || sortField === 'completionDate') {
        aValue = aValue ? new Date(aValue as Date).getTime() : 0
        bValue = bValue ? new Date(bValue as Date).getTime() : 0
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (aValue == null) aValue = sortField === 'points' ? 0 : ''
      if (bValue == null) bValue = sortField === 'points' ? 0 : ''
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredChallenges, sortField, sortDirection])

  // Pagination logic
  const totalPages = Math.ceil(sortedChallenges.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedChallenges = sortedChallenges.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: keyof Challenge) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getDifficultyVariant = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'success'
      case 'medium': return 'warning'
      case 'hard': return 'danger'
      default: return 'secondary'
    }
  }

  const getStatusVariant = (status: Challenge['status']) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in-progress': return 'primary'
      case 'failed': return 'danger'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: Challenge['status']) => {
    switch (status) {
      case 'completed': return 'solar:check-circle-broken'
      case 'in-progress': return 'solar:play-circle-broken'
      case 'failed': return 'solar:close-circle-broken'
      default: return 'solar:pause-circle-broken'
    }
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

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
      <PageTitle subName="Daawat" title="Challenges" />
      
      <Card>
        <CardHeader>
          <Row className="align-items-center">
            <Col>
              <h5 className="card-title mb-0">All Challenges</h5>
              <small className="text-muted">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedChallenges.length)} of {sortedChallenges.length} challenges
              </small>
            </Col>
            <Col xs="auto">
              <Badge bg="primary" pill>{sortedChallenges.length}</Badge>
            </Col>
          </Row>
        </CardHeader>
        
        <CardBody>
          {/* Filters and Search */}
          <Row className="mb-4">
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <IconifyIcon icon="solar:magnifer-broken" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as Challenge['status'] | 'all')}
              >
                <option value="all">All Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value as Challenge['difficulty'] | 'all')}
              >
                <option value="all">All Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
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
                    onClick={() => handleSort('title')}
                  >
                    Challenge {sortField === 'title' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                  <th 
                    scope="col"
                    className="cursor-pointer"
                    onClick={() => handleSort('difficulty')}
                  >
                    Difficulty {sortField === 'difficulty' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                  <th 
                    scope="col"
                    className="cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    Category {sortField === 'category' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                  <th 
                    scope="col"
                    className="cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortField === 'status' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                  <th 
                    scope="col"
                    className="cursor-pointer"
                    onClick={() => handleSort('points')}
                  >
                    Points {sortField === 'points' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                  <th 
                    scope="col"
                    className="cursor-pointer"
                    onClick={() => handleSort('participantCount')}
                  >
                    Participants {sortField === 'participantCount' && (
                      <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                    )}
                  </th>
                  <th scope="col">Progress</th>
                </tr>
              </thead>
              <tbody>
                {paginatedChallenges.map((challenge) => (
                  <tr key={challenge.id}>
                    <td>
                      <div>
                        <h6 className="mb-1">{challenge.title}</h6>
                        <small className="text-muted text-truncate d-block" style={{ maxWidth: '200px' }}>
                          {challenge.description}
                        </small>
                      </div>
                    </td>
                    <td>
                      <Badge bg={getDifficultyVariant(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </td>
                    <td>
                      <span className="text-muted">{challenge.category}</span>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(challenge.status)} className="d-flex align-items-center w-fit">
                        <IconifyIcon 
                          icon={getStatusIcon(challenge.status)} 
                          className="fs-12 me-1" 
                        />
                        {challenge.status.replace('-', ' ')}
                      </Badge>
                    </td>
                    <td>
                      <strong className="text-primary">{challenge.points}</strong>
                    </td>
                    <td>
                      <span className="text-muted">{challenge.participantCount}</span>
                    </td>
                    <td style={{ width: '150px' }}>
                      {challenge.status === 'in-progress' && (
                        <div>
                          <div className="d-flex justify-content-between mb-1">
                            <small>Progress</small>
                            <small>65%</small>
                          </div>
                          <ProgressBar now={65} variant="primary" style={{ height: '4px' }} />
                        </div>
                      )}
                      {challenge.status === 'completed' && (
                        <div className="text-success small">
                          <IconifyIcon icon="solar:check-circle-broken" className="me-1" />
                          Completed
                        </div>
                      )}
                      {challenge.status === 'not-started' && (
                        <div className="text-muted small">
                          <IconifyIcon icon="solar:pause-circle-broken" className="me-1" />
                          Not Started
                        </div>
                      )}
                      {challenge.status === 'failed' && (
                        <div className="text-danger small">
                          <IconifyIcon icon="solar:close-circle-broken" className="me-1" />
                          Failed
                        </div>
                      )}
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

          {paginatedChallenges.length === 0 && (
            <div className="text-center py-5">
              <IconifyIcon icon="solar:cup-star-broken" className="fs-48 text-muted mb-3" />
              <h5 className="text-muted">No challenges found</h5>
              <p className="text-muted">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardBody>
      </Card>

      <Footer />
    </>
  )
}

export default ChallengesPage