import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState, useEffect } from 'react'
import { useNotificationContext } from '@/context/useNotificationContext'
import DietPlanService from '@/services/dietPlanService'
import { DietPlan, DietPlanFilters, DIET_CATEGORIES, DIET_TYPES, DIET_SUBCATEGORIES } from '@/types/diet-plan'
import DietPlanForm from './components/DietPlanForm'

const DietPlanPage = () => {
  
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<DietPlanFilters>({
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const [showForm, setShowForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<DietPlan | null>(null)

  const { showNotification } = useNotificationContext()

  // Fetch diet plans function for manual calls
  const fetchDietPlans = async () => {
    try {
      // console.log('🔄 Manual: fetchDietPlans called with filters:', filters)
      setLoading(true)
      const response = await DietPlanService.getAllDietPlans(filters)
      setDietPlans(response.data || [])
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        totalItems: response.totalItems || 0,
        itemsPerPage: 10 // Default value since API doesn't return this
      })
    } catch (error) {
      console.error('Error fetching diet plans:', error)
      showNotification({ message: 'Error fetching diet plans', variant: 'danger' })
      setDietPlans([]) // Ensure dietPlans is always an array even on error
    } finally {
      setLoading(false)
    }
  }

  // Effect to fetch data when filters change
  useEffect(() => {
    const loadDietPlans = async () => {
      try {
        setLoading(true)
        const response = await DietPlanService.getAllDietPlans(filters)
        setDietPlans(response.data || [])
        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          totalItems: response.totalItems || 0,
          itemsPerPage: 10 // Default value since API doesn't return this
        })
      } catch (error) {
        console.error('❌ Error fetching diet plans:', error)
        showNotification({ message: 'Error fetching diet plans', variant: 'danger' })
        setDietPlans([]) // Ensure dietPlans is always an array even on error
      } finally {
        setLoading(false)
      }
    }
    
    loadDietPlans()
    
 
  }, [filters])

  // Filter diet plans based on search term
  const filteredPlans = (dietPlans || []).filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.subcategory && plan.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Handle PDF download
  const handleDownloadPDF = async (plan: DietPlan) => {
    if (!plan._id || !plan.pdfFile) {
      showNotification({ message: 'No PDF file available for this diet plan', variant: 'warning' })
      return
    }

    try {
      const blob = await DietPlanService.downloadPDF(plan._id)
      DietPlanService.triggerPDFDownload(blob, plan.pdfFile.filename)
      showNotification({ message: 'PDF downloaded successfully', variant: 'success' })
    } catch (error) {
      console.error('Error downloading PDF:', error)
      showNotification({ message: 'Error downloading PDF', variant: 'danger' })
    }
  }



  // Handle form submission
  const handleFormSubmit = () => {
    setShowForm(false)
    setEditingPlan(null)
    fetchDietPlans()
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  return (
    <>
      <PageTitle title="Diet Plan" subName="Manage and track diet plans" />
      
      <div className="container-fluid">
        <ComponentContainerCard
          id="diet-plan-container"
          title="Diet Plans Management"
          description="Manage and track all diet plans for rice challenge awareness"
        >
          {/* Filters and Actions */}
          <div className="row mb-3">
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search diet plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.category || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
              >
                <option value="">All Categories</option>
                {DIET_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.subcategory || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, subcategory: e.target.value || undefined }))}
              >
                <option value="">All Subcategories</option>
                {DIET_SUBCATEGORIES.map(subcategory => (
                  <option key={subcategory} value={subcategory}>{subcategory}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.type || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value || undefined }))}
              >
                <option value="">All Types</option>
                {DIET_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.isActive === undefined ? '' : filters.isActive.toString()}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  isActive: e.target.value === '' ? undefined : e.target.value === 'true'
                }))}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="col-md-2 text-end">
              <button 
                className="btn btn-primary me-2"
                onClick={() => setShowForm(true)}
              >
                <i className="fas fa-plus me-2"></i>Add New Plan
              </button>
              {/* <button 
                className="btn btn-danger"
                onClick={() => setDeleteModal({ show: true, plan: null, isDeleteAll: true })}
                disabled={dietPlans.length === 0}
              >
                <i className="fas fa-trash me-2"></i>Delete All
              </button> */}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Diet Plans Table */}
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Plan Name</th>
                      <th>Duration</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Subcategory</th>
                      <th>PDF</th>
                      <th>Creator</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlans.map((plan) => (
                      <tr key={plan._id}>
                        <td className="fw-semibold">{plan.name}</td>
                        <td>
                          <span className="badge bg-info">{plan.duration}</span>
                        </td>
                        <td>{plan.type}</td>
                        <td>
                          <span className="badge bg-secondary">{plan.category}</span>
                        </td>
                        <td>
                          {plan.subcategory ? (
                            <span className="badge bg-light text-dark">{plan.subcategory}</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {plan.pdfFile ? (
                            <div className="d-flex flex-column">
                              <button
                                className="btn btn-sm btn-outline-success mb-1"
                                onClick={() => handleDownloadPDF(plan)}
                                title="Download PDF"
                              >
                                <i className="fas fa-download me-1"></i>
                                {plan.pdfFile.originalName}
                              </button>
                              <small className="text-muted">
                                {(plan.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                              </small>
                            </div>
                          ) : (
                            <span className="text-muted">No PDF</span>
                          )}
                        </td>
                        <td>
                          {plan.createdBy && typeof plan.createdBy === 'object' ? (
                            <div className="d-flex flex-column">
                              <span className="fw-semibold">{plan.createdBy.username}</span>
                              <small className="text-muted">{plan.createdBy.email}</small>
                            </div>
                          ) : (
                            <span className="text-muted">Unknown</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${plan.isActive ? 'bg-success' : 'bg-secondary'}`}>
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => {
                                setEditingPlan(plan)
                                setShowForm(true)
                              }}
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            {/* <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => setDeleteModal({ show: true, plan, isDeleteAll: false })}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredPlans.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted">No diet plans found.</p>
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
            </>
          )}
        </ComponentContainerCard>
      </div>

      {/* Diet Plan Form Modal */}
      {showForm && (
        <DietPlanForm
          show={showForm}
          onHide={() => {
            setShowForm(false)
            setEditingPlan(null)
          }}
          editingPlan={editingPlan}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {/* <DeleteConfirmationModal
        show={deleteModal.show}
        onHide={() => setDeleteModal({ show: false, plan: null, isDeleteAll: false })}
        onConfirm={deleteModal.isDeleteAll ? handleDeleteAll : () => deleteModal.plan && handleDelete(deleteModal.plan)}
        title={deleteModal.isDeleteAll ? 'Delete All Diet Plans' : 'Delete Diet Plan'}
        message={
          deleteModal.isDeleteAll 
            ? 'Are you sure you want to delete all diet plans? This action cannot be undone.'
            : `Are you sure you want to delete "${deleteModal.plan?.name}"? This action cannot be undone.`
        }
      /> */}
    </>
  )
}

export default DietPlanPage