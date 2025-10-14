import { useState } from 'react'
import { Card, CardBody, Nav, Tab, Row, Col } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import InteractionsList from './InteractionsList'
import ChallengesList from './ChallengesList'
import PostsList from './PostsList'
import ChatComponent from './ChatComponent'
import { 
  getRecentInteractions, 
  getActiveChallenges, 
  getRecentPostsData, 
  getChatMessagesByType 
} from '../mockData'

const ActivityTabs = () => {
  const [activeTab, setActiveTab] = useState('interactions')

  const handleSendMessage = (message: string, type: 'interaction' | 'challenge' | 'post') => {
    console.log(`Sending ${type} message:`, message)
    // Here you would typically send the message to your backend
  }

  const tabs = [
    {
      key: 'interactions',
      title: 'Interactions',
      icon: 'solar:chat-round-line-broken',
      color: '#3b82f6'
    },
    {
      key: 'challenges',
      title: 'Challenges',
      icon: 'solar:cup-star-broken',
      color: '#10b981'
    },
    {
      key: 'posts',
      title: 'Posts',
      icon: 'solar:document-text-broken',
      color: '#f59e0b'
    }
  ]

  return (
    <Card>
      <CardBody className="p-0">
        <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || 'interactions')}>
          <Nav variant="tabs" className="border-bottom">
            {tabs.map((tab) => (
              <Nav.Item key={tab.key}>
                <Nav.Link 
                  eventKey={tab.key}
                  className="d-flex align-items-center px-4 py-3"
                >
                  <IconifyIcon 
                    icon={tab.icon} 
                    className="fs-18 me-2" 
                    color={activeTab === tab.key ? tab.color : '#6b7280'}
                  />
                  {tab.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="interactions">
              <Row className="g-3 p-3">
                <Col lg={6}>
                  <InteractionsList 
                    interactions={getRecentInteractions(8)}
                    title="Recent Interactions"
                    showHeader={true}
                    maxHeight="350px"
                  />
                </Col>
                <Col lg={6}>
                  <ChatComponent
                    messages={getChatMessagesByType('interaction', 10)}
                    title="Interaction Chats"
                    showHeader={true}
                    maxHeight="300px"
                    onSendMessage={(message) => handleSendMessage(message, 'interaction')}
                    placeholder="Share your thoughts on interactions..."
                  />
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="challenges">
              <Row className="g-3 p-3">
                <Col lg={6}>
                  <ChallengesList 
                    challenges={getActiveChallenges(8)}
                    title="Active Challenges"
                    showHeader={true}
                    maxHeight="350px"
                  />
                </Col>
                <Col lg={6}>
                  <ChatComponent
                    messages={getChatMessagesByType('challenge', 10)}
                    title="Challenge Discussions"
                    showHeader={true}
                    maxHeight="300px"
                    onSendMessage={(message) => handleSendMessage(message, 'challenge')}
                    placeholder="Discuss challenges with others..."
                  />
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="posts">
              <Row className="g-3 p-3">
                <Col lg={6}>
                  <PostsList 
                    posts={getRecentPostsData(8)}
                    title="Recent Posts"
                    showHeader={true}
                    maxHeight="350px"
                  />
                </Col>
                <Col lg={6}>
                  <ChatComponent
                    messages={getChatMessagesByType('post', 10)}
                    title="Post Comments"
                    showHeader={true}
                    maxHeight="300px"
                    onSendMessage={(message) => handleSendMessage(message, 'post')}
                    placeholder="Comment on posts..."
                  />
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </CardBody>
    </Card>
  )
}

export default ActivityTabs