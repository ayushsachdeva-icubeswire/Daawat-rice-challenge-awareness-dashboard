import { useState } from 'react'
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import TextFormInput from './from/TextFormInput'
import DropzoneFormInput from './from/DropzoneFormInput'
import { createStory } from '@/services/storyService'

interface CreateStoryModalProps {
  show: boolean
  onHide: () => void
  onStoryCreated?: () => void
}

interface StoryFormData {
  handle: string
  storyLink: string
  views: string
  likes: string
}

const storySchema = yup.object({
  handle: yup
    .string()
    .required('Handle is required')
    .min(3, 'Handle must be at least 3 characters')
    .max(50, 'Handle cannot exceed 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores'),
  storyLink: yup
    .string()
    .required('Story link is required')
    .url('Must be a valid URL')
    .matches(
      /^https?:\/\/(www\.)?(instagram|facebook|twitter|tiktok)\.com\/.+/,
      'Must be a valid social media URL (Instagram, Facebook, Twitter, or TikTok)'
    ),
  views: yup
    .string()
    .required('Views is required')
    .matches(/^\d+$/, 'Views must be a positive number')
    .test('min-value', 'Views must be at least 0', (value) => {
      return value ? parseInt(value) >= 0 : false
    })
    .test('max-value', 'Views cannot exceed 10 million', (value) => {
      return value ? parseInt(value) <= 10000000 : false
    }),
  likes: yup
    .string()
    .required('Likes is required')
    .matches(/^\d+$/, 'Likes must be a positive number')
    .test('min-value', 'Likes must be at least 0', (value) => {
      return value ? parseInt(value) >= 0 : false
    })
    .test('max-value', 'Likes cannot exceed 1 million', (value) => {
      return value ? parseInt(value) <= 1000000 : false
    })
    .test('logical-validation', 'Likes cannot be more than views', function(value) {
      const { views } = this.parent
      if (views && value) {
        return parseInt(value) <= parseInt(views)
      }
      return true
    })
})

const CreateStoryModal = ({ show, onHide, onStoryCreated }: CreateStoryModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const { control, handleSubmit, reset } = useForm<StoryFormData>({
    resolver: yupResolver(storySchema),
    defaultValues: {
      handle: '',
      storyLink: '',
      views: '',
      likes: ''
    }
  })

  const handleClose = () => {
    reset()
    setSelectedImage(null)
    setSubmitError(null)
    setSubmitSuccess(false)
    onHide()
  }

  const handleImageUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0]
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setSubmitError('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
        return
      }
      
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        setSubmitError('Image file size must be less than 5MB')
        return
      }
      
      // Clear any previous errors and set the selected image
      setSubmitError(null)
      setSelectedImage(file)
    }
  }

  const onSubmit = async (data: StoryFormData) => {
    if (!selectedImage) {
      setSubmitError('Please select an image')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      // Use the story service to create the story (it will handle auth token automatically)
      const result = await createStory({
        handle: data.handle,
        image: selectedImage,
        storyLink: data.storyLink,
        views: data.views,
        likes: data.likes
      })

      if (!result.success) {
        throw new Error(result.message || 'Failed to create story')
      }

      setSubmitSuccess(true)
      
      // Reset form after successful submission
      setTimeout(() => {
        reset()
        setSelectedImage(null)
        setSubmitSuccess(false)
        onStoryCreated?.()
        onHide()
      }, 2000)

    } catch (error) {
      console.error('Error creating story:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create story'
      
      // Check if it's an authentication error
      if (errorMessage.includes('Authentication token not found') || errorMessage.includes('login')) {
        setSubmitError('Authentication required. Please log in again and try.')
      } else {
        setSubmitError(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-plus-circle me-2 text-primary"></i>
          Create New Story
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {submitError && (
          <Alert variant="danger" className="mb-3">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {submitError}
          </Alert>
        )}
        
        {submitSuccess && (
          <Alert variant="success" className="mb-3">
            <i className="fas fa-check-circle me-2"></i>
            Story created successfully! The modal will close automatically.
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <TextFormInput
                name="handle"
                control={control}
                label="Handle"
                placeholder="e.g., smriti_mandhana_cute_girl"
                containerClassName="mb-3"
              />
            </Col>
            <Col md={6}>
              <TextFormInput
                name="storyLink"
                control={control}
                label="Story Link"
                placeholder="https://www.instagram.com/p/..."
                containerClassName="mb-3"
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <TextFormInput
                name="views"
                control={control}
                label="Views"
                type="number"
                placeholder="e.g., 1000"
                containerClassName="mb-3"
                min="0"
                max="10000000"
              />
            </Col>
            <Col md={6}>
              <TextFormInput
                name="likes"
                control={control}
                label="Likes"
                type="number"
                placeholder="e.g., 1010"
                containerClassName="mb-3"
                min="0"
                max="1000000"
              />
            </Col>
          </Row>

          <div className="mb-3">
            <DropzoneFormInput
              label="Upload Story Image"
              labelClassName="form-label"
              text="Drop your image here or click to browse"
              textClassName="h5 mb-2"
              helpText="Supported formats: JPG, PNG, GIF (Max: 5MB)"
              showPreview={true}
              onFileUpload={handleImageUpload}
              iconProps={{
                icon: 'bx:cloud-upload',
                className: 'text-primary',
                style: { fontSize: '48px' }
              }}
            />
            {selectedImage && (
              <div className="mt-2">
                <small className="text-success">
                  <i className="fas fa-check me-1"></i>
                  Selected: {selectedImage.name}
                </small>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button 
              variant="secondary" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus me-2"></i>
                  Create Story
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateStoryModal