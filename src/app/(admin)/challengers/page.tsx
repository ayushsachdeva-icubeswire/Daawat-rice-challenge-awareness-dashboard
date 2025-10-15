import { useState, useMemo, useEffect } from 'react'
import { Card, CardBody, CardHeader, Row, Col, Button, Badge, Form, InputGroup, ProgressBar } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import Footer from '@/components/layout/Footer'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { mockChallenges } from '@/app/(admin)/dashboards/mockData'
import { Challenge } from '@/types/dashboard'
import { useNotificationContext } from '@/context/useNotificationContext'
import { Challenger, ChallengerFilters } from '@/types/challenger';
import ChallengerService from '@/services/challengerService';
import moment from "moment-timezone";


const ChallengesPage = () => {

  const { showNotification } = useNotificationContext()
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Challenger[]>([])
  const [filters, setFilters] = useState<ChallengerFilters>({
    page: 1,
    limit: 10,
    search: "",
    duration: ""
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
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

  useEffect(() => {
    const loadChallenger = async () => {
      try {
        setLoading(true)
        const response = await ChallengerService.getAllChallengers(filters)
        setData(response.data || [])
        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          totalItems: response.totalItems || 0,
          itemsPerPage: 10 // Default value since API doesn't return this
        })
      } catch (error) {
        console.error('❌ Error fetching diet plans:', error)
        showNotification({ message: 'Error fetching diet plans', variant: 'danger' })
        setData([]) // Ensure dietPlans is always an array even on error
      } finally {
        setLoading(false)
      }
    }

    loadChallenger();
  }, [filters])

  const handleSort = (field: keyof Challenge) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
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
      <PageTitle subName="Daawat" title="Challengers" />

      <Card>
        <CardHeader>
          <Row className="align-items-center">
            <Col>
              <h5 className="card-title mb-0">All Challengers</h5>
              <small className="text-muted">
                Users who have completed the challenge and got a diet plan.
              </small>
            </Col>
            <Col xs="auto">
              <Badge bg="primary" pill>{pagination.totalItems}</Badge>
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
                  placeholder="Search challengers by name, mobile..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filters.duration}
                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
              >
                <option value="">Duration</option>
                <option value="7 days">7 Days</option>
                <option value="1 months">1 Month</option>
                <option value="3 months">3 Months</option>
              </Form.Select>
            </Col>
            {/* <Col md={2}>
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
            </Col> */}
          </Row>

          {/* Data Table */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th
                      scope="col"
                      className="cursor-pointer"
                      onClick={() => handleSort('title')}
                    >
                      Name {sortField === 'title' && (
                        <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                      )}
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer"
                      onClick={() => handleSort('difficulty')}
                    >
                      Mobile {sortField === 'difficulty' && (
                        <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                      )}
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer"
                      onClick={() => handleSort('category')}
                    >
                      Duration {sortField === 'category' && (
                        <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                      )}
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      Category {sortField === 'status' && (
                        <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                      )}
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer"
                      onClick={() => handleSort('points')}
                    >
                      Subcategory {sortField === 'points' && (
                        <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                      )}
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer"
                      onClick={() => handleSort('participantCount')}
                    >
                      Type {sortField === 'participantCount' && (
                        <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                      )}
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer"
                      onClick={() => handleSort('participantCount')}
                    >
                      CreatedAt {sortField === 'participantCount' && (
                        <IconifyIcon icon={sortDirection === 'asc' ? 'solar:alt-arrow-up-broken' : 'solar:alt-arrow-down-broken'} />
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((challenge) => (
                    <tr key={challenge._id}>
                      <td>
                        <div>
                          <h6 className="mb-1">{challenge.name}</h6>
                          {/* <small className="text-muted text-truncate d-block" style={{ maxWidth: '200px' }}>
                          {challenge.description}
                        </small> */}
                        </div>
                      </td>
                      <td>
                        <a href={`tel:${challenge.mobile}`}><h6 className="mb-1">{challenge.mobile}</h6></a>
                      </td>
                      <td>
                        <span className="text-muted">{challenge.duration}</span>
                      </td>
                      <td>
                        <span className="text-muted">{challenge.category}</span>
                      </td>
                      <td>
                        <span className="text-muted">{challenge.subcategory}</span>
                      </td>
                      <td>
                        <span className="text-muted">{challenge.type}</span>
                      </td>
                      <td>
                        <span className="text-muted">{moment(challenge.createdAt).format("DD MMM, YYYY hh:mm a")}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav aria-label="Diet plans pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page} className={`page-item ${pagination.currentPage === page ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}

          {data.length === 0 && (
            <div className="text-center py-5">
              <IconifyIcon icon="solar:cup-star-broken" className="fs-48 text-muted mb-3" />
              <h5 className="text-muted">No challengers found</h5>
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