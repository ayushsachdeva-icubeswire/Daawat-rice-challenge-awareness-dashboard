import { useState, useEffect } from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { useNotificationContext } from '@/context/useNotificationContext'
import DietPlanService from '@/services/dietPlanService'
import { DietPlan, DietPlanFormData, DIET_CATEGORIES, DIET_TYPES, DIET_SUBCATEGORIES, DURATION_OPTIONS } from '@/types/diet-plan'

interface DietPlanFormProps {
  show: boolean
  onHide: () => void
  editingPlan?: DietPlan | null
  onSubmit: () => void
}

const DietPlanForm = ({ show, onHide, editingPlan, onSubmit }: DietPlanFormProps) => {
  const [formData, setFormData] = useState<DietPlanFormData>({
    name: '',
    duration: '',
    type: '',
    category: '',
    subcategory: '',
    description: '',
    isActive: true
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { showNotification } = useNotificationContext()

  // Initialize form data when editing
  useEffect(() => {
    if (editingPlan) {
      setFormData({
        name: editingPlan.name || '',
        duration: editingPlan.duration || '',
        type: editingPlan.type || '',
        category: editingPlan.category || '',
        subcategory: editingPlan.subcategory || '',
        description: editingPlan.description || '',
        isActive: editingPlan.isActive ?? true
      })
    } else {
      // Reset form for new plan
      setFormData({
        name: '',
        duration: '',
        type: '',
        category: '',
        subcategory: '',
        description: '',
        isActive: true
      })
    }
    setErrors({})
  }, [editingPlan, show])

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required'
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required'
    }

    if (!formData.type) {
      newErrors.type = 'Type is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      if (editingPlan && editingPlan._id) {
        // Update existing plan
        await DietPlanService.updateDietPlan(editingPlan._id, formData)
        showNotification({ message: 'Diet plan updated successfully', variant: 'success' })
      } else {
        // Create new plan
        await DietPlanService.createDietPlan(formData)
        showNotification({ message: 'Diet plan created successfully', variant: 'success' })
      }
      onSubmit()
    } catch (error) {
      console.error('Error saving diet plan:', error)
      showNotification({ 
        message: `Error ${editingPlan ? 'updating' : 'creating'} diet plan`, 
        variant: 'danger' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof DietPlanFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        showNotification({ message: 'Only PDF files are allowed', variant: 'warning' })
        e.target.value = '' // Clear the input
        return
      }
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxSize) {
        showNotification({ message: 'File size must be less than 10MB', variant: 'warning' })
        e.target.value = '' // Clear the input
        return
      }

      handleInputChange('pdfFile', file)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      duration: '',
      type: '',
      category: '',
      subcategory: '',
      description: '',
      isActive: true
    })
    setErrors({})
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingPlan ? 'Edit Diet Plan' : 'Create New Diet Plan'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Plan Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  isInvalid={!!errors.name}
                  placeholder="Enter diet plan name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Duration <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  isInvalid={!!errors.duration}
                >
                  <option value="">Select duration</option>
                  {DURATION_OPTIONS.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.duration}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  isInvalid={!!errors.type}
                >
                  <option value="">Select type</option>
                  {DIET_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.type}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  isInvalid={!!errors.category}
                >
                  <option value="">Select category</option>
                  {DIET_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Subcategory</Form.Label>
                <Form.Select
                  value={formData.subcategory}
                  onChange={(e) => handleInputChange('subcategory', e.target.value)}
                >
                  <option value="">Select subcategory (optional)</option>
                  {DIET_SUBCATEGORIES.map(subcategory => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Optional additional classification for the diet plan.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>PDF File</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <Form.Text className="text-muted">
                  Upload a PDF file (max 10MB). Only PDF files are allowed.
                </Form.Text>
                {editingPlan?.pdfFile && (
                  <div className="mt-2">
                    <small className="text-success">
                      <i className="fas fa-file-pdf me-1"></i>
                      Current file: {editingPlan.pdfFile.filename}
                    </small>
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter diet plan description (optional)"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                />
                <Form.Text className="text-muted">
                  Only active diet plans will be visible to users.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {editingPlan ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              editingPlan ? 'Update Plan' : 'Create Plan'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default DietPlanForm