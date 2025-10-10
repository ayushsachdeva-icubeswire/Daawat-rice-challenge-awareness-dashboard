import { Card, CardBody, CardHeader, ListGroup, Badge, Row, Col, Form, InputGroup, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { ChatMessage } from '@/types/dashboard'
import { useState } from 'react'

// Simple time formatter
const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d`
  }
}

interface ChatComponentProps {
  messages: ChatMessage[]
  title?: string
  showHeader?: boolean
  maxHeight?: string
  onSendMessage?: (message: string) => void
  placeholder?: string
}

const ChatComponent = ({ 
  messages, 
  title = "Chat Messages", 
  showHeader = true,
  maxHeight = "400px",
  onSendMessage,
  placeholder = "Type a message..."
}: ChatComponentProps) => {
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage.trim())
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getTypeColor = (type: ChatMessage['type']) => {
    switch (type) {
      case 'interaction':
        return '#3b82f6'
      case 'challenge':
        return '#10b981'
      case 'post':
        return '#f59e0b'
      default:
        return '#8b5cf6'
    }
  }

  const getTypeIcon = (type: ChatMessage['type']) => {
    switch (type) {
      case 'interaction':
        return 'solar:chat-round-line-broken'
      case 'challenge':
        return 'solar:cup-star-broken'
      case 'post':
        return 'solar:document-text-broken'
      default:
        return 'solar:star-broken'
    }
  }

  const unreadCount = messages.filter(msg => !msg.isRead).length

  return (
    <Card className="h-100">
      {showHeader && (
        <CardHeader className="d-flex align-items-center justify-content-between">
          <h5 className="card-title mb-0">{title}</h5>
          <div className="d-flex align-items-center">
            {unreadCount > 0 && (
              <Badge bg="danger" pill className="me-2">{unreadCount}</Badge>
            )}
            <Badge bg="primary" pill>{messages.length}</Badge>
          </div>
        </CardHeader>
      )}
      <CardBody className="p-0 d-flex flex-column">
        <div 
          style={{ maxHeight, overflowY: 'auto', flex: 1 }}
          className="border-bottom"
        >
          <ListGroup variant="flush">
            {messages.length === 0 ? (
              <ListGroup.Item className="text-center py-4 text-muted">
                <IconifyIcon icon="solar:chat-round-line-broken" className="fs-48 mb-2" />
                <p>No messages yet</p>
              </ListGroup.Item>
            ) : (
              messages.map((message) => (
                <ListGroup.Item 
                  key={message.id} 
                  className={`px-3 py-3 ${!message.isRead ? 'bg-light' : ''}`}
                >
                  <Row className="align-items-start">
                    <Col xs="auto">
                      <div className="position-relative">
                        <div 
                          className="avatar-sm rounded-circle d-flex align-items-center justify-content-center border"
                          style={{ 
                            backgroundImage: `url(${message.senderAvatar})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        <div 
                          className="position-absolute top-0 end-0 translate-middle"
                          style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: getTypeColor(message.type),
                            borderRadius: '50%',
                            border: '2px solid white'
                          }}
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0 me-2">{message.senderName}</h6>
                          {!message.isRead && (
                            <div 
                              className="bg-primary rounded-circle"
                              style={{ width: '6px', height: '6px' }}
                            />
                          )}
                        </div>
                        <div className="d-flex align-items-center">
                          <Badge 
                            style={{ backgroundColor: `${getTypeColor(message.type)}20`, color: getTypeColor(message.type) }}
                            className="me-2"
                          >
                            <IconifyIcon icon={getTypeIcon(message.type)} className="fs-10 me-1" />
                            {message.type}
                          </Badge>
                          <small className="text-muted">
                            {formatTimeAgo(message.timestamp)}
                          </small>
                        </div>
                      </div>
                      
                      <p className="mb-0 text-dark">{message.message}</p>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </div>
        
        {onSendMessage && (
          <div className="p-3">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder={placeholder}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button 
                variant="primary" 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <IconifyIcon icon="solar:plain-3-broken" />
              </Button>
            </InputGroup>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default ChatComponent