import { useState, useEffect } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import Footer from '@/components/layout/Footer'
import { useNotificationContext } from '@/context/useNotificationContext'
import { Challenger, ChallengerFilters } from '@/types/challenger'
import ChallengerService from '@/services/challengerService'
import { API_CONFIG } from '@/config/api'


const ChallengersPage = () => {
  const { showNotification } = useNotificationContext()
  const [loading, setLoading] = useState(false)
  const [challengers, setChallengers] = useState<Challenger[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<ChallengerFilters>({
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  // Load challengers from API
  useEffect(() => {
    const loadChallengers = async () => {
      try {
        setLoading(true)
        const combinedFilters = {
          ...filters,
          search: searchTerm
        }
        const response = await ChallengerService.getAllChallengers(combinedFilters)
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

    const timeoutId = setTimeout(loadChallengers, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [filters.page, filters.limit, filters.category, filters.subcategory, filters.type, filters.duration, searchTerm, showNotification])

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  // Handle PDF viewing
  const handleViewPDF = (pdfUrl: string) => {
    try {
      
      // Check if URL is already absolute
      if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
        return;
      }
      
      // For relative URLs, use the API base URL
      let fullUrl = pdfUrl;
      if (pdfUrl.startsWith('/')) {
        fullUrl = `${API_CONFIG.BASE_URL}/${pdfUrl}`;
      } else {
        fullUrl = `${API_CONFIG.BASE_URL}/${pdfUrl}`;
      }
      
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('Error opening PDF:', error);
      alert(`Error opening PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return (
    <>
      <PageTitle subName="Daawat" title="Challengers" />
      
      <ComponentContainerCard id="challengers-list" title="All Challengers" description="Manage and view all registered challengers">
        {/* Search and Filters */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search challengers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.category || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
            >
              <option value="">All Categories</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Keto">Keto</option>
              <option value="High Protein">High Protein</option>
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.duration || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value || undefined }))}
            >
              <option value="">All Durations</option>
              <option value="7 days">7 days</option>
              <option value="1 month">1 month</option>
              <option value="3 months">3 months</option>
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.type || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value || undefined }))}
            >
              <option value="">All Types</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Building">Muscle Building</option>
              <option value="General Health">General Health</option>
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.limit?.toString() || '10'}
              onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading challengers...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name & Contact</th>
                  <th>Category & Type</th>
                  <th>Duration</th>
                  <th>Subcategory</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {challengers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <i className="fas fa-users fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">No challengers found</h5>
                      <p className="text-muted">Try adjusting your search or filter criteria.</p>
                    </td>
                  </tr>
                ) : (
                  challengers.map((challenger) => (
                    <tr key={challenger._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-md me-2">
                            <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
                              {challenger.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <h6 className="mb-0">{challenger.name}</h6>
                            <small className="text-muted">
                              <i className="fas fa-phone me-1"></i>
                              <a href={`tel:${challenger.mobile}`} className="text-decoration-none">
                                {challenger.mobile}
                              </a>
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span className={`badge ${challenger.category === 'Vegetarian' ? 'bg-success' : challenger.category === 'Keto' ? 'bg-warning' : 'bg-info'} mb-1`}>
                            {challenger.category}
                          </span>
                          <br />
                          <small className="text-muted">{challenger.type}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{challenger.duration}</span>
                      </td>
                      <td>
                        <span className="text-muted">{challenger.subcategory || 'N/A'}</span>
                      </td>
                      <td>
                        <span className={`badge ${challenger.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {challenger.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted">
                          {challenger.createdAt ? new Date(challenger.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td>
                        {challenger.pdf ? (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleViewPDF(challenger.pdf)}
                            title="View PDF"
                          >
                            <i className="fas fa-file-pdf me-1"></i>
                            View
                          </button>
                        ) : (
                          <span className="text-muted">No PDF</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <nav aria-label="Challengers pagination">
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

        {/* Stats */}
        {!loading && challengers.length > 0 && (
          <div className="row mt-3">
            <div className="col-md-6">
              <small className="text-muted">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} challengers
              </small>
            </div>
          </div>
        )}
      </ComponentContainerCard>
      
      <Footer />
    </>
  )
}

export default ChallengersPage