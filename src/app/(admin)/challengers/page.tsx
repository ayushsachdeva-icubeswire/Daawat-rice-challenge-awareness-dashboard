import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardBody, CardHeader, Row, Col, Button, Badge, Form, InputGroup, Table, Spinner } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import Footer from '@/components/layout/Footer'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useNotificationContext } from '@/context/useNotificationContext'
import { Challenger, ChallengerFilters } from '@/types/challenger'
import ChallengerService from '@/services/challengerService'


const ChallengersPage = () => {
  const { showNotification } = useNotificationContext()
  const [loading, setLoading] = useState(false)
  const [challengers, setChallengers] = useState<Challenger[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState<ChallengerFilters>({
    page: 1,
    limit: 10,
    search: "",
    duration: ""
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load challengers from API
  useEffect(() => {
    const loadChallengers = async () => {
      try {
        setLoading(true)
        const response = await ChallengerService.getAllChallengers(filters)
        setChallengers(response.data || [])
        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          totalItems: response.totalItems || 0,
          itemsPerPage: filters.limit || 10
        })
      } catch (error) {
        console.error('❌ Error fetching challengers:', error)
        showNotification({ message: 'Error fetching challengers', variant: 'danger' })
        setChallengers([])
      } finally {
        setLoading(false)
      }
    }

    loadChallengers()
  }, [filters.page, filters.limit, filters.search, filters.duration, filters.category, filters.subcategory, filters.type, showNotification])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Handle search with debouncing
  const handleSearch = useCallback((searchValue: string) => {
    setSearchInput(searchValue)
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // Set new timeout for debouncing
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchValue,
        page: 1 // Reset to first page when searching
      }))
    }, 500) // 500ms debounce
  }, [])

  // Handle filter changes
  const handleFilterChange = (key: keyof ChallengerFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }))
  }

  // Handle items per page change
  const handleItemsPerPageChange = (limit: number) => {
    setFilters(prev => ({
      ...prev,
      limit,
      page: 1 // Reset to first page when changing items per page
    }))
  }

  // Delete challenger
  const handleDeleteChallenger = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this challenger?')) {
      return
    }

    try {
      setLoading(true)
      await ChallengerService.deleteChallenger(id)
      showNotification({ message: 'Challenger deleted successfully', variant: 'success' })
      
      // Reload challengers
      const response = await ChallengerService.getAllChallengers(filters)
      setChallengers(response.data || [])
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        totalItems: response.totalItems || 0,
        itemsPerPage: filters.limit || 10
      })
    } catch (error) {
      console.error('❌ Error deleting challenger:', error)
      showNotification({ message: 'Error deleting challenger', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  // Get status badge variant
  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'success' : 'secondary'
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }



  return (
    <>
      <PageTitle subName="Daawat" title="Challengers" />
      
      <Row>
        <Col xs={12}>
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0">All Challengers</h5>
                <p className="text-muted mb-0">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  {pagination.totalItems} challengers
                </p>
              </div>
            </CardHeader>
            
            <CardBody>
              {/* Filters */}
              <Row className="mb-4">
                <Col lg={6}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search challengers..."
                      value={searchInput}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                    <Button variant="outline-secondary">
                      <IconifyIcon icon="solar:magnifer-linear" />
                    </Button>
                  </InputGroup>
                </Col>
                
                <Col lg={2}>
                  <Form.Select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Keto">Keto</option>
                    <option value="High Protein">High Protein</option>
                  </Form.Select>
                </Col>
                
                <Col lg={2}>
                  <Form.Select
                    value={filters.duration || ''}
                    onChange={(e) => handleFilterChange('duration', e.target.value)}
                  >
                    <option value="">All Durations</option>
                    <option value="7 days">7 days</option>
                    <option value="1 month">1 month</option>
                    <option value="3 months">3 months</option>
                  </Form.Select>
                </Col>
                
                <Col lg={2}>
                  <Form.Select
                    value={filters.limit?.toString() || '10'}
                    onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                  </Form.Select>
                </Col>
              </Row>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p className="mt-2">Loading challengers...</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && challengers.length === 0 && (
                <div className="text-center py-5">
                  <IconifyIcon icon="solar:user-cross-rounded-bold" className="fs-1 text-muted mb-3" />
                  <h5 className="text-muted">No challengers found</h5>
                  <p className="text-muted">Try adjusting your search criteria or filters.</p>
                </div>
              )}

              {/* Challengers Table */}
              {!loading && challengers.length > 0 && (
                <div className="table-responsive">
                  <Table className="table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {challengers.map((challenger) => (
                        <tr key={challenger._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-md me-2">
                                <div className="avatar-title bg-light-primary text-primary rounded-circle">
                                  {challenger.name.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div>
                                <h6 className="mb-0">{challenger.name}</h6>
                                {challenger.subcategory && (
                                  <small className="text-muted">{challenger.subcategory}</small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{challenger.mobile}</td>
                          <td>
                            <Badge bg="light" text="dark">{challenger.category}</Badge>
                          </td>
                          <td>{challenger.type}</td>
                          <td>{challenger.duration}</td>
                          <td>
                            <Badge bg={getStatusBadgeVariant(challenger.isActive)}>
                              {challenger.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>{formatDate(challenger.createdAt)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              {challenger.pdf && (
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => window.open(challenger.pdf, '_blank')}
                                  title="View PDF"
                                >
                                  <IconifyIcon icon="solar:document-text-linear" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => challenger._id && handleDeleteChallenger(challenger._id)}
                                title="Delete Challenger"
                              >
                                <IconifyIcon icon="solar:trash-bin-minimalistic-linear" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {!loading && challengers.length > 0 && pagination.totalPages > 1 && (
                <Row className="mt-4">
                  <Col className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </small>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        disabled={pagination.currentPage <= 1}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                      >
                        <IconifyIcon icon="solar:alt-arrow-left-linear" />
                        Previous
                      </Button>
                      
                      {/* Page Numbers */}
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = i + 1
                        return (
                          <Button
                            key={pageNum}
                            size="sm"
                            variant={pageNum === pagination.currentPage ? 'primary' : 'outline-primary'}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                      
                      <Button
                        size="sm"
                        variant="outline-primary"
                        disabled={pagination.currentPage >= pagination.totalPages}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                      >
                        Next
                        <IconifyIcon icon="solar:alt-arrow-right-linear" />
                      </Button>
                    </div>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      <Footer />
    </>
  )
}

export default ChallengersPage