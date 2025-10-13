import { Modal, Button } from 'react-bootstrap'

interface DeleteConfirmationModalProps {
  show: boolean
  onHide: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmButtonText?: string
  confirmButtonVariant?: string
}

const DeleteConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Delete',
  confirmButtonVariant = 'danger'
}: DeleteConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm()
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {title}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant={confirmButtonVariant} onClick={handleConfirm}>
          <i className="fas fa-trash me-2"></i>
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteConfirmationModal