import { useState, useEffect } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import Footer from '@/components/layout/Footer'
import { useNotificationContext } from '@/context/useNotificationContext'
import { Challenger, ChallengerFilters } from '@/types/challenger'
import ChallengerService from '@/services/challengerService'
import { API_CONFIG } from '@/config/api'

const ChallengersUTMPage = () => {
  const { showNotification } = useNotificationContext()
  const [loading, setLoading] = useState(false)
  const [challengers, setChallengers] = useState<Challenger[]>([])
  
  // UTM and Date Range Filters
  const [utmUrl, setUtmUrl] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  
  const [filters, setFilters] = useState<ChallengerFilters>({
    page: 1,
    limit: 10
  })
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    actualCount: 0
  })

  // Predefined UTM URLs for dropdown selection
  const predefinedUTMs = [
    {
      label: 'Meta2 - LPV Campaign',
      url: 'https://www.daawat.com/rya/?utm_source=icubeswire2&utm_medium=meta2&utm_campaign=lpv'
    },
    {
      label: 'Meta2 - Custom Audience',
      url: 'https://www.daawat.com/rya/?utm_source=icubeswire2&utm_medium=google2&utm_campaign=custom+audience'
    },
    {
      label: 'RYA Base URL',
      url: 'https://www.daawat.com/rya/'
    }
  ]

  // Load challengers from API
  useEffect(() => {
    const loadChallengers = async () => {
      try {
        setLoading(true)
        const combinedFilters: ChallengerFilters = {
          ...filters,
          utm_url: utmUrl || undefined,
          from: fromDate || undefined,
          to: toDate || undefined
        }
        
        const response = await ChallengerService.getUTMChallengers(combinedFilters)
        setChallengers(response.data || [])
        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          totalItems: response.totalItems || 0,
          actualCount: response.actualCount || 0,
          itemsPerPage: filters.limit || 10
        })
      } catch (error) {
        console.error('❌ Error fetching UTM challengers:', error)
        showNotification({ message: 'Error fetching challengers', variant: 'danger' })
        setChallengers([])
      } finally {
        setLoading(false)
      }
    }

    loadChallengers()
  }, [filters.page, filters.limit, utmUrl, fromDate, toDate, showNotification])

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  // Handle PDF viewing
  const handleViewPDF = (pdfUrl: string) => {
    try {
      // Check if URL is already absolute
      if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer')
        return
      }
      
      // For relative URLs, use the API base URL
      let fullUrl = pdfUrl
      if (pdfUrl.startsWith('/')) {
        fullUrl = `${API_CONFIG.BASE_URL}${pdfUrl}`
      } else {
        fullUrl = `${API_CONFIG.BASE_URL}/${pdfUrl}`
      }
      
      window.open(fullUrl, '_blank', 'noopener,noreferrer')
      
    } catch (error) {
      console.error('Error opening PDF:', error)
      showNotification({ 
        message: `Error opening PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'danger'
      })
    }
  }

  // Handle search/filter
//   const handleApplyFilters = () => {
//     setFilters(prev => ({ ...prev, page: 1 })) // Reset to page 1 when applying filters
//   }

  // Handle clear filters
  const handleClearFilters = () => {
    setUtmUrl('')
    setFromDate('')
    setToDate('')
    setFilters({ page: 1, limit: 10 })
  }

  return (
    <>
      <PageTitle subName="Daawat" title="Challengers by UTM" />

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <div className="card shadow-sm border-0 h-100 bg-primary-subtle">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h6 className="mb-1 text-primary">Total Challengers</h6>
              <h3 className="mb-0 fw-bold text-primary">{pagination.actualCount}</h3>
            </div>
          </div>
        </div>
        {/* <div className="col-md-3 mb-2">
          <div className="card shadow-sm border-0 h-100 bg-success-subtle">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h6 className="mb-1 text-success">Current Page</h6>
              <h3 className="mb-0 fw-bold text-success">{pagination.currentPage} / {pagination.totalPages}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="card shadow-sm border-0 h-100 bg-info-subtle">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h6 className="mb-1 text-info">With Diet Plans</h6>
              <h3 className="mb-0 fw-bold text-info">
                {challengers.filter(c => c.pdf).length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="card shadow-sm border-0 h-100 bg-warning-subtle">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h6 className="mb-1 text-warning">Without Diet Plans</h6>
              <h3 className="mb-0 fw-bold text-warning">
                {challengers.filter(c => !c.pdf).length}
              </h3>
            </div>
          </div>
        </div> */}
      </div>

      <ComponentContainerCard 
        id="challengers-utm-list" 
        title="UTM Challengers" 
        description="View challengers filtered by UTM parameters and date range"
      >
        {/* Filters */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">
              <i className="fas fa-filter me-2"></i>
              Filters
            </h5>
          </div>
          <div className="card-body">
            {/* Quick Select UTM URLs */}
            {/* <div className="mb-3">
              <label className="form-label fw-semibold">Quick Select Campaign</label>
              <div className="btn-group w-100" role="group">
                {predefinedUTMs.map((utm, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`btn btn-sm ${utmUrl === utm.url ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setUtmUrl(utm.url)}
                  >
                    {utm.label}
                  </button>
                ))}
              </div>
            </div> */}

            {/* UTM URL Dropdown */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <i className="fas fa-link me-2"></i>
                UTM URL
              </label>
              <select
                className="form-select"
                value={utmUrl}
                onChange={(e) => setUtmUrl(e.target.value)}
              >
                <option value="">Select UTM URL...</option>
                {predefinedUTMs.map((utm, index) => (
                  <option key={index} value={utm.url}>
                    {utm.label}
                  </option>
                ))}
              </select>
              <small className="text-muted">Select a UTM URL to filter challengers</small>
            </div>

            {/* Date Range */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <i className="fas fa-calendar-alt me-2"></i>
                  From Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  max={toDate || undefined}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <i className="fas fa-calendar-alt me-2"></i>
                  To Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate || undefined}
                />
              </div>
            </div>

            {/* Items per page */}
            {/* <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Items per page</label>
                <select
                  className="form-select"
                  value={filters.limit?.toString() || '10'}
                  onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              {/* <button 
                className="btn btn-primary"
                onClick={handleApplyFilters}
                disabled={loading}
              >
                <i className="fas fa-search me-2"></i>
                Apply Filters
              </button> */}
              <button 
                className="btn btn-outline-secondary"
                onClick={handleClearFilters}
                disabled={loading}
              >
                <i className="fas fa-redo me-2"></i>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading challengers...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '5%' }}>#</th>
                    <th style={{ width: '20%' }}>Name & Contact</th>
                    <th style={{ width: '15%' }}>Category</th>
                    <th style={{ width: '10%' }}>Duration</th>
                    <th style={{ width: '15%' }}>Subcategory</th>
                    <th style={{ width: '12%' }}>Created At</th>
                    <th style={{ width: '13%' }}>Diet Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {challengers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5">
                        <i className="fas fa-users fa-3x text-muted mb-3"></i>
                        <h5 className="text-muted">No challengers found</h5>
                        <p className="text-muted">
                          {utmUrl || fromDate || toDate 
                            ? 'Try adjusting your filter criteria.' 
                            : 'Apply filters to search for challengers.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    challengers.map((challenger, index) => (
                      <tr key={challenger._id}>
                        <td className="text-center">
                          {((pagination.currentPage - 1) * pagination.itemsPerPage) + index + 1}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-md me-2">
                              <div className="avatar-title bg-primary-subtle text-primary rounded-circle fw-bold">
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
                            <span className={`badge ${
                              challenger.category === 'Vegetarian' ? 'bg-success' : 
                              challenger.category === 'Veg + Egg' ? 'bg-info' : 
                              'bg-warning'
                            } mb-1`}>
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
                          <span className="text-muted">
                            {challenger.createdAt 
                              ? new Date(challenger.createdAt).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'N/A'}
                          </span>
                          <br />
                          <small className="text-muted">
                            {challenger.createdAt 
                              ? new Date(challenger.createdAt).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : ''}
                          </small>
                        </td>
                        <td>
                          {challenger.pdf ? (
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleViewPDF(challenger.pdf)}
                              title="View PDF"
                            >
                              <i className="fas fa-file-pdf me-1"></i>
                              View Plan
                            </button>
                          ) : (
                            <span className="text-muted">
                              <i className="fas fa-ban me-1"></i>
                              No plan
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-4">
                <nav aria-label="Challengers pagination">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                      >
                        <i className="fas fa-chevron-left me-1"></i>
                        Previous
                      </button>
                    </li>
                    
                    {/* First page */}
                    {pagination.currentPage > 3 && (
                      <>
                        <li className="page-item">
                          <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
                        </li>
                        {pagination.currentPage > 4 && (
                          <li className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        )}
                      </>
                    )}
                    
                    {/* Pages around current */}
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page =>
                        page === pagination.currentPage ||
                        page === pagination.currentPage - 2 ||
                        page === pagination.currentPage - 1 ||
                        page === pagination.currentPage + 1 ||
                        page === pagination.currentPage + 2
                      )
                      .map(page => (
                        <li key={page} className={`page-item ${pagination.currentPage === page ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                    
                    {/* Last page */}
                    {pagination.currentPage < pagination.totalPages - 2 && (
                      <>
                        {pagination.currentPage < pagination.totalPages - 3 && (
                          <li className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        )}
                        <li className="page-item">
                          <button className="page-link" onClick={() => handlePageChange(pagination.totalPages)}>
                            {pagination.totalPages}
                          </button>
                        </li>
                      </>
                    )}
                    
                    <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                      >
                        Next
                        <i className="fas fa-chevron-right ms-1"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
                
                {/* Stats */}
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                    {pagination.totalItems} challengers
                  </small>
                </div>
              </div>
            )}
          </>
        )}
      </ComponentContainerCard>
      
      <Footer />
    </>
  )
}

export default ChallengersUTMPage
